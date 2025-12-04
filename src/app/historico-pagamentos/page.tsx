'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaCheckCircle, FaClock, FaTimes, FaReceipt, FaDownload, FaEye, FaShoppingCart } from 'react-icons/fa';

interface OrderItem {
  id: string;
  courseId: string;
  quantity: number;
  price: string;
  course: {
    id: string;
    title: string;
    image: string | null;
    instructor: string;
  };
}

interface Payment {
  id: string;
  paymentMethod: string;
  amount: string;
  status: string;
  paidAt: string | null;
  cardBrand: string | null;
  cardLastDigits: string | null;
  installments: number | null;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
  payment: Payment | null;
}

export default function HistoricoPagamentosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/historico-pagamentos');
    }
    if (status === 'authenticated' && session?.user?.email) {
      fetchOrders();
    }
  }, [status, session, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders?email=${session?.user?.email}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const configs: { [key: string]: { bg: string; text: string; icon: any } } = {
      paid: { bg: 'bg-green-100', text: 'text-green-800', icon: FaCheckCircle },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FaClock },
      processing: { bg: 'bg-blue-100', text: 'text-blue-800', icon: FaClock },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: FaTimes },
      refunded: { bg: 'bg-gray-100', text: 'text-gray-800', icon: FaTimes },
    };

    const config = configs[status] || configs.pending;
    const Icon = config.icon;

    const labels: { [key: string]: string } = {
      paid: 'Pago',
      pending: 'Pendente',
      processing: 'Processando',
      cancelled: 'Cancelado',
      refunded: 'Reembolsado',
    };

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
        <Icon />
        {labels[status] || status}
      </span>
    );
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: { [key: string]: string } = {
      credit_card: 'Cartão de Crédito',
      debit_card: 'Cartão de Débito',
      pix: 'PIX',
      boleto: 'Boleto',
    };
    return labels[method] || method;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(parseFloat(price));
  };

  if (status === 'loading' || loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-etpc-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando histórico...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Histórico de Pagamentos</h1>
              <p className="text-gray-600">Visualize todas as suas compras e transações</p>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Nenhuma compra realizada
                </h2>
                <p className="text-gray-600 mb-6">
                  Você ainda não realizou nenhuma compra
                </p>
                <a
                  href="/cursos-online"
                  className="inline-block bg-etpc-blue text-white px-6 py-3 rounded-lg hover:bg-etpc-blue-dark transition-colors"
                >
                  Explorar Cursos
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">
                              Pedido #{order.orderNumber}
                            </h3>
                            {getStatusBadge(order.paymentStatus)}
                          </div>
                          <p className="text-sm text-gray-600">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-etpc-blue">
                            {formatPrice(order.total)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {getPaymentMethodLabel(order.paymentMethod)}
                            {order.payment?.cardBrand && order.payment?.cardLastDigits && (
                              <span className="ml-1">
                                ({order.payment.cardBrand} •••• {order.payment.cardLastDigits})
                              </span>
                            )}
                            {order.payment?.installments && order.payment.installments > 1 && (
                              <span className="ml-1">
                                - {order.payment.installments}x
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Lista de Cursos */}
                      <div className="border-t border-gray-200 pt-4 space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            {item.course.image && (
                              <img
                                src={item.course.image}
                                alt={item.course.title}
                                className="w-16 h-16 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.course.title}</p>
                              <p className="text-sm text-gray-600">{item.course.instructor}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                {formatPrice(item.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Ações */}
                      <div className="border-t border-gray-200 mt-4 pt-4 flex gap-3">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-etpc-blue hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <FaEye />
                          Ver Detalhes
                        </button>
                        {order.paymentStatus === 'paid' && (
                          <button
                            onClick={() => {
                              alert('Funcionalidade de download do recibo em desenvolvimento');
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <FaDownload />
                            Baixar Recibo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Modal de Detalhes */}
            {selectedOrder && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                      Detalhes do Pedido #{selectedOrder.orderNumber}
                    </h2>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <FaTimes className="text-xl" />
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Informações do Pedido */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Informações do Pedido</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Data:</span>
                          <span className="font-medium text-gray-900">
                            {formatDate(selectedOrder.createdAt)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          {getStatusBadge(selectedOrder.paymentStatus)}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Método de Pagamento:</span>
                          <span className="font-medium text-gray-900">
                            {getPaymentMethodLabel(selectedOrder.paymentMethod)}
                          </span>
                        </div>
                        {selectedOrder.payment?.paidAt && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Pago em:</span>
                            <span className="font-medium text-gray-900">
                              {formatDate(selectedOrder.payment.paidAt)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Cursos Comprados */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Cursos Comprados</h3>
                      <div className="space-y-3">
                        {selectedOrder.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 bg-gray-50 rounded-lg p-4"
                          >
                            {item.course.image && (
                              <img
                                src={item.course.image}
                                alt={item.course.title}
                                className="w-20 h-20 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.course.title}</p>
                              <p className="text-sm text-gray-600">{item.course.instructor}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-etpc-blue">
                                {formatPrice(item.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resumo */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-lg">
                        <span className="font-semibold text-gray-900">Total:</span>
                        <span className="font-bold text-etpc-blue text-2xl">
                          {formatPrice(selectedOrder.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

