'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiFileText, FiDownload } from 'react-icons/fi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function BoletoPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      fetchPayment();
    }
  }, [orderId]);

  const fetchPayment = async () => {
    try {
      const response = await fetch(`/api/payments/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setPayment(data);
      }
    } catch (error) {
      console.error('Error fetching payment:', error);
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

  const webhookData = payment?.webhookData ? JSON.parse(payment.webhookData) : null;
  const boletoData = webhookData?.boleto_data || webhookData;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <FiFileText className="text-3xl text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Boleto Bancário</h1>
                <p className="text-gray-600">Pague até a data de vencimento</p>
              </div>
            </div>

            {payment && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  ⚠️ Este boleto vence em {payment.boletoExpiresAt ? 
                    new Date(payment.boletoExpiresAt).toLocaleDateString('pt-BR') : 
                    '3 dias'}
                </p>
              </div>
            )}
          </div>

          {/* Informações do Boleto */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Dados do Boleto</h2>
            
            <div className="space-y-4">
              {/* Código de Barras */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Código de Barras
                </label>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg p-4">
                  <code className="flex-1 text-lg font-mono text-gray-900 break-all">
                    {boletoData?.barcode || payment?.boletoBarcode || 'Gerando...'}
                  </code>
                  <button
                    onClick={() => {
                      const barcode = boletoData?.barcode || payment?.boletoBarcode;
                      navigator.clipboard.writeText(barcode);
                    }}
                    className="px-3 py-2 bg-etpc-blue text-white rounded hover:bg-etpc-blue-dark transition-colors"
                  >
                    Copiar
                  </button>
                </div>
              </div>

              {/* Linha Digitável */}
              {boletoData?.ticket_url && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Linha Digitável
                  </label>
                  <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                    <code className="text-base font-mono text-gray-900">
                      {boletoData?.ticket_url}
                    </code>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* PDF do Boleto */}
          {(payment?.boletoPdf || boletoData?.external_resource_url) && (
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Download do Boleto</h2>
              <a
                href={payment?.boletoPdf || boletoData?.external_resource_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-etpc-blue text-white py-3 px-6 rounded-lg font-semibold hover:bg-etpc-blue-dark transition-colors"
              >
                <FiDownload className="text-xl" />
                Baixar PDF do Boleto
              </a>
            </div>
          )}

          {/* Instruções */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-900 mb-3">📋 Como Pagar</h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li>1. Acesse seu banco (internet banking ou aplicativo)</li>
              <li>2. Escaneie o código de barras ou digite o código manualmente</li>
              <li>3. Confirme o pagamento</li>
              <li>4. Aguarde a confirmação (até 2 dias úteis)</li>
            </ul>
          </div>

          {/* Botões */}
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex-1 bg-white border-2 border-etpc-blue text-etpc-blue py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Voltar ao Início
            </button>
            <button
              onClick={() => router.push('/cursos-online')}
              className="flex-1 bg-etpc-blue text-white py-3 px-6 rounded-lg font-semibold hover:bg-etpc-blue-dark transition-colors"
            >
              Ver Mais Cursos
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

