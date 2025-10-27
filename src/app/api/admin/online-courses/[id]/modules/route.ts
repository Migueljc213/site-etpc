import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const modules = await prisma.courseModule.findMany({
      where: { courseId: id },
      orderBy: { order: 'asc' },
      include: {
        onlineLessons: {
          orderBy: { order: 'asc' }
        }
      }
    });

    return NextResponse.json(modules);
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

    const module = await prisma.courseModule.create({
      data: {
        title,
        description,
        order: order || 0,
        courseId: id
      }
    });

    return NextResponse.json(module, { status: 201 });
  } catch (error) {
    console.error('Error creating module:', error);
    return NextResponse.json(
      { error: 'Erro ao criar módulo' },
      { status: 500 }
    );
  }
}

