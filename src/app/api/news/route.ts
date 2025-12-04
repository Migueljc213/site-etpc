import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// GET - Listar notícias
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const published = searchParams.get('published')

    const skip = (page - 1) * limit

    const where: {
      category?: { slug: string };
      OR?: Array<{ title: { contains: string; mode: 'insensitive' } } | { excerpt: { contains: string; mode: 'insensitive' } } | { content: { contains: string; mode: 'insensitive' } }>;
      featured?: boolean;
      published?: boolean;
    } = {}

    if (category && category !== 'todas') {
      where.category = {
        slug: category
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (featured !== null) {
      where.featured = featured === 'true'
    }

    if (published !== null) {
      where.published = published === 'true'
    }

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        include: {
          category: true,
          tags: {
            include: {
              tag: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.news.count({ where })
    ])

    return NextResponse.json({
      news,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}

// POST - Criar notícia
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      excerpt,
      content,
      image,
      author,
      featured,
      published,
      categoryId,
      tags
    } = body

    // Criar slug único
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    const news = await prisma.news.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        image,
        author,
        featured: featured || false,
        published: published || false,
        publishedAt: published ? new Date() : null,
        categoryId,
        tags: {
          create: tags?.map((tagId: string) => ({
            tagId
          })) || []
        }
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    return NextResponse.json(news, { status: 201 })
  } catch (error) {
    console.error('Error creating news:', error)
    return NextResponse.json(
      { error: 'Failed to create news' },
      { status: 500 }
    )
  }
}
