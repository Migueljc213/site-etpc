import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const courseId = searchParams.get('courseId');

    if (!email || !courseId) {
      return NextResponse.json(
        { error: 'Email e courseId são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar matrícula específica do aluno
    const enrollment = await prisma.studentEnrollment.findUnique({
      where: {
        studentEmail_courseId: {
          studentEmail: email,
          courseId: courseId
        }
      },
      select: {
        id: true,
        status: true,
        enrolledAt: true,
        expiresAt: true,
        completedAt: true
      }
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Matrícula não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error('Error fetching enrollment:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar matrícula' },
      { status: 500 }
    );
  }
}

