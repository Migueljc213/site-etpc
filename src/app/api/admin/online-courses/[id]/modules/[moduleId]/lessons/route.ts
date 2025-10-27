import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const { moduleId } = await params;
    const { title, description, videoUrl, duration, order } = await request.json();

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        videoUrl,
        duration: duration || 0,
        order: order || 0,
        moduleId
      }
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json(
      { error: 'Erro ao criar aula' },
      { status: 500 }
    );
  }
}

