'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaQrcode, FaCopy, FaCheck } from 'react-icons/fa';
import Image from 'next/image';

interface PaymentData {
  id: string;
  paymentMethod: string;
  amount: number;
  status: string;
  pixQrCode: string;
  pixQrCodeText: string;
  pixExpiresAt: string;
  order: {
    orderNumber: string;
    customerEmail: string;
  };
}

interface OrderItem {
  id: string;
  course: {
    title: string;
    image: string;
    instructor: string;
  };
  price: number;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  items: OrderItem[];
}

export default function PixPaymentPage() {
  const router = useRouter();
  const [params, setParams] = useState({ orderId: '' });
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Pegar orderId da URL
    const pathSegments = window.location.pathname.split('/');
    const orderId = pathSegments[pathSegments.length - 1];
    setParams({ orderId });
  }, []);

  useEffect(() => {
    if (params.orderId) {
      fetchPayment();
    }
  }, [params.orderId]);

  const fetchPayment = async () => {
    try {
      // Buscar dados do pagamento e do pedido
      const [paymentResponse, orderResponse] = await Promise.all([
        fetch(`/api/payments/${params.orderId}`),
        fetch(`/api/orders/${params.orderId}`)
      ]);
      
      if (!paymentResponse.ok) throw new Error('Pagamento não encontrado');
      if (!orderResponse.ok) throw new Error('Pedido não encontrado');
      
      const paymentData = await paymentResponse.json();
      const orderData = await orderResponse.json();
      
      setPayment(paymentData);
      setOrder(orderData);
    } catch (error) {
      console.error('Error fetching payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (payment?.pixQrCodeText) {
      navigator.clipboard.writeText(payment.pixQrCodeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 pb-12 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-etpc-blue mb-4"></div>
            <p className="text-gray-600">Carregando informações do pagamento...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 pb-12 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl text-gray-300 mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Pagamento não encontrado</h1>
            <p className="text-gray-600 mb-6">Não foi possível encontrar as informações do pagamento.</p>
            <button
              onClick={() => router.push('/checkout')}
              className="bg-etpc-blue text-white px-6 py-3 rounded-lg hover:bg-etpc-blue-dark transition-colors"
            >
              Voltar para o Checkout
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-etpc-blue to-etpc-blue-dark text-white p-6">
              <div className="flex items-center gap-3">
                <FaQrcode className="text-3xl" />
                <div>
                  <h1 className="text-2xl font-bold">Pix - Pagamento Instantâneo</h1>
                  <p className="text-white/80">Pedido: {payment.order.orderNumber}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* QR Code */}
              <div className="flex flex-col items-center">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Escaneie o QR Code</h2>
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                  {payment.pixQrCode ? (
                    <img
                      src={payment.pixQrCode.startsWith('data:') ? payment.pixQrCode : `data:image/png;base64,${payment.pixQrCode}`}
                      alt="QR Code PIX"
                      width={256}
                      height={256}
                      className="w-64 h-64"
                    />
                  ) : (
                    <div className="w-64 h-64 flex items-center justify-center bg-gray-100 text-gray-400">
                      QR Code não disponível
                    </div>
                  )}
                </div>
              </div>

              {/* Código PIX Copia e Cola */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código para Copiar
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-50 border-2 border-gray-300 rounded-lg p-4 font-mono text-sm break-all text-gray-900">
                    {payment.pixQrCodeText || 'Código não disponível'}
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      copied
                        ? 'bg-green-100 text-green-700'
                        : 'bg-etpc-blue text-white hover:bg-etpc-blue-dark'
                    }`}
                  >
                    {copied ? (
                      <>
                        <FaCheck className="inline mr-2" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <FaCopy className="inline mr-2" />
                        Copiar
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Itens da Compra */}
              {order?.items && order.items.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Itens do Pedido:</h3>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        {item.course?.image && (
                          <img 
                            src={item.course.image} 
                            alt={item.course.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.course?.title}</p>
                          <p className="text-sm text-gray-600">{item.course?.instructor}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatPrice(item.subtotal)}</p>
                          <p className="text-xs text-gray-500">Qtd: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Valor e Informações */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Valor do Pagamento:</span>
                  <span className="text-3xl font-bold text-etpc-blue">
                    {formatPrice(order?.total || payment.amount)}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Email:</span>
                    <span className="text-gray-900">{payment.order.customerEmail}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${
                      payment.status === 'paid' ? 'text-green-600' :
                      payment.status === 'pending' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {payment.status === 'paid' ? 'Pago' :
                       payment.status === 'pending' ? 'Aguardando' :
                       'Cancelado'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Instruções */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Como pagar com PIX:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                  <li>Abra o aplicativo do seu banco</li>
                  <li>Escolha a opção PIX</li>
                  <li>Escaneie o QR Code ou copie o código</li>
                  <li>Confirme o pagamento</li>
                  <li>Você receberá o acesso ao curso por email</li>
                </ol>
              </div>

              {/* Botões */}
              <div className="flex gap-4">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  {copied ? 'Código Copiado!' : 'Copiar Código PIX'}
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 bg-etpc-blue text-white py-3 rounded-lg font-semibold hover:bg-etpc-blue-dark transition-colors"
                >
                  Ir para Início
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

