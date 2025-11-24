import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ certificateNumber: string }> }
) {
  try {
    const { certificateNumber } = await params;

    const certificate = await prisma.certificate.findUnique({
      where: { certificateNumber },
      include: {
        enrollment: {
          include: {
            course: {
              select: {
                title: true,
                instructor: true,
                duration: true
              }
            }
          }
        }
      }
    });

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificado não encontrado' },
        { status: 404 }
      );
    }

    // Buscar informações do aluno (pode ser da sessão ou do email da matrícula)
    const studentEmail = certificate.enrollment.studentEmail;

    // Aqui você pode buscar o nome do aluno de uma tabela de usuários se tiver
    // Por enquanto, vamos usar o email como nome
    const studentName = studentEmail.split('@')[0].replace(/[._]/g, ' ').split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return NextResponse.json({
      certificateNumber: certificate.certificateNumber,
      issuedAt: certificate.issuedAt,
      studentName,
      studentEmail,
      course: certificate.enrollment.course
    });

  } catch (error) {
    console.error('Error fetching certificate:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar certificado' },
      { status: 500 }
    );
  }
}
