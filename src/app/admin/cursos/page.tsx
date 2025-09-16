'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Curso {
  id: string;
  title: string;
  description: string;
  icon: string;
  duration: string;
  period: string;
  employability: string;
  salary: string;
  monthlyValue: string;
  prerequisites: string;
  targetAudience: string;
  modules: Array<{
    title: string;
    subjects: string[];
  }>;
  opportunities: string[];
  labs: string[];
  color: string;
  bgColor: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CursosAdmin() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de cursos
    const mockCursos: Curso[] = [
      {
        id: '1',
        title: 'Automação Industrial',
        description: 'Forme-se como Técnico em Automação Industrial, essencial para o mercado atual e futuro das empresas.',
        icon: '🏭',
        duration: '18 meses',
        period: 'Matutino, Vespertino ou Noturno',
        employability: '96%',
        salary: 'R$ 3.500 - R$ 8.500',
        monthlyValue: 'R$ 504,00',
        prerequisites: 'Ensino Médio Completo ou cursando o último ano do ensino médio',
        targetAudience: 'Todos que desejam realizar um curso técnico para uma posição melhor profissionalmente',
        modules: [
          {
            title: 'Módulo 1',
            subjects: ['Circuitos Hidropneumáticos', 'Mecânica Básica e impressão 3D', 'Eletrotécnica', 'Eletrônica Digital']
          },
          {
            title: 'Módulo 2',
            subjects: ['Gestão da Manutenção', 'Máquinas e Equipamentos Elétricos Industriais', 'Automação e Indústria 4.0', 'Robótica Industrial']
          },
          {
            title: 'Módulo 3',
            subjects: ['Projeto', 'Automação e Indústria 4.0', 'Sistemas de Supervisão, redes e Instrumentação Industrial', 'Eletrônica Industrial']
          }
        ],
        opportunities: ['Técnico em Automação Industrial', 'Técnico em Robótica', 'Técnico em Manutenção Industrial'],
        labs: ['Laboratório de Automação Industrial', 'Lab de Robótica', 'Lab de Eletrônica Industrial'],
        color: 'from-blue-500 to-cyan-600',
        bgColor: 'from-blue-50 to-cyan-50',
        active: true,
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z'
      }
    ];
    
    setTimeout(() => {
      setCursos(mockCursos);
      setLoading(false);
    }, 1000);
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este curso?')) {
      setCursos(cursos.filter(curso => curso.id !== id));
    }
  };

  const handleToggleActive = async (id: string) => {
    setCursos(cursos.map(curso => 
      curso.id === id 
        ? { ...curso, active: !curso.active }
        : curso
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Cursos</h1>
          <p className="text-gray-600">Gerencie todos os cursos técnicos do site</p>
        </div>
        <Link
          href="/admin/cursos/novo"
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Novo Curso
        </Link>
      </div>

      {/* Cursos List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Cursos ({cursos.length})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {cursos.map((curso) => (
            <div key={curso.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                    {curso.icon}
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{curso.title}</h3>
                    {curso.active ? (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Ativo
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        Inativo
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-3">{curso.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                    <div>
                      <span className="font-medium">Duração:</span> {curso.duration}
                    </div>
                    <div>
                      <span className="font-medium">Empregabilidade:</span> {curso.employability}
                    </div>
                    <div>
                      <span className="font-medium">Salário:</span> {curso.salary}
                    </div>
                    <div>
                      <span className="font-medium">Mensalidade:</span> {curso.monthlyValue}
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-500">
                    <span className="font-medium">Módulos:</span> {curso.modules.length} módulos
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleActive(curso.id)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      curso.active 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {curso.active ? 'Desativar' : 'Ativar'}
                  </button>
                  
                  <Link
                    href={`/admin/cursos/${curso.id}/editar`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Editar
                  </Link>
                  
                  <button
                    onClick={() => handleDelete(curso.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
