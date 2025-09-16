import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Listar cursos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')

    const where: any = {}

    if (active !== null) {
      where.active = active === 'true'
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        modules: {
          include: {
            subjects: {
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        },
        opportunities: true,
        labs: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}

// POST - Criar curso
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
      description,
      icon,
      duration,
      period,
      employability,
      salary,
      monthlyValue,
      prerequisites,
      targetAudience,
      color,
      bgColor,
      active,
      modules,
      opportunities,
      labs
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

    const course = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        icon,
        duration,
        period,
        employability,
        salary,
        monthlyValue,
        prerequisites,
        targetAudience,
        color,
        bgColor,
        active: active || true,
        modules: {
          create: modules?.map((module: any, index: number) => ({
            title: module.title,
            order: index,
            subjects: {
              create: module.subjects?.map((subject: any, subjectIndex: number) => ({
                name: subject.name,
                order: subjectIndex
              })) || []
            }
          })) || []
        },
        opportunities: {
          create: opportunities?.map((opportunity: string) => ({
            title: opportunity
          })) || []
        },
        labs: {
          create: labs?.map((lab: string) => ({
            name: lab
          })) || []
        }
      },
      include: {
        modules: {
          include: {
            subjects: {
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        },
        opportunities: true,
        labs: true
      }
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    )
  }
}
