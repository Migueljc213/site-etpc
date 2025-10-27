'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCreditCard, FaBarcode, FaQrcode, FaShoppingCart, FaLock } from 'react-icons/fa';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';

type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'boleto';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');

  // Form states
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: ''
  });

  const [cardData, setCardData] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: ''
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert('Carrinho vazio');
      return;
    }

    setLoading(true);

    try {
      // 1. Criar pedido
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerData.name,
          customerEmail: customerData.email,
          customerPhone: customerData.phone,
          customerCPF: customerData.cpf,
          paymentMethod,
          items: items.map(item => ({
            courseId: item.id,
            quantity: item.quantity
          }))
        })
      });

      if (!orderResponse.ok) throw new Error('Erro ao criar pedido');

      const order = await orderResponse.json();

      // 2. Processar pagamento
      const paymentResponse = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          paymentMethod,
          customerData,
          cardData: paymentMethod.includes('card') ? cardData : undefined
        })
      });

      if (!paymentResponse.ok) throw new Error('Erro ao processar pagamento');

      const payment = await paymentResponse.json();

      // 3. Redirecionar conforme método
      if (paymentMethod === 'pix' && payment.pixQrCode) {
        router.push(`/payment/pix/${order.id}`);
      } else if (paymentMethod === 'boleto' && payment.boletoPdf) {
        router.push(`/payment/boleto/${order.id}`);
      } else {
        router.push(`/payment/success/${order.id}`);
      }

      clearCart();
    } catch (error) {
      console.error('Error:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header currentPage="/checkout" />
        <div className="pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Carrinho Vazio</h1>
            <p className="text-gray-600 mb-6">Adicione cursos ao carrinho para continuar</p>
            <a href="/cursos-online" className="bg-etpc-blue text-white px-6 py-3 rounded-lg hover:bg-etpc-blue-dark transition-colors inline-block">
              Ver Cursos
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="/checkout" />

      <div className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

          <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Data */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Dados Pessoais</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
                    <input
                      type="text"
                      required
                      value={customerData.name}
                      onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-etpc-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={customerData.email}
                      onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-etpc-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone *</label>
                    <input
                      type="tel"
                      required
                      value={customerData.phone}
                      onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                      placeholder="(00) 00000-0000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-etpc-blue"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">CPF *</label>
                    <input
                      type="text"
                      required
                      value={customerData.cpf}
                      onChange={(e) => setCustomerData({...customerData, cpf: e.target.value})}
                      placeholder="000.000.000-00"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-etpc-blue"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Forma de Pagamento</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {[
                    { value: 'pix', label: 'PIX', icon: FaQrcode },
                    { value: 'boleto', label: 'Boleto', icon: FaBarcode },
                    { value: 'credit_card', label: 'Crédito', icon: FaCreditCard },
                    { value: 'debit_card', label: 'Débito', icon: FaCreditCard }
                  ].map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setPaymentMethod(method.value as PaymentMethod)}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        paymentMethod === method.value
                          ? 'border-etpc-blue bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <method.icon className="text-2xl mx-auto mb-2" />
                      <div className="text-sm font-medium">{method.label}</div>
                    </button>
                  ))}
                </div>

                {/* Card Form */}
                {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Número do Cartão *</label>
                      <input
                        type="text"
                        required
                        value={cardData.number}
                        onChange={(e) => setCardData({...cardData, number: e.target.value})}
                        placeholder="0000 0000 0000 0000"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-etpc-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nome no Cartão *</label>
                      <input
                        type="text"
                        required
                        value={cardData.holder}
                        onChange={(e) => setCardData({...cardData, holder: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-etpc-blue"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Validade *</label>
                        <input
                          type="text"
                          required
                          value={cardData.expiry}
                          onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                          placeholder="MM/AA"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-etpc-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                        <input
                          type="text"
                          required
                          value={cardData.cvv}
                          onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                          placeholder="000"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-etpc-blue"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Resumo do Pedido</h2>

                <div className="space-y-3 mb-4">
                  {items.map((item) => {
                    const price = item.discountPrice || item.price;
                    return (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 relative flex-shrink-0 bg-gray-100 rounded">
                          {item.image && (
                            <Image src={item.image} alt={item.title} fill className="object-cover rounded" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.title}</p>
                          <p className="text-sm text-gray-600">{formatPrice(price)} x {item.quantity}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(getCartTotal())}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-etpc-blue text-white py-3 rounded-lg font-semibold hover:bg-etpc-blue-dark transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                  <FaLock />
                  {loading ? 'Processando...' : 'Finalizar Compra'}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Pagamento seguro processado pelo Mercado Pago
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
