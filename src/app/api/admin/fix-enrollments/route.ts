import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação admin
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Verificar se é admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    console.log('🔍 Buscando pagamentos aprovados sem matrículas...');

    // Buscar todos os pagamentos com status 'paid'
    const paidPayments = await prisma.payment.findMany({
      where: {
        status: 'paid'
      },
      include: {
        order: {
          include: {
            items: {
              include: {
                course: true
              }
            }
          }
        }
      }
    });

    console.log(`✅ Encontrados ${paidPayments.length} pagamentos aprovados`);

    let fixed = 0;
    let alreadyExists = 0;
    let errors = 0;
    const details: any[] = [];

    for (const payment of paidPayments) {
      const order = payment.order;
      
      if (!order.items || order.items.length === 0) {
        continue;
      }

      for (const item of order.items) {
        if (!item.course) continue;

        // Verificar se matrícula já existe
        const existingEnrollment = await prisma.studentEnrollment.findUnique({
          where: {
            studentEmail_courseId: {
              studentEmail: order.customerEmail,
              courseId: item.course.id
            }
          }
        });

        if (existingEnrollment) {
          alreadyExists++;
          continue;
        }

        try {
          // Criar matrícula
          const enrolledAt = new Date();
          const expiresAt = new Date(enrolledAt);
          expiresAt.setDate(expiresAt.getDate() + (item.course.validityDays || 365));

          const enrollment = await prisma.studentEnrollment.create({
            data: {
              studentEmail: order.customerEmail,
              courseId: item.course.id,
              status: 'active',
              enrolledAt,
              expiresAt
            }
          });

          fixed++;
          details.push({
            orderNumber: order.orderNumber,
            customerEmail: order.customerEmail,
            courseTitle: item.course.title,
            enrollmentId: enrollment.id,
            status: 'created'
          });

          console.log(`✅ Matrícula criada: ${order.customerEmail} -> ${item.course.title}`);
        } catch (error: any) {
          errors++;
          details.push({
            orderNumber: order.orderNumber,
            customerEmail: order.customerEmail,
            courseTitle: item.course.title,
            error: error.message,
            status: 'error'
          });
          console.error(`❌ Erro ao criar matrícula: ${error.message}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        totalPayments: paidPayments.length,
        enrollmentsCreated: fixed,
        alreadyExisting: alreadyExists,
        errors: errors
      },
      details
    });

  } catch (error: any) {
    console.error('Erro ao corrigir matrículas:', error);
    return NextResponse.json(
      { error: 'Erro ao corrigir matrículas', details: error.message },
      { status: 500 }
    );
  }
}

// GET para verificar status
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação admin
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Verificar se é admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // Contar pagamentos pagos
    const paidPaymentsCount = await prisma.payment.count({
      where: { status: 'paid' }
    });

    // Contar matrículas ativas
    const activeEnrollments = await prisma.studentEnrollment.count({
      where: { status: 'active' }
    });

    // Buscar pagamentos pagos SEM matrículas
    const paidPaymentsWithoutEnrollments = await prisma.payment.findMany({
      where: {
        status: 'paid'
      },
      include: {
        order: {
          include: {
            items: {
              include: {
                course: true
              }
            }
          }
        }
      }
    });

    let missingEnrollments = 0;
    for (const payment of paidPaymentsWithoutEnrollments) {
      for (const item of payment.order.items) {
        if (!item.course) continue;

        const enrollment = await prisma.studentEnrollment.findUnique({
          where: {
            studentEmail_courseId: {
              studentEmail: payment.order.customerEmail,
              courseId: item.course.id
            }
          }
        });

        if (!enrollment) {
          missingEnrollments++;
        }
      }
    }

    return NextResponse.json({
      paidPaymentsCount,
      activeEnrollments,
      missingEnrollments,
      needsFix: missingEnrollments > 0
    });

  } catch (error: any) {
    console.error('Erro ao verificar status:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar status', details: error.message },
      { status: 500 }
    );
  }
}

