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

    // Atualizar pedido
    await prisma.order.update({
      where: { id: payment.orderId },
      data: {
        paymentStatus: newStatus,
        status: newStatus === 'paid' ? 'completed' : payment.order.status
      }
    });

    // TODO: Enviar email de confirmação para o cliente quando aprovado
    // if (newStatus === 'paid') {
    //   await sendPaymentConfirmationEmail(payment.order.customerEmail);
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

