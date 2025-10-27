import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const { moduleId } = await params;
    
    const lessons = await prisma.lesson.findMany({
      where: { moduleId },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar aulas' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const { moduleId } = await params;
    const { title, description, videoUrl, duration, order } = await request.json();

    console.log('Creating lesson with data:', { moduleId, title, description, videoUrl, duration, order });

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
      { error: 'Erro ao criar aula', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

