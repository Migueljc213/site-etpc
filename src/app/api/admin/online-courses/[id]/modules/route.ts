import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Buscar o curso online
    const onlineCourse = await prisma.onlineCourse.findUnique({
      where: { id }
    });

    if (!onlineCourse) {
      return NextResponse.json(
        { error: 'Curso online não encontrado' },
        { status: 404 }
      );
    }

    // Encontrar o Course correspondente
    const course = await prisma.course.findFirst({
      where: { slug: onlineCourse.slug }
    });

    if (!course) {
      return NextResponse.json([]); // Nenhum módulo ainda
    }

    // Buscar módulos do Course
    const modules = await prisma.courseModule.findMany({
      where: { courseId: course.id },
      orderBy: { order: 'asc' },
      include: {
        onlineLessons: {
          orderBy: { order: 'asc' }
        }
      }
    });

    // Garantir que todos os módulos tenham um array de lessons
    const modulesWithLessons = modules.map(module => ({
      ...module,
      lessons: module.onlineLessons || []
    }));

    return NextResponse.json(modulesWithLessons);
  } catch (error) {
    console.error('Error fetching modules:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar módulos' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { title, description, order } = await request.json();

    console.log('Creating module with data:', { id, title, description, order });

    // Buscar o curso online
    const onlineCourse = await prisma.onlineCourse.findUnique({
      where: { id }
    });

    if (!onlineCourse) {
      return NextResponse.json(
        { error: 'Curso online não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se existe um Course relacionado a este OnlineCourse
    // Ou criar um Course temporário apenas para os módulos funcionarem
    let courseId = onlineCourse.id;
    
    // Tentar encontrar ou criar um Course com slug baseado no OnlineCourse
    let course = await prisma.course.findFirst({
      where: { slug: onlineCourse.slug }
    });

    if (!course) {
      // Criar um Course para este OnlineCourse
      course = await prisma.course.create({
        data: {
          title: onlineCourse.title,
          slug: onlineCourse.slug,
          description: onlineCourse.description.substring(0, 500), // Limitar tamanho
          icon: '📚',
          duration: 'Online',
          period: 'Flexível',
          employability: '100%',
          salary: `R$ ${onlineCourse.price}`,
          monthlyValue: `R$ ${onlineCourse.price}`,
          prerequisites: 'Sem pré-requisitos',
          targetAudience: 'Interessados em aprender',
          color: 'from-blue-500 to-cyan-600',
          bgColor: 'from-blue-50 to-cyan-50'
        }
      });
    }

    // Criar o módulo referenciando o Course
    const module = await prisma.courseModule.create({
      data: {
        title,
        description,
        order: order || 0,
        courseId: course.id
      },
      include: {
        onlineLessons: true
      }
    });

    // Retornar com array de lessons inicializado
    const moduleWithLessons = {
      ...module,
      lessons: module.onlineLessons || []
    };

    return NextResponse.json(moduleWithLessons, { status: 201 });
  } catch (error) {
    console.error('Error creating module:', error);
    return NextResponse.json(
      { error: 'Erro ao criar módulo', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

