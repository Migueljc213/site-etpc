import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// GET - Buscar curso por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const course = await prisma.course.findUnique({
      where: { id },
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

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar curso
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    // Criar slug único se o título mudou
    const existingCourse = await prisma.course.findUnique({
      where: { id }
    })

    let slug = existingCourse?.slug
    if (title !== existingCourse?.title) {
      slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    }

    // Deletar módulos, oportunidades e laboratórios existentes
    await Promise.all([
      prisma.courseModule.deleteMany({
        where: { courseId: id }
      }),
      prisma.courseOpportunity.deleteMany({
        where: { courseId: id }
      }),
      prisma.courseLab.deleteMany({
        where: { courseId: id }
      })
    ])

    const course = await prisma.course.update({
      where: { id },
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
          create: modules?.map((module: { title: string; subjects?: Array<{ name: string }> }, index: number) => ({
            title: module.title,
            order: index,
            subjects: {
              create: module.subjects?.map((subject: { name: string }, subjectIndex: number) => ({
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

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    )
  }
}

// DELETE - Excluir curso
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params;
    await prisma.course.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    )
  }
}
