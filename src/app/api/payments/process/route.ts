import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MercadoPagoConfig, Payment } from 'mercadopago';

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
      console.warn('MERCADOPAGO_ACCESS_TOKEN não configurado, usando modo mock');
      return getMockPaymentData(order, paymentMethod, customerData, cardData);
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
        pixExpiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutos
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
        boletoExpiresAt: new Date(response.date_of_expiration)
      };

    } else if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
      // Pagamento Cartão - Formato correto da API v1 do Mercado Pago
      const [month, year] = cardData.expiry.split('/');
      
      response = await paymentInstance.create({
        body: {
          transaction_amount: Number(order.total),
          description: `Pedido ${order.orderNumber}`,
          payment_method_id: detectCardBrand(cardData.number),
          installments: 1,
          payer: {
            email: customerData.email,
            first_name: customerData.name.split(' ')[0],
            last_name: customerData.name.split(' ').slice(1).join(' ') || customerData.name.split(' ')[0],
            identification: {
              type: 'CPF',
              number: customerData.cpf.replace(/[^\d]/g, '')
            }
          },
          // Dados do cartão
          card: {
            card_number: cardData.number.replace(/\s/g, ''),
            cardholder_name: cardData.holder,
            card_expiration_month: parseInt(month),
            card_expiration_year: parseInt(`20${year}`),
            security_code: cardData.cvv
          },
          statement_descriptor: 'ETPC CURSOS'
        }
      });

      paymentData = {
        ...paymentData,
        mercadoPagoPaymentId: String(response.id),
        cardBrand: response.payment_method_id,
        cardLastDigits: response.card?.last_four_digits,
        status: response.status === 'approved' ? 'paid' : 'pending'
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

// Função para salvar pagamento mock (quando não há credenciais)
async function getMockPaymentData(order: any, paymentMethod: string, customerData: any, cardData: any) {
  let paymentData: any = {
    paymentMethod,
    amount: order.total,
    status: 'pending'
  };

  if (paymentMethod === 'pix') {
    paymentData = {
      ...paymentData,
      pixQrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      pixQrCodeText: '00020126580014br.gov.bcb.pix0136' + Math.random().toString(36).substring(7),
      pixExpiresAt: new Date(Date.now() + 30 * 60 * 1000)
    };
  } else if (paymentMethod === 'boleto') {
    paymentData = {
      ...paymentData,
      boletoBarcode: '34191.79001 01043.510047 91020.150008 1 84580000000500',
      boletoPdf: 'https://example.com/boleto.pdf',
      boletoExpiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    };
  } else if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
    paymentData = {
      ...paymentData,
      cardBrand: 'visa',
      cardLastDigits: cardData?.number?.slice(-4) || '0000',
      status: 'paid'
    };
  }

  return await savePaymentAndUpdateOrder(order, paymentData);
}

// Função para salvar pagamento e atualizar pedido
async function savePaymentAndUpdateOrder(order: any, paymentData: any) {
  // Criar registro de pagamento
  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      paymentMethod: paymentData.paymentMethod,
      amount: paymentData.amount,
      status: paymentData.status,
      // Mercado Pago ID
      ...(paymentData.mercadoPagoPaymentId && { mercadoPagoPaymentId: paymentData.mercadoPagoPaymentId }),
      // PIX data
      ...(paymentData.pixQrCode && { pixQrCode: paymentData.pixQrCode }),
      ...(paymentData.pixQrCodeText && { pixQrCodeText: paymentData.pixQrCodeText }),
      ...(paymentData.pixExpiresAt && { pixExpiresAt: paymentData.pixExpiresAt }),
      // Boleto data
      ...(paymentData.boletoBarcode && { boletoBarcode: paymentData.boletoBarcode }),
      ...(paymentData.boletoPdf && { boletoPdf: paymentData.boletoPdf }),
      ...(paymentData.boletoExpiresAt && { boletoExpiresAt: paymentData.boletoExpiresAt }),
      // Card data
      ...(paymentData.cardBrand && { cardBrand: paymentData.cardBrand }),
      ...(paymentData.cardLastDigits && { cardLastDigits: paymentData.cardLastDigits })
    }
  });

  // Atualizar status do pedido
  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: paymentData.status,
      status: paymentData.status === 'paid' ? 'processing' : 'pending'
    }
  });

  return NextResponse.json(payment, { status: 201 });
}
