'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiClock } from 'react-icons/fi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PaymentPendingPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('pending');

  useEffect(() => {
    if (orderId) {
      checkPaymentStatus();
      // Verificar status a cada 5 segundos
      const interval = setInterval(() => {
        checkPaymentStatus();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [orderId]);

  const checkPaymentStatus = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
        setPaymentStatus(data.payment?.status || 'pending');

        // Se o pagamento foi aprovado, redirecionar para sucesso
        if (data.payment?.status === 'paid') {
          router.push(`/payment/success/${orderId}`);
        }
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-etpc-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando pagamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          {/* Ícone de pendente */}
          <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <FiClock className="text-5xl text-yellow-600 animate-spin" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Processando Pagamento
          </h1>
          <p className="text-gray-600 mb-8">
            Aguarde enquanto processamos seu pagamento...
          </p>

          {/* Informações do pedido */}
          {order && (
            <div className="border-t border-b border-gray-200 py-6 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Número do Pedido:</span>
                  <span className="font-semibold text-gray-900">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-semibold text-etpc-blue text-xl">
                    R$ {Number(order.total).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="animate-pulse flex items-center justify-center gap-3">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span className="text-blue-800 font-semibold">
                Aguardando confirmação do Mercado Pago...
              </span>
            </div>
          </div>

          {/* Informação adicional */}
          <div className="text-sm text-gray-600 space-y-2">
            <p>⚠️ Não feche esta página enquanto o pagamento é processado</p>
            <p>Você será redirecionado automaticamente quando o pagamento for aprovado</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

