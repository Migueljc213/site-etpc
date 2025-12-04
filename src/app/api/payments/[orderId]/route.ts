import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const payment = await prisma.payment.findFirst({
      where: {
        orderId: params.orderId
      },
      include: {
        order: true
      }
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Pagamento não encontrado' },
        { status: 404 }
      );
    }

    // Parse webhookData que contém todos os dados extras
    const webhookData = payment.webhookData ? JSON.parse(payment.webhookData) : {};

    return NextResponse.json({
      id: payment.id,
      paymentMethod: payment.paymentMethod,
      amount: Number(payment.amount),
      status: payment.status,
      // Buscar dados do PIX/Boleto de webhookData OU dos campos diretos
      pixQrCode: webhookData.pixQrCode || payment.pixQrCode,
      pixQrCodeText: webhookData.pixQrCodeText || payment.pixQrCodeText,
      pixExpiresAt: webhookData.pixExpiresAt || payment.pixExpiresAt,
      boletoBarcode: webhookData.boletoBarcode || payment.boletoBarcode,
      boletoPdf: webhookData.boletoPdf || payment.boletoPdf,
      boletoExpiresAt: webhookData.boletoExpiresAt || payment.boletoExpiresAt,
      cardBrand: webhookData.cardBrand || payment.cardBrand,
      cardLastDigits: webhookData.cardLastDigits || payment.cardLastDigits,
      mercadoPagoPaymentId: webhookData.mercadoPagoPaymentId || payment.mercadoPagoPaymentId,
      order: {
        orderNumber: payment.order.orderNumber,
        customerEmail: payment.order.customerEmail
      }
    });
  } catch (error) {
    console.error('Error fetching payment:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar pagamento' },
      { status: 500 }
    );
  }
}

