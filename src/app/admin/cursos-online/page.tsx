'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaBookOpen } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Image from 'next/image';

interface OnlineCourse {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  image?: string;
  instructor: string;
  price: number;
  discountPrice?: number;
  duration: string;
  level: string;
  category: string;
  active: boolean;
  featured: boolean;
  totalStudents: number;
  createdAt: string;
}

export default function CursosOnlineAdmin() {
  const [courses, setCourses] = useState<OnlineCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/online-courses');
      const data = await response.json();

      // Validate that data is an array
      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        console.error('Invalid data format:', data);
        toast.error('Erro ao carregar cursos');
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Erro ao carregar cursos');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este curso?')) return;

    try {
      const response = await fetch(`/api/online-courses/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Curso excluído com sucesso!');
        fetchCourses();
      } else {
        toast.error('Erro ao excluir curso');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Erro ao excluir curso');
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    try {
      const response = await fetch(`/api/online-courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !active })
      });

      if (response.ok) {
        toast.success(`Curso ${!active ? 'ativado' : 'desativado'} com sucesso!`);
        fetchCourses();
      } else {
        toast.error('Erro ao atualizar curso');
      }
    } catch (error) {
      console.error('Error toggling active:', error);
      toast.error('Erro ao atualizar curso');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true;
    if (filter === 'active') return course.active;
    if (filter === 'inactive') return !course.active;
    if (filter === 'featured') return course.featured;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cursos Online</h1>
          <p className="text-gray-600 mt-1">Gerencie os cursos disponíveis para venda</p>
        </div>
        <Link
          href="/admin/cursos-online/novo"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus />
          Novo Curso
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'Todos' },
            { value: 'active', label: 'Ativos' },
            { value: 'inactive', label: 'Inativos' },
            { value: 'featured', label: 'Destaques' }
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === item.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Courses List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando cursos...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600 mb-4">Nenhum curso encontrado</p>
            <Link
              href="/admin/cursos-online/novo"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <FaPlus />
              Criar primeiro curso
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Curso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alunos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 relative flex-shrink-0 bg-gray-100 rounded">
                          {course.image ? (
                            <Image
                              src={course.image}
                              alt={course.title}
                              fill
                              className="object-cover rounded"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <FaPlus />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{course.title}</div>
                          <div className="text-sm text-gray-500">{course.instructor}</div>
                          {course.featured && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                              Destaque
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{course.category}</div>
                      <div className="text-sm text-gray-500">{course.level}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {course.discountPrice ? (
                          <>
                            <div className="text-green-600">{formatPrice(Number(course.discountPrice))}</div>
                            <div className="text-xs text-gray-400 line-through">{formatPrice(Number(course.price))}</div>
                          </>
                        ) : (
                          formatPrice(Number(course.price))
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{course.totalStudents}</div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(course.id, course.active)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          course.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {course.active ? (
                          <>
                            <FaEye className="mr-1" />
                            Ativo
                          </>
                        ) : (
                          <>
                            <FaEyeSlash className="mr-1" />
                            Inativo
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/cursos-online/${course.id}/modulos`}
                          className="text-green-600 hover:text-green-800 p-2"
                          title="Gerenciar Módulos e Aulas"
                        >
                          <FaBookOpen />
                        </Link>
                        <Link
                          href={`/admin/cursos-online/${course.id}/editar`}
                          className="text-blue-600 hover:text-blue-800 p-2"
                          title="Editar"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="text-red-600 hover:text-red-800 p-2"
                          title="Excluir"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Total de Cursos</div>
          <div className="text-2xl font-bold text-gray-900">{courses.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Ativos</div>
          <div className="text-2xl font-bold text-green-600">
            {courses.filter(c => c.active).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Destaques</div>
          <div className="text-2xl font-bold text-yellow-600">
            {courses.filter(c => c.featured).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Total de Alunos</div>
          <div className="text-2xl font-bold text-blue-600">
            {courses.reduce((sum, c) => sum + c.totalStudents, 0)}
          </div>
        </div>
      </div>
    </div>
  );
}
