import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const exam = await prisma.moduleExam.findUnique({
      where: { id },
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
  } catch (error) {
    console.error('Error fetching exam:', error);
    return NextResponse.json({ error: 'Erro ao buscar prova' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const data = await request.json();
    const { questions, ...examData } = data;

    // Atualizar prova
    const exam = await prisma.moduleExam.update({
      where: { id },
      data: examData
    });

    // Se houver questões, atualizar
    if (questions && Array.isArray(questions)) {
      // Deletar todas as questões e opções antigas
      await prisma.examOption.deleteMany({
        where: { question: { examId: id } }
      });
      
      await prisma.examQuestion.deleteMany({
        where: { examId: id }
      });

      // Criar novas questões
      for (const question of questions) {
        const { options, correctAnswer, ...questionData } = question;
        
        const createdQuestion = await prisma.examQuestion.create({
          data: {
            ...questionData,
            examId: id,
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
      where: { id },
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

    return NextResponse.json(examWithQuestions);
  } catch (error: any) {
    console.error('Error updating exam:', error);
    return NextResponse.json({ error: 'Erro ao atualizar prova', details: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    
    await prisma.moduleExam.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting exam:', error);
    return NextResponse.json({ error: 'Erro ao excluir prova' }, { status: 500 });
  }
}


