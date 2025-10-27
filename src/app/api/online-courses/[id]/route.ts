import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Buscar curso online por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const course = await prisma.onlineCourse.findUnique({
      where: { id },
      include: {
        _count: {
          select: { orderItems: true }
        }
      }
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching online course:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar curso' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar curso online
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    // Verificar se o curso existe
    const existingCourse = await prisma.onlineCourse.findUnique({
      where: { id }
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
      );
    }

    const updateData: any = {};

    if (data.title) updateData.title = data.title;
    if (data.description) updateData.description = data.description;
    if (data.shortDescription) updateData.shortDescription = data.shortDescription;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.instructor) updateData.instructor = data.instructor;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.discountPrice !== undefined) updateData.discountPrice = data.discountPrice;
    if (data.duration) updateData.duration = data.duration;
    if (data.level) updateData.level = data.level;
    if (data.category) updateData.category = data.category;
    if (data.whatYouWillLearn) updateData.whatYouWillLearn = JSON.stringify(data.whatYouWillLearn);
    if (data.requirements !== undefined) updateData.requirements = data.requirements;
    if (data.active !== undefined) updateData.active = data.active;
    if (data.featured !== undefined) updateData.featured = data.featured;
    if (data.rating !== undefined) updateData.rating = data.rating;
    if (data.totalStudents !== undefined) updateData.totalStudents = data.totalStudents;

    const course = await prisma.onlineCourse.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error updating online course:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar curso' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar curso online
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verificar se o curso existe
    const existingCourse = await prisma.onlineCourse.findUnique({
      where: { id }
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
      );
    }

    await prisma.onlineCourse.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Curso deletado com sucesso' });
  } catch (error) {
    console.error('Error deleting online course:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar curso' },
      { status: 500 }
    );
  }
}
