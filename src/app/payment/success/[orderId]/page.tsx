'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiCheckCircle } from 'react-icons/fi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PaymentSuccessPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
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
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          {/* Ícone de sucesso */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FiCheckCircle className="text-5xl text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Pagamento Aprovado!
            </h1>
            <p className="text-gray-600">
              Seu pedido foi processado com sucesso
            </p>
          </div>

          {/* Informações do pedido */}
          {order && (
            <div className="border-t border-b border-gray-200 py-6 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Número do Pedido:</span>
                  <span className="font-semibold text-gray-900">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Pago:</span>
                  <span className="font-semibold text-etpc-blue text-xl">
                    R$ {Number(order.total).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Método:</span>
                  <span className="font-semibold text-gray-900 capitalize">
                    {order.paymentMethod === 'credit_card' ? 'Cartão de Crédito' : 
                     order.paymentMethod === 'debit_card' ? 'Cartão de Débito' : 
                     order.paymentMethod === 'pix' ? 'PIX' : 
                     order.paymentMethod === 'boleto' ? 'Boleto' : order.paymentMethod}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Mensagem de confirmação */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              📧 Confirmação por Email
            </h3>
            <p className="text-blue-800 text-sm">
              Você receberá um email de confirmação em breve com todos os detalhes do seu pedido.
            </p>
          </div>

          {/* Cursos adquiridos */}
          {order?.items && order.items.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Cursos Adquiridos:</h3>
              <div className="space-y-2">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botões de ação */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-gradient-to-r from-etpc-blue to-etpc-blue-dark text-white py-4 px-6 rounded-lg font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Ver Meus Cursos Agora
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/cursos-online')}
                className="flex-1 bg-etpc-blue text-white py-3 px-6 rounded-lg font-semibold hover:bg-etpc-blue-dark transition-colors"
              >
                Explorar Mais Cursos
              </button>
              <button
                onClick={() => router.push('/')}
                className="flex-1 bg-white border-2 border-etpc-blue text-etpc-blue py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Voltar ao Início
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

