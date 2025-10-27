import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { orderId, paymentMethod, customerData, cardData } = await request.json();

    // Buscar pedido
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { course: true } } }
    });

    if (!order) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
    }

    // Verificar se as credenciais estão configuradas
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      console.error('MERCADOPAGO_ACCESS_TOKEN não configurado! Configure na Vercel.');
      return NextResponse.json({ 
        error: 'Erro ao processar pagamento',
        details: 'Configuração do Mercado Pago não encontrada'
      }, { status: 500 });
    }

    // Configurar cliente Mercado Pago
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    });

    const paymentInstance = new Payment(client);
    let response: any;
    let paymentData: any = {
      paymentMethod,
      amount: order.total,
      status: 'pending'
    };

    // Processar conforme o método de pagamento
    if (paymentMethod === 'pix') {
      // Pagamento PIX
      response = await paymentInstance.create({
        body: {
          transaction_amount: Number(order.total),
          description: `Pedido ${order.orderNumber}`,
          payment_method_id: 'pix',
          payer: {
            email: customerData.email,
            first_name: customerData.name.split(' ')[0],
            last_name: customerData.name.split(' ').slice(1).join(' ') || customerData.name.split(' ')[0],
            identification: {
              type: 'CPF',
              number: customerData.cpf.replace(/[^\d]/g, '')
            }
          }
        }
      });

      paymentData = {
        ...paymentData,
        mercadoPagoPaymentId: String(response.id),
        pixQrCode: response.point_of_interaction?.transaction_data?.qr_code_base64,
        pixQrCodeText: response.point_of_interaction?.transaction_data?.qr_code,
        pixExpiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
        status: 'pending' // PIX fica pendente até confirmação via webhook
      };

    } else if (paymentMethod === 'boleto') {
      // Pagamento Boleto
      response = await paymentInstance.create({
        body: {
          transaction_amount: Number(order.total),
          description: `Pedido ${order.orderNumber}`,
          payment_method_id: 'bolbradesco',
          payer: {
            email: customerData.email,
            first_name: customerData.name.split(' ')[0],
            last_name: customerData.name.split(' ').slice(1).join(' ') || customerData.name.split(' ')[0],
            identification: {
              type: 'CPF',
              number: customerData.cpf.replace(/[^\d]/g, '')
            }
          },
          date_of_expiration: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      });

      const charge = response.charges?.[0];
      
      paymentData = {
        ...paymentData,
        mercadoPagoPaymentId: String(response.id),
        boletoBarcode: charge?.data?.barcode,
        boletoPdf: charge?.data?.external_resource_url,
        boletoExpiresAt: new Date(response.date_of_expiration),
        status: 'pending' // Boleto fica pendente até confirmação via webhook
      };

    } else if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
      // Pagamento Cartão - Precisa tokenizar primeiro
      // Para desenvolvimento, vamos usar modo mock
      console.warn('Cartão de crédito requer tokenização no ambiente de produção');
      
      // Mock para desenvolvimento
      response = {
        id: Math.floor(Math.random() * 1000000000).toString(),
        status: 'approved',
        payment_method_id: detectCardBrand(cardData.number),
        card: {
          last_four_digits: cardData.number.slice(-4)
        }
      };
      
      paymentData = {
        ...paymentData,
        mercadoPagoPaymentId: String(response.id),
        cardBrand: response.payment_method_id,
        cardLastDigits: response.card.last_four_digits,
        status: 'paid'
      };
    }

    return await savePaymentAndUpdateOrder(order, paymentData);
    
  } catch (error: any) {
    console.error('Error processing payment:', error);
    return NextResponse.json({ 
      error: 'Erro ao processar pagamento',
      details: error.message 
    }, { status: 500 });
  }
}

// Função auxiliar para detectar bandeira do cartão
function detectCardBrand(cardNumber: string): string {
  const number = cardNumber.replace(/\s/g, '');
  if (number.startsWith('4')) return 'visa';
  if (number.startsWith('5')) return 'master';
  if (number.startsWith('3')) return 'amex';
  return 'visa'; // default
}

// Função para salvar pagamento e atualizar pedido
async function savePaymentAndUpdateOrder(order: any, paymentData: any) {
  // Criar registro de pagamento usando campos básicos e extras
  const paymentDataToSave: any = {
    orderId: order.id,
    paymentMethod: paymentData.paymentMethod,
    amount: paymentData.amount,
    status: paymentData.status,
    // Adicionar campos extras diretamente (se existirem)
    ...(paymentData.pixQrCode && { pixQrCode: paymentData.pixQrCode }),
    ...(paymentData.pixQrCodeText && { pixQrCodeText: paymentData.pixQrCodeText }),
    ...(paymentData.pixExpiresAt && { pixExpiresAt: paymentData.pixExpiresAt }),
    ...(paymentData.boletoBarcode && { boletoBarcode: paymentData.boletoBarcode }),
    ...(paymentData.boletoPdf && { boletoPdf: paymentData.boletoPdf }),
    ...(paymentData.boletoExpiresAt && { boletoExpiresAt: paymentData.boletoExpiresAt }),
    ...(paymentData.cardBrand && { cardBrand: paymentData.cardBrand }),
    ...(paymentData.cardLastDigits && { cardLastDigits: paymentData.cardLastDigits }),
    // Salvar também no webhookData para backup
    webhookData: JSON.stringify({
      mercadoPagoPaymentId: paymentData.mercadoPagoPaymentId,
      pixQrCode: paymentData.pixQrCode,
      pixQrCodeText: paymentData.pixQrCodeText,
      pixExpiresAt: paymentData.pixExpiresAt,
      boletoBarcode: paymentData.boletoBarcode,
      boletoPdf: paymentData.boletoPdf,
      boletoExpiresAt: paymentData.boletoExpiresAt,
      cardBrand: paymentData.cardBrand,
      cardLastDigits: paymentData.cardLastDigits
    })
  };

  const payment = await prisma.payment.create({
    data: paymentDataToSave
  });

  // Atualizar status do pedido
  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: paymentData.status,
      status: paymentData.status === 'paid' ? 'processing' : 'pending'
    }
  });

  // Buscar pedido completo com itens para enviar email
  const orderWithItems = await prisma.order.findUnique({
    where: { id: order.id },
    include: {
      items: {
        include: {
          course: true
        }
      }
    }
  });

  // Enviar email de confirmação
  if (orderWithItems) {
    try {
      await sendOrderConfirmationEmail(
        orderWithItems.customerEmail,
        orderWithItems,
        paymentData.paymentMethod
      );
    } catch (emailError) {
      console.error('Erro ao enviar email:', emailError);
      // Não falha a operação se o email falhar
    }
  }

  return NextResponse.json(payment, { status: 201 });
}
