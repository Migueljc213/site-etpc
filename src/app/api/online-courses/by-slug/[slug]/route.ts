import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const onlineCourse = await prisma.onlineCourse.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        image: true,
        instructor: true,
        price: true,
        discountPrice: true,
        duration: true,
        level: true,
        category: true,
        rating: true,
        totalStudents: true,
        whatYouWillLearn: true,
        requirements: true,
        validityDays: true
      }
    });

    if (!onlineCourse) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
      );
    }

    let whatYouWillLearn: string[] = [];
    if (onlineCourse.whatYouWillLearn) {
      try {
        const parsed = JSON.parse(onlineCourse.whatYouWillLearn);
        if (Array.isArray(parsed)) {
          whatYouWillLearn = parsed.filter((item) => typeof item === 'string');
        }
      } catch (error) {
        // Caso não seja um JSON válido, tentar separar por quebras de linha
        whatYouWillLearn = onlineCourse.whatYouWillLearn
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }

    const courseWithModules = await prisma.course.findUnique({
      where: { slug },
      select: {
        modules: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            description: true,
            order: true,
            onlineLessons: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                title: true,
                description: true,
                duration: true,
                order: true
              }
            }
          }
        }
      }
    });

    const modules = (courseWithModules?.modules ?? []).map((module) => ({
      id: module.id,
      title: module.title,
      description: module.description,
      order: module.order,
      lessons: module.onlineLessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration,
        order: lesson.order
      }))
    }));

    // Convert Decimal fields to numbers for JSON serialization
    return NextResponse.json({
      ...onlineCourse,
      price: onlineCourse.price.toNumber(),
      discountPrice: onlineCourse.discountPrice?.toNumber() || null,
      rating: onlineCourse.rating?.toNumber() || null,
      whatYouWillLearn,
      modules
    });
  } catch (error) {
    console.error('Error fetching online course details:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar detalhes do curso' },
      { status: 500 }
    );
  }
}


