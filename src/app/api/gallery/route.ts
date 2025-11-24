import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Listar fotos da galeria
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const active = searchParams.get('active');

    const where: { category?: string; active?: boolean } = {};
    
    if (category) {
      where.category = category;
    }
    
    if (active !== null && active !== undefined) {
      where.active = active === 'true';
    }

    const photos = await prisma.galleryPhoto.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    // Sempre retornar um array, mesmo que vazio
    return NextResponse.json(photos || []);
  } catch (error) {
    console.error('Error fetching gallery photos:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery photos' }, { status: 500 });
  }
}

// POST - Criar nova foto na galeria
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { title, description, image, category, order, active } = data;

    const photo = await prisma.galleryPhoto.create({
      data: {
        title,
        description,
        image,
        category: category || 'geral',
        order: order || 0,
        active: active !== false
      }
    });

    return NextResponse.json(photo);
  } catch (error) {
    console.error('Error creating gallery photo:', error);
    return NextResponse.json({ error: 'Failed to create gallery photo' }, { status: 500 });
  }
}
