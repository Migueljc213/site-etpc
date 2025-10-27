import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar curso pelo slug
    const course = await prisma.onlineCourse.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        instructor: true,
        duration: true
      }
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se o aluno está matriculado
    const enrollment = await prisma.studentEnrollment.findUnique({
      where: {
        studentEmail_courseId: {
          studentEmail: email,
          courseId: course.id
        }
      }
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Você não está matriculado neste curso' },
        { status: 403 }
      );
    }

    // Buscar módulos e aulas
    const modules = await prisma.courseModule.findMany({
      where: { courseId: course.id },
      orderBy: { order: 'asc' },
      include: {
        onlineLessons: {
          orderBy: { order: 'asc' }
        }
      }
    });

    // Buscar progresso do aluno
    const lessonIds = modules.flatMap(m => m.onlineLessons.map(l => l.id));
    const progressData = await prisma.studentProgress.findMany({
      where: {
        studentEmail: email,
        lessonId: { in: lessonIds }
      }
    });

    // Criar mapa de progresso
    const progressMap = new Map(
      progressData.map(p => [p.lessonId, { watched: p.watched, watchTime: p.watchTime }])
    );

    // Montar resposta com módulos e aulas
    const modulesWithProgress = modules.map(module => ({
      id: module.id,
      title: module.title,
      description: module.description || '',
      lessons: module.onlineLessons.map(lesson => {
        const progress = progressMap.get(lesson.id) || { watched: false, watchTime: 0 };
        return {
          id: lesson.id,
          title: lesson.title,
          description: lesson.description || '',
          videoUrl: lesson.videoUrl || '',
          duration: lesson.duration,
          order: lesson.order,
          watched: progress.watched,
          watchTime: progress.watchTime
        };
      })
    }));

    return NextResponse.json({
      ...course,
      modules: modulesWithProgress
    });
  } catch (error) {
    console.error('Error fetching course details:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar detalhes do curso' },
      { status: 500 }
    );
  }
}

