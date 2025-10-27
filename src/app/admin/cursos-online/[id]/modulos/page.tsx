'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaPlus, FaEdit, FaTrash, FaBookOpen, FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
}

export default function ModulosPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Form states
  const [moduleData, setModuleData] = useState({ title: '', description: '', order: 0 });
  const [lessonData, setLessonData] = useState({ title: '', description: '', videoUrl: '', duration: 0, order: 0 });

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status, courseId]);

  const fetchData = async () => {
    try {
      const [courseRes, modulesRes] = await Promise.all([
        fetch(`/api/admin/online-courses/${courseId}`),
        fetch(`/api/admin/online-courses/${courseId}/modules`)
      ]);

      if (courseRes.ok) {
        const courseData = await courseRes.json();
        setCourse(courseData);
      }

      if (modulesRes.ok) {
        const modulesData = await modulesRes.json();
        setModules(modulesData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/admin/online-courses/${courseId}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moduleData)
      });

      if (response.ok) {
        setShowModuleForm(false);
        setModuleData({ title: '', description: '', order: 0 });
        fetchData();
      }
    } catch (error) {
      console.error('Error creating module:', error);
    }
  };

  const handleCreateLesson = async (e: React.FormEvent, moduleId: string) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/admin/online-courses/${courseId}/modules/${moduleId}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lessonData)
      });

      if (response.ok) {
        setShowLessonForm(null);
        setLessonData({ title: '', description: '', videoUrl: '', duration: 0, order: 0 });
        fetchData();
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
    }
  };

  const deleteModule = async (moduleId: string) => {
    if (!confirm('Tem certeza que deseja excluir este módulo e todas as suas aulas?')) return;

    try {
      const response = await fetch(`/api/admin/online-courses/${courseId}/modules/${moduleId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting module:', error);
    }
  };

  const deleteLesson = async (moduleId: string, lessonId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta aula?')) return;

    try {
      const response = await fetch(`/api/admin/online-courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-etpc-blue"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/admin/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin/cursos-online')}
            className="text-etpc-blue hover:underline mb-4"
          >
            ← Voltar para Cursos Online
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Módulos e Aulas: {course?.title}
          </h1>
        </div>

        {/* Botão Adicionar Módulo */}
        <button
          onClick={() => setShowModuleForm(!showModuleForm)}
          className="mb-6 bg-etpc-blue text-white px-6 py-3 rounded-lg hover:bg-etpc-blue-dark transition-colors flex items-center gap-2"
        >
          <FaPlus />
          Adicionar Módulo
        </button>

        {/* Formulário de Módulo */}
        {showModuleForm && (
          <form onSubmit={handleCreateModule} className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Novo Módulo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título do Módulo
                </label>
                <input
                  type="text"
                  required
                  value={moduleData.title}
                  onChange={(e) => setModuleData({ ...moduleData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-etpc-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordem
                </label>
                <input
                  type="number"
                  required
                  value={moduleData.order}
                  onChange={(e) => setModuleData({ ...moduleData, order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-etpc-blue focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={moduleData.description}
                  onChange={(e) => setModuleData({ ...moduleData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-etpc-blue focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="bg-etpc-blue text-white px-6 py-2 rounded-lg hover:bg-etpc-blue-dark transition-colors"
              >
                Salvar Módulo
              </button>
              <button
                type="button"
                onClick={() => setShowModuleForm(false)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Lista de Módulos */}
        <div className="space-y-4">
          {modules.map((module) => (
            <div key={module.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Cabeçalho do Módulo */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between"
                onClick={() => toggleModule(module.id)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <FaBookOpen className="text-etpc-blue text-xl" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {module.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {module.lessons.length} {module.lessons.length === 1 ? 'aula' : 'aulas'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowLessonForm(module.id);
                    }}
                    className="bg-etpc-blue text-white px-4 py-2 rounded-lg hover:bg-etpc-blue-dark transition-colors flex items-center gap-2"
                  >
                    <FaPlus />
                    Adicionar Aula
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteModule(module.id);
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <FaTrash />
                  </button>
                  {expandedModules.has(module.id) ? (
                    <FaChevronUp className="text-gray-400" />
                  ) : (
                    <FaChevronDown className="text-gray-400" />
                  )}
                </div>
              </div>

              {/* Lista de Aulas */}
              {expandedModules.has(module.id) && (
                <div className="border-t border-gray-200 p-6">
                  {/* Formulário de Aula */}
                  {showLessonForm === module.id && (
                    <form
                      onSubmit={(e) => handleCreateLesson(e, module.id)}
                      className="bg-gray-50 rounded-lg p-4 mb-4"
                    >
                      <h4 className="font-semibold mb-3">Nova Aula</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Título
                          </label>
                          <input
                            type="text"
                            required
                            value={lessonData.title}
                            onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            URL do Vídeo
                          </label>
                          <input
                            type="url"
                            required
                            value={lessonData.videoUrl}
                            onChange={(e) => setLessonData({ ...lessonData, videoUrl: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Duração (minutos)
                          </label>
                          <input
                            type="number"
                            required
                            value={lessonData.duration}
                            onChange={(e) => setLessonData({ ...lessonData, duration: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ordem
                          </label>
                          <input
                            type="number"
                            required
                            value={lessonData.order}
                            onChange={(e) => setLessonData({ ...lessonData, order: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descrição
                          </label>
                          <textarea
                            value={lessonData.description}
                            onChange={(e) => setLessonData({ ...lessonData, description: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          type="submit"
                          className="bg-etpc-blue text-white px-4 py-2 rounded-lg hover:bg-etpc-blue-dark text-sm"
                        >
                          Salvar
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowLessonForm(null)}
                          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Lista de Aulas */}
                  <div className="space-y-2">
                    {module.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{lesson.title}</p>
                          <p className="text-sm text-gray-600">
                            {lesson.duration}min • Ordem: {lesson.order}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={lesson.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-etpc-blue hover:underline text-sm"
                          >
                            Ver Vídeo
                          </a>
                          <button
                            onClick={() => deleteLesson(module.id, lesson.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

