'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaEye, FaPhone, FaEnvelope, FaBuilding, FaUser } from 'react-icons/fa';

interface Matricula {
  id: string;
  responsavel: string;
  email: string;
  telefone: string;
  aluno: string;
  ano: number;
  nivel: string;
  mensagem?: string;
  status: string;
  createdAt: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  type: string;
  status: string;
  createdAt: string;
}

export default function Contatos() {
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'matriculas' | 'contatos'>('matriculas');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [matriculasRes, contactsRes] = await Promise.all([
        fetch('/api/matriculas'),
        fetch('/api/in-company')
      ]);

      if (matriculasRes.ok) {
        const matriculasData = await matriculasRes.json();
        setMatriculas(matriculasData);
      }

      if (contactsRes.ok) {
        const contactsData = await contactsRes.json();
        setContacts(contactsData);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
      case 'new':
        return 'bg-yellow-100 text-yellow-800';
      case 'contatado':
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'matriculado':
      case 'closed':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-etpc-blue"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="inline-flex items-center text-etpc-blue hover:text-etpc-blue-dark mb-4">
            <FaArrowLeft className="mr-2" />
            Voltar ao Painel
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Contatos e Matrículas</h1>
          <p className="text-gray-600 mt-2">Gerencie solicitações de matrícula e contatos in-company</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('matriculas')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'matriculas'
                    ? 'border-etpc-blue text-etpc-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Matrículas ({matriculas.length})
              </button>
              <button
                onClick={() => setActiveTab('contatos')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'contatos'
                    ? 'border-etpc-blue text-etpc-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Contatos In-Company ({contacts.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Matrículas Tab */}
        {activeTab === 'matriculas' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Solicitações de Matrícula</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Responsável
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aluno
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nível
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ano
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {matriculas.map((matricula) => (
                    <tr key={matricula.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaUser className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{matricula.responsavel}</div>
                            <div className="text-sm text-gray-500">{matricula.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {matricula.aluno}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {matricula.nivel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {matricula.ano}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(matricula.status)}`}>
                          {matricula.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(matricula.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-etpc-blue hover:text-etpc-blue-dark">
                          <FaEye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Contatos Tab */}
        {activeTab === 'contatos' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Contatos In-Company</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telefone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assunto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaBuilding className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaEnvelope className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">{contact.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaPhone className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">{contact.phone || '-'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contact.subject || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contact.status)}`}>
                          {contact.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(contact.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-etpc-blue hover:text-etpc-blue-dark">
                          <FaEye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {((activeTab === 'matriculas' && matriculas.length === 0) || 
          (activeTab === 'contatos' && contacts.length === 0)) && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">
              {activeTab === 'matriculas' ? '📝' : '📞'}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum {activeTab === 'matriculas' ? 'matrícula' : 'contato'} encontrado
            </h3>
            <p className="text-gray-500">
              {activeTab === 'matriculas' 
                ? 'Ainda não há solicitações de matrícula.'
                : 'Ainda não há contatos in-company.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
