import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Webhook handler para Mercado Pago
 * Recebe notificações de pagamento em tempo real
 * 
 * URL configurada no Mercado Pago: https://seu-dominio.com/api/webhooks/mercadopago
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const signature = request.headers.get('x-signature');
    const requestId = request.headers.get('x-request-id');

    // TODO: Validar assinatura do webhook para segurança
    // const isValid = validateWebhookSignature(data, signature);
    // if (!isValid) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    console.log('Webhook Mercado Pago recebido:', data);

    // Buscar pagamento pelo ID do Mercado Pago
    const payment = await prisma.payment.findFirst({
      where: {
        mercadoPagoPaymentId: String(data.data?.id || data.id)
      },
      include: { order: true }
    });

    if (!payment) {
      console.error('Payment not found for ID:', data.data?.id || data.id);
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Mapear status do Mercado Pago para nosso sistema
    let newStatus = 'pending';
    let paidAt = null;

    const paymentStatus = data.data?.status || data.status;

    switch (paymentStatus) {
      case 'approved':
        newStatus = 'paid';
        paidAt = new Date();
        break;
      case 'rejected':
      case 'cancelled':
        newStatus = 'cancelled';
        break;
      case 'in_process':
      case 'pending':
        newStatus = 'processing';
        break;
      case 'refunded':
      case 'charged_back':
        newStatus = 'refunded';
        break;
    }

    // Atualizar pagamento
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: newStatus,
        paidAt,
        webhookData: JSON.stringify(data)
      }
    });

    // Buscar pedido completo com itens
    const order = await prisma.order.findUnique({
      where: { id: payment.orderId },
      include: {
        items: {
          include: {
            course: true
          }
        }
      }
    });

    if (!order) {
      console.error('Order not found');
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Atualizar pedido
    await prisma.order.update({
      where: { id: payment.orderId },
      data: {
        paymentStatus: newStatus,
        status: newStatus === 'paid' ? 'completed' : payment.order.status
      }
    });

    // Criar matrículas dos alunos quando o pagamento for aprovado
    if (newStatus === 'paid' && order.items && order.items.length > 0) {
      try {
        console.log(`📝 Criando matrículas para pedido ${order.orderNumber}, email: ${order.customerEmail}`);
        console.log(`📚 Itens do pedido:`, order.items.map(item => ({ courseId: item.courseId, course: item.course?.title })));
        
        for (const item of order.items) {
          if (item.course) {
            console.log(`✅ Criando matrícula: email=${order.customerEmail}, courseId=${item.course.id}`);
            
            // Calcular data de expiração baseada no validityDays do curso
            const enrolledAt = new Date();
            const expiresAt = new Date(enrolledAt);
            expiresAt.setDate(expiresAt.getDate() + (item.course.validityDays || 365));

            const enrollment = await prisma.studentEnrollment.upsert({
              where: {
                studentEmail_courseId: {
                  studentEmail: order.customerEmail,
                  courseId: item.course.id
                }
              },
              update: {
                status: 'active',
                expiresAt
              },
              create: {
                studentEmail: order.customerEmail,
                courseId: item.course.id,
                status: 'active',
                enrolledAt,
                expiresAt
              }
            });
            
            console.log(`✅ Matrícula criada/atualizada com sucesso:`, enrollment);
            console.log(`✅ Curso: ${item.course.title}, Email: ${order.customerEmail}`);
          }
        }
        console.log(`✅ Student enrollments created for order ${order.orderNumber}`);
      } catch (enrollmentError) {
        console.error('❌ Erro ao criar matrículas:', enrollmentError);
        console.error('❌ Dados do erro:', { email: order.customerEmail, error: enrollmentError });
      }
    } else {
      console.log(`⚠️ Não criando matrículas - Status: ${newStatus}, Itens: ${order.items?.length || 0}`);
    }

    // TODO: Enviar email de confirmação para o cliente quando aprovado
    // if (newStatus === 'paid') {
    //   await sendPaymentConfirmationEmail(order.customerEmail);
    // }

    console.log(`Payment ${payment.id} updated to status: ${newStatus}`);

    return NextResponse.json({ 
      success: true,
      paymentId: payment.id,
      newStatus 
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET - Para validação de webhook
 */
export async function GET(request: NextRequest) {
  const queryParams = request.nextUrl.searchParams;
  const topic = queryParams.get('topic');
  const id = queryParams.get('id');

  console.log('GET webhook validation:', { topic, id });

  // No Mercado Pago, geralmente não precisamos responder nada no GET
  return NextResponse.json({ ok: true });
}

