import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// Função para gerar número único de certificado
function generateCertificateNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ETPC-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { enrollmentId } = await request.json();
    const userEmail = session.user.email!;

    // Buscar matrícula do aluno
    const enrollment = await prisma.studentEnrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: {
          include: {
            modules: {
              include: {
                exam: true,
                onlineLessons: true
              }
            }
          }
        },
        examAttempts: {
          include: {
            exam: {
              include: {
                module: true
              }
            }
          }
        },
        certificate: true
      }
    });

    // Validações
    if (!enrollment) {
      return NextResponse.json({ error: 'Matrícula não encontrada' }, { status: 404 });
    }

    if (enrollment.studentEmail !== userEmail) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    // Verificar se já tem certificado
    if (enrollment.certificate) {
      return NextResponse.json({
        message: 'Certificado já existe',
        certificate: enrollment.certificate
      });
    }

    // Verificar se o curso está completo
    if (enrollment.status !== 'completed') {
      return NextResponse.json({
        error: 'Curso não concluído. Complete todas as aulas e provas.'
      }, { status: 400 });
    }

    // Verificar se todas as provas obrigatórias foram aprovadas
    const requiredModules = enrollment.course.modules.filter(m => m.exam?.isRequired);
    const passedExams = enrollment.examAttempts.filter(attempt => attempt.passed);

    const allRequiredExamsPassed = requiredModules.every(module => {
      return passedExams.some(attempt => attempt.exam.moduleId === module.id);
    });

    if (!allRequiredExamsPassed) {
      return NextResponse.json({
        error: 'Você precisa ser aprovado em todas as provas obrigatórias para gerar o certificado.'
      }, { status: 400 });
    }

    // Gerar certificado
    const certificateNumber = generateCertificateNumber();

    const certificate = await prisma.certificate.create({
      data: {
        enrollmentId: enrollment.id,
        certificateNumber,
        issuedAt: new Date(),
        pdfUrl: null // Será gerado no futuro se necessário
      }
    });

    // Atualizar data de conclusão da matrícula se ainda não foi definida
    if (!enrollment.completedAt) {
      await prisma.studentEnrollment.update({
        where: { id: enrollment.id },
        data: { completedAt: new Date() }
      });
    }

    return NextResponse.json({
      message: 'Certificado gerado com sucesso!',
      certificate: {
        id: certificate.id,
        certificateNumber: certificate.certificateNumber,
        issuedAt: certificate.issuedAt,
        course: {
          title: enrollment.course.title,
          instructor: enrollment.course.instructor,
          duration: enrollment.course.duration
        }
      }
    });

  } catch (error) {
    console.error('Error generating certificate:', error);
    return NextResponse.json({
      error: 'Erro ao gerar certificado'
    }, { status: 500 });
  }
}
