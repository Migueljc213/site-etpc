import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');

    if (moduleId) {
      // Buscar prova específica de um módulo
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

      return NextResponse.json(exam);
    }

    // Listar todas as provas
    const exams = await prisma.moduleExam.findMany({
      include: {
        module: {
          select: { title: true }
        },
        questions: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(exams);
  } catch (error) {
    console.error('Error fetching exams:', error);
    return NextResponse.json({ error: 'Erro ao buscar provas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const data = await request.json();
    const { moduleId, questions, ...examData } = data;

    // Criar prova
    const exam = await prisma.moduleExam.create({
      data: {
        ...examData,
        moduleId,
        passingScore: examData.passingScore || 70
      }
    });

    // Criar questões
    if (questions && Array.isArray(questions)) {
      for (const question of questions) {
        const { options, correctAnswer, ...questionData } = question;
        
        const createdQuestion = await prisma.examQuestion.create({
          data: {
            ...questionData,
            examId: exam.id,
            correctAnswer
          }
        });

        // Criar opções
        if (options && Array.isArray(options)) {
          await prisma.examOption.createMany({
            data: options.map((option: any) => ({
              text: option.text,
              order: option.order,
              questionId: createdQuestion.id
            }))
          });
        }
      }
    }

    const examWithQuestions = await prisma.moduleExam.findUnique({
      where: { id: exam.id },
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

    return NextResponse.json(examWithQuestions, { status: 201 });
  } catch (error: any) {
    console.error('Error creating exam:', error);
    return NextResponse.json({ error: 'Erro ao criar prova', details: error.message }, { status: 500 });
  }
}


