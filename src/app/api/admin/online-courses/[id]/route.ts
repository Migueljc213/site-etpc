import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const course = await prisma.onlineCourse.findUnique({
      where: { id }
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
      );
    }

    // Convert Decimal fields to numbers for JSON serialization
    const courseWithNumbers = {
      ...course,
      price: course.price.toNumber(),
      discountPrice: course.discountPrice?.toNumber() || null,
      rating: course.rating?.toNumber() || null,
    };

    return NextResponse.json(courseWithNumbers);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar curso' },
      { status: 500 }
    );
  }
}

