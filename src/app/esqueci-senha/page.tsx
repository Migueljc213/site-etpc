'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Toast from '@/components/Toast';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export default function EsqueciSenhaPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setToast({ message, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);

    if (!email) {
      showToast('Por favor, informe seu email', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        showToast(
          'Email de recuperação enviado! Verifique sua caixa de entrada.',
          'success'
        );
        // Limpar formulário após 3 segundos
        setTimeout(() => {
          setEmail('');
        }, 3000);
      } else {
        showToast(data.error || 'Erro ao enviar email de recuperação', 'error');
      }
    } catch (error) {
      showToast('Erro ao processar solicitação. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-32 pb-12">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-etpc-blue bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-etpc-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Recuperar Senha
              </h1>
              <p className="text-gray-600">
                Digite seu email e enviaremos um link para redefinir sua senha
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-etpc-blue focus:border-transparent text-gray-900"
                  placeholder="seu@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-etpc-blue text-white py-3 px-4 rounded-lg font-semibold hover:bg-etpc-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Lembrou da senha?{' '}
                <Link
                  href="/login"
                  className="text-etpc-blue hover:text-etpc-blue-dark font-semibold"
                >
                  Fazer Login
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Não tem uma conta?{' '}
                <Link
                  href="/cadastro"
                  className="text-etpc-blue hover:text-etpc-blue-dark"
                >
                  Cadastre-se
                </Link>
              </p>
            </div>
          </div>

          {/* Info adicional */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Importante:</strong> O link de recuperação é válido por 1 hora. Se não encontrar o email, verifique sua pasta de spam.
            </p>
          </div>
        </div>
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Footer />
    </div>
  );
}

