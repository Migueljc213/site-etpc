import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// Função para verificar e emitir certificado
async function checkAndIssueCertificate(enrollmentId: string, studentEmail: string, currentExamId: string) {
  try {
    // Buscar a matrícula completa
    const enrollment = await prisma.studentEnrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: true
      }
    });

    if (!enrollment) return;

    // Buscar todos os módulos do curso
    const course = await prisma.course.findFirst({
      where: { slug: enrollment.course.slug }
    });

    if (!course) return;

    const modules = await prisma.courseModule.findMany({
      where: { courseId: course.id },
      include: {
        exam: true
      }
    });

    // Verificar se todas as provas obrigatórias foram aprovadas
    const requiredExams = modules.filter(m => m.exam && m.exam.isRequired);
    
    if (requiredExams.length === 0) return; // Sem provas obrigatórias

    // Buscar todas as tentativas aprovadas do aluno
    const allAttempts = await prisma.examAttempt.findMany({
      where: {
        studentEmail,
        passed: true
      },
      select: { examId: true }
    });

    const passedExamIds = new Set(allAttempts.map(a => a.examId));
    
    // Verificar se todas as provas obrigatórias foram aprovadas
    const allRequiredExamsPassed = requiredExams.every(m => 
      m.exam && passedExamIds.has(m.exam.id)
    );

    if (allRequiredExamsPassed) {
      // Emitir certificado
      await prisma.certificate.upsert({
        where: { enrollmentId },
        update: {}, // Certificado já existe
        create: {
          enrollmentId,
          certificateNumber: `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          issuedAt: new Date()
        }
      });

      // Atualizar status da matrícula para completed
      await prisma.studentEnrollment.update({
        where: { id: enrollmentId },
        data: {
          status: 'completed',
          completedAt: new Date()
        }
      });

      console.log(`✅ Certificado emitido para ${studentEmail} no curso ${enrollment.course.title}`);
    }
  } catch (error) {
    console.error('Error checking certificate:', error);
  }
}

// Buscar prova de um módulo
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');

    if (!moduleId) {
      return NextResponse.json({ error: 'moduleId é obrigatório' }, { status: 400 });
    }

    // Buscar prova
    const exam = await prisma.moduleExam.findUnique({
      where: { moduleId },
      include: {
        questions: {
          include: {
            options: {
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!exam) {
      return NextResponse.json({ error: 'Prova não encontrada' }, { status: 404 });
    }

    // Remover respostas corretas antes de enviar para o aluno
    const examWithoutAnswers = {
      ...exam,
      questions: exam.questions.map((q: any) => ({
        ...q,
        correctAnswer: undefined // Não enviar a resposta correta
      }))
    };

    return NextResponse.json(examWithoutAnswers);
  } catch (error) {
    console.error('Error fetching exam:', error);
    return NextResponse.json({ error: 'Erro ao buscar prova' }, { status: 500 });
  }
}

// Submeter prova
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const data = await request.json();
    const { examId, answers } = data;
    const userEmail = session.user.email!;

    if (!examId || !answers) {
      return NextResponse.json({ error: 'examId e answers são obrigatórios' }, { status: 400 });
    }

    // Buscar prova com respostas corretas
    const exam = await prisma.moduleExam.findUnique({
      where: { id: examId },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    });

    if (!exam) {
      return NextResponse.json({ error: 'Prova não encontrada' }, { status: 404 });
    }

    // Calcular pontuação
    let correctAnswers = 0;
    const totalQuestions = exam.questions.length;

    for (const question of exam.questions) {
      const studentAnswer = answers[question.id];
      if (studentAnswer === question.correctAnswer) {
        correctAnswers++;
      }
    }

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= exam.passingScore;

    // Buscar matrícula do aluno
    const enrollment = await prisma.studentEnrollment.findFirst({
      where: {
        studentEmail: userEmail
      }
    });

    if (!enrollment) {
      return NextResponse.json({ error: 'Matrícula não encontrada' }, { status: 404 });
    }

    // Salvar tentativa
    const attempt = await prisma.examAttempt.create({
      data: {
        examId: exam.id,
        enrollmentId: enrollment.id,
        studentEmail: userEmail,
        score,
        passed,
        answers: JSON.stringify(answers),
        completedAt: new Date()
      }
    });

    // Verificar se aluno completou o curso (se passou em todas as provas obrigatórias)
    await checkAndIssueCertificate(enrollment.id, userEmail, exam.id);

    return NextResponse.json({
      ...attempt,
      correctAnswers,
      totalQuestions,
      passingScore: exam.passingScore
    });
  } catch (error: any) {
    console.error('Error submitting exam:', error);
    return NextResponse.json({ error: 'Erro ao submeter prova', details: error.message }, { status: 500 });
  }
}

