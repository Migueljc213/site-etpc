import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Listar cursos online
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const level = searchParams.get('level');

    const where: any = {};

    if (active === 'true') {
      where.active = true;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (category) {
      where.category = category;
    }

    if (level) {
      where.level = level;
    }

    const courses = await prisma.onlineCourse.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    // Convert Decimal fields to numbers for JSON serialization
    const coursesWithNumbers = courses.map(course => ({
      ...course,
      price: course.price.toNumber(),
      discountPrice: course.discountPrice?.toNumber() || null,
      rating: course.rating?.toNumber() || null,
    }));

    return NextResponse.json(coursesWithNumbers);
  } catch (error) {
    console.error('Error fetching online courses:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar cursos online' },
      { status: 500 }
    );
  }
}

// POST - Criar novo curso online
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Gerar slug a partir do título
    const slug = data.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const course = await prisma.onlineCourse.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        shortDescription: data.shortDescription,
        image: data.image || null,
        instructor: data.instructor,
        price: data.price,
        discountPrice: data.discountPrice || null,
        duration: data.duration,
        level: data.level,
        category: data.category,
        validityDays: data.validityDays || 365,
        whatYouWillLearn: JSON.stringify(data.whatYouWillLearn || []),
        requirements: data.requirements || null,
        active: data.active !== undefined ? data.active : true,
        featured: data.featured || false
      }
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error('Error creating online course:', error);
    return NextResponse.json(
      { error: 'Erro ao criar curso online' },
      { status: 500 }
    );
  }
}
