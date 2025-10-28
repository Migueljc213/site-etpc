'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaUser, FaEnvelope, FaCalendar, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function PerfilPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/perfil');
    }
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
      });
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        // Atualizar sessão
        await update({
          ...session,
          user: {
            ...session?.user,
            name: data.name,
            email: data.email,
          },
        });
        toast.success('Perfil atualizado com sucesso!');
        setEditing(false);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Erro ao atualizar perfil');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-etpc-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!session) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
              <p className="text-gray-600">Gerencie suas informações pessoais</p>
            </div>

            {/* Card de Perfil */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Avatar e Info Básica */}
              <div className="bg-gradient-to-r from-etpc-blue to-etpc-blue-dark p-8 text-white">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-etpc-blue text-4xl font-bold shadow-lg">
                    {session.user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{session.user.name}</h2>
                    <p className="text-blue-100">{session.user.email}</p>
                    {session.user.role && (
                      <span className="inline-block mt-2 px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                        {session.user.role === 'admin' ? 'Administrador' : 'Estudante'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Formulário */}
              <div className="p-8">
                {!editing ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaUser className="inline mr-2" />
                        Nome Completo
                      </label>
                      <p className="text-lg text-gray-900">{session.user.name}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaEnvelope className="inline mr-2" />
                        E-mail
                      </label>
                      <p className="text-lg text-gray-900">{session.user.email}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaCalendar className="inline mr-2" />
                        Membro desde
                      </label>
                      <p className="text-lg text-gray-900">
                        {session.user.createdAt
                          ? formatDate(session.user.createdAt)
                          : 'Data não disponível'}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setEditing(true)}
                        className="bg-etpc-blue text-white px-6 py-3 rounded-lg hover:bg-etpc-blue-dark transition-colors flex items-center gap-2"
                      >
                        <FaEdit />
                        Editar Perfil
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-etpc-blue focus:border-transparent text-gray-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-mail
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-etpc-blue focus:border-transparent text-gray-900"
                        required
                        disabled
                        title="O e-mail não pode ser alterado"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        O e-mail não pode ser alterado
                      </p>
                    </div>

                    <div className="flex gap-3 pt-6 border-t border-gray-200">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-etpc-blue text-white px-6 py-3 rounded-lg hover:bg-etpc-blue-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <FaSave />
                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(false);
                          setFormData({
                            name: session.user.name || '',
                            email: session.user.email || '',
                          });
                        }}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <FaTimes />
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Links Rápidos */}
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <a
                href="/historico-pagamentos"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-gray-900 mb-2">Histórico de Pagamentos</h3>
                <p className="text-sm text-gray-600">
                  Visualize suas compras e transações
                </p>
              </a>
              <a
                href="/trocar-senha"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-gray-900 mb-2">Trocar Senha</h3>
                <p className="text-sm text-gray-600">
                  Atualize sua senha de acesso
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

