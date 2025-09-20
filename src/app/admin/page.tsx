'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaNewspaper, FaImage, FaGraduationCap, FaCog, FaUsers } from 'react-icons/fa';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    noticias: 0,
    banners: 0,
    cursos: 0,
    usuarios: 0
  });

  useEffect(() => {
    // Simular carregamento de estatísticas
    setStats({
      noticias: 12,
      banners: 3,
      cursos: 6,
      usuarios: 1
    });
  }, []);

  const quickActions = [
    {
      title: 'Nova Notícia',
      description: 'Criar uma nova notícia para o site',
      href: '/admin/noticias/novo',
      icon: 'FaNewspaper',
      color: 'bg-gray-600'
    },
    {
      title: 'Novo Banner',
      description: 'Adicionar um novo banner promocional',
      href: '/admin/banners/novo',
      icon: 'FaImage',
      color: 'bg-gray-600'
    },
    {
      title: 'Novo Curso',
      description: 'Cadastrar um novo curso técnico',
      href: '/admin/cursos/novo',
      icon: 'FaGraduationCap',
      color: 'bg-gray-600'
    },
    {
      title: 'Configurações',
      description: 'Ajustar configurações do site',
      href: '/admin/configuracoes',
      icon: 'FaCog',
      color: 'bg-gray-600'
    }
  ];

  const recentActivity = [
    {
      action: 'Notícia criada',
      description: 'ETPC abre inscrições para curso preparatório Petrobrás 2023',
      time: '2 horas atrás',
      icon: 'FaNewspaper'
    },
    {
      action: 'Banner atualizado',
      description: 'Banner principal da homepage',
      time: '4 horas atrás',
      icon: 'FaImage'
    },
    {
      action: 'Curso editado',
      description: 'Automação Industrial - módulos atualizados',
      time: '1 dia atrás',
      icon: 'FaGraduationCap'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo ao painel administrativo da ETPC</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FaNewspaper className="text-2xl text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Notícias</p>
              <p className="text-2xl font-bold text-gray-900">{stats.noticias}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FaImage className="text-2xl text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Banners</p>
              <p className="text-2xl font-bold text-gray-900">{stats.banners}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FaGraduationCap className="text-2xl text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cursos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.cursos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FaUsers className="text-2xl text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Usuários</p>
              <p className="text-2xl font-bold text-gray-900">{stats.usuarios}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Ações Rápidas</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-2 ${action.color} rounded-lg text-white mr-3`}>
                    {action.icon === 'FaNewspaper' && <FaNewspaper className="text-lg" />}
                    {action.icon === 'FaImage' && <FaImage className="text-lg" />}
                    {action.icon === 'FaGraduationCap' && <FaGraduationCap className="text-lg" />}
                    {action.icon === 'FaCog' && <FaCog className="text-lg" />}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Atividade Recente</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm">{activity.icon}</span>
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Status do Sistema</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-900">Site Online</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-900">Banco de Dados</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-900">API Funcionando</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
