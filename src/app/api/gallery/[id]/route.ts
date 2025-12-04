import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Buscar foto específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const photo = await prisma.galleryPhoto.findUnique({
      where: { id }
    });

    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    return NextResponse.json(photo);
  } catch (error) {
    console.error('Error fetching gallery photo:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery photo' }, { status: 500 });
  }
}

// PUT - Atualizar foto
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();
    const { title, description, image, category, order, active } = data;

    const photo = await prisma.galleryPhoto.update({
      where: { id },
      data: {
        title,
        description,
        image,
        category,
        order,
        active
      }
    });

    return NextResponse.json(photo);
  } catch (error) {
    console.error('Error updating gallery photo:', error);
    return NextResponse.json({ error: 'Failed to update gallery photo' }, { status: 500 });
  }
}

// DELETE - Deletar foto
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.galleryPhoto.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery photo:', error);
    return NextResponse.json({ error: 'Failed to delete gallery photo' }, { status: 500 });
  }
}
