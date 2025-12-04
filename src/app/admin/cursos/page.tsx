'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaGraduationCap, FaEye, FaEyeSlash, FaEdit, FaTrash, FaClock, FaMoneyBillWave, FaChartLine, FaBook } from 'react-icons/fa';

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
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
        >
          <FaPlus className="text-sm" />
          Novo Curso
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
            <div key={curso.id} className="p-6 hover:bg-blue-50 transition-colors">
              <div className="flex items-start space-x-6">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-3xl border-2 border-blue-200">
                    <FaGraduationCap className="text-blue-600" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{curso.title}</h3>
                    {curso.active ? (
                      <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                        <FaEye className="text-xs" />
                        Ativo
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                        <FaEyeSlash className="text-xs" />
                        Inativo
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">{curso.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-blue-600" />
                      <span className="text-gray-700"><strong>Duração:</strong> {curso.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaChartLine className="text-blue-600" />
                      <span className="text-gray-700"><strong>Empregabilidade:</strong> {curso.employability}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMoneyBillWave className="text-blue-600" />
                      <span className="text-gray-700"><strong>Salário:</strong> {curso.salary}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMoneyBillWave className="text-blue-600" />
                      <span className="text-gray-700"><strong>Mensalidade:</strong> {curso.monthlyValue}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <FaBook className="text-blue-600" />
                    <span className="text-gray-700"><strong>Módulos:</strong> {curso.modules.length} módulos</span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleActive(curso.id)}
                    className={`px-4 py-2 text-sm rounded-lg transition-all transform hover:scale-105 flex items-center gap-2 ${
                      curso.active 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                    title={curso.active ? 'Desativar curso' : 'Ativar curso'}
                  >
                    {curso.active ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                    {curso.active ? 'Desativar' : 'Ativar'}
                  </button>
                  
                  <Link
                    href={`/admin/cursos/${curso.id}/editar`}
                    className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm rounded-lg transition-all transform hover:scale-105 flex items-center gap-2"
                    title="Editar curso"
                  >
                    <FaEdit className="text-sm" />
                    Editar
                  </Link>
                  
                  <button
                    onClick={() => handleDelete(curso.id)}
                    className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 text-sm rounded-lg transition-all transform hover:scale-105 flex items-center gap-2"
                    title="Excluir curso"
                  >
                    <FaTrash className="text-sm" />
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
