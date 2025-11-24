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

    // Buscar curso online pelo slug
    const onlineCourse = await prisma.onlineCourse.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        image: true,
        instructor: true,
        duration: true
      }
    });

    if (!onlineCourse) {
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
          courseId: onlineCourse.id
        }
      }
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Você não está matriculado neste curso' },
        { status: 403 }
      );
    }

    // Buscar o Course (técnico) correspondente ao OnlineCourse
    const course = await prisma.course.findUnique({
      where: { slug }
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Módulos e aulas não encontrados para este curso' },
        { status: 404 }
      );
    }

    // Buscar módulos e aulas do Course (técnico)
    const modules = await prisma.courseModule.findMany({
      where: { courseId: course.id },
      orderBy: { order: 'asc' },
      include: {
        onlineLessons: {
          orderBy: { order: 'asc' }
        },
        exam: {
          include: {
            questions: {
              select: { id: true, order: true }
            }
          }
        }
      }
    });

    console.log(`📦 Módulos encontrados: ${modules.length}`);

    // Buscar progresso do aluno
    const lessonIds = modules.flatMap(m => m.onlineLessons.map(l => l.id));
    console.log(`📚 Lesson IDs encontrados: ${lessonIds.length}`);
    
    const progressData = await prisma.studentProgress.findMany({
      where: {
        studentEmail: email,
        lessonId: { in: lessonIds }
      }
    });
    
    console.log(`📊 Progresso encontrado: ${progressData.length} registros`);

    // Criar mapa de progresso
    const progressMap = new Map(
      progressData.map(p => [p.lessonId, { watched: p.watched, watchTime: p.watchTime }])
    );

    // Buscar tentativas de prova do aluno
    const examAttempts = await prisma.examAttempt.findMany({
      where: { studentEmail: email },
      select: { examId: true, passed: true, score: true }
    });
    
    const attemptsMap = new Map(
      examAttempts.map(a => [a.examId, { passed: a.passed, score: a.score }])
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
      }),
      exam: module.exam ? {
        id: module.exam.id,
        title: module.exam.title,
        description: module.exam.description,
        passingScore: module.exam.passingScore,
        timeLimit: module.exam.timeLimit,
        isRequired: module.exam.isRequired,
        totalQuestions: module.exam.questions.length,
        hasAttempt: attemptsMap.has(module.exam.id),
        passed: attemptsMap.get(module.exam.id)?.passed || false,
        lastScore: attemptsMap.get(module.exam.id)?.score
      } : null
    }));
    
    console.log(`✅ Módulos com progresso montados: ${modulesWithProgress.length}`);
    console.log(`📚 Total de aulas: ${modulesWithProgress.reduce((sum, m) => sum + m.lessons.length, 0)}`);

    return NextResponse.json({
      id: onlineCourse.id,
      title: onlineCourse.title,
      description: onlineCourse.description || '',
      slug: onlineCourse.slug,
      image: onlineCourse.image,
      instructor: onlineCourse.instructor,
      duration: onlineCourse.duration,
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

