import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar matrículas do aluno
    const enrollments = await prisma.studentEnrollment.findMany({
      where: {
        studentEmail: email,
        status: {
          in: ['active', 'completed']
        }
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            image: true,
            instructor: true,
            duration: true
          }
        }
      }
    });

    // Buscar progresso de cada curso
    const coursesWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const courseId = enrollment.courseId;
        
        // Buscar módulos e aulas do curso
        // Primeiro, buscar o Course correspondente ao OnlineCourse
        const course = await prisma.course.findFirst({
          where: { slug: enrollment.course.slug }
        });
        
        let modules = [];
        let allLessons = [];
        
        if (course) {
          modules = await prisma.courseModule.findMany({
            where: { 
              courseId: course.id 
            },
            include: {
              onlineLessons: true
            }
          });
          
          allLessons = modules.flatMap(m => m.onlineLessons);
        }

        const totalMinutes = allLessons.length > 0 ? allLessons.reduce((sum, lesson) => sum + lesson.duration, 0) : 0;

        // Buscar progresso do aluno
        const progressData = await prisma.studentProgress.findMany({
          where: {
            studentEmail: email,
            lessonId: {
              in: allLessons.map(l => l.id)
            }
          }
        });

        const watchedMinutes = progressData.reduce((sum, p) => sum + Math.floor(p.watchTime / 60), 0);
        const completedLessons = progressData.filter(p => p.watched).length;
        const progress = allLessons.length > 0 
          ? Math.round((completedLessons / allLessons.length) * 100)
          : 0;

        return {
          id: enrollment.course.id,
          title: enrollment.course.title,
          slug: enrollment.course.slug,
          image: enrollment.course.image || '',
          instructor: enrollment.course.instructor,
          progress,
          totalMinutes,
          watchedMinutes,
          expiresAt: enrollment.expiresAt?.toISOString(),
          enrolledAt: enrollment.enrolledAt.toISOString(),
          status: enrollment.status
        };
      })
    );

    return NextResponse.json(coursesWithProgress);
  } catch (error) {
    console.error('Error fetching student courses:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar cursos do aluno' },
      { status: 500 }
    );
  }
}

