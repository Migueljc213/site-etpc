import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { lessonId, studentEmail, watchTime, watched } = await request.json();

    if (!lessonId || !studentEmail) {
      return NextResponse.json(
        { error: 'lessonId e studentEmail são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se já existe progresso
    const existingProgress = await prisma.studentProgress.findUnique({
      where: {
        lessonId_studentEmail: {
          lessonId,
          studentEmail
        }
      }
    });

    if (existingProgress) {
      // Atualizar progresso existente
      const updatedProgress = await prisma.studentProgress.update({
        where: {
          id: existingProgress.id
        },
        data: {
          watchTime: watchTime !== undefined ? watchTime : existingProgress.watchTime,
          watched: watched !== undefined ? watched : existingProgress.watched,
          completedAt: watched ? new Date() : existingProgress.completedAt
        }
      });

      return NextResponse.json(updatedProgress);
    } else {
      // Criar novo progresso
      const newProgress = await prisma.studentProgress.create({
        data: {
          lessonId,
          studentEmail,
          watchTime: watchTime || 0,
          watched: watched || false,
          completedAt: watched ? new Date() : null
        }
      });

      return NextResponse.json(newProgress);
    }
  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar progresso' },
      { status: 500 }
    );
  }
}

