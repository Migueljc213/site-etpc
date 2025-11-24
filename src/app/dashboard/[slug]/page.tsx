'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaCheckCircle, FaClock, FaPlay, FaChevronDown, FaChevronUp, FaArrowLeft, FaExpand, FaFileAlt } from 'react-icons/fa';
import Link from 'next/link';

interface Lesson {
  id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  duration: number;
  order: number;
  watched?: boolean;
  watchTime?: number;
}

interface Exam {
  id: string;
  title: string;
  description?: string;
  passingScore: number;
  timeLimit?: number;
  isRequired: boolean;
  totalQuestions: number;
  hasAttempt?: boolean;
  passed?: boolean;
  lastScore?: number;
}

interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
  exam?: Exam | null;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  image?: string;
  modules: Module[];
}

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [watchProgress, setWatchProgress] = useState<{ [key: string]: number }>({});
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email && params.slug) {
      fetchCourse();
    }
  }, [status, session, params]);

  // Carregar última posição do vídeo
  useEffect(() => {
    if (selectedLesson?.watchTime && videoRef.current) {
      videoRef.current.currentTime = selectedLesson.watchTime;
    }
  }, [selectedLesson]);

  const fetchCourse = async () => {
    try {
      console.log('📧 Buscando curso:', params.slug, 'para email:', session?.user?.email);
      const response = await fetch(`/api/student/courses/${params.slug}?email=${session?.user?.email}`);
      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📚 Dados do curso recebidos:', data);
        setCourse(data);
        
        // Expandir primeiro módulo por padrão
        if (data.modules && data.modules.length > 0) {
          setExpandedModules(new Set([data.modules[0].id]));
          
          // Selecionar primeira aula não assistida ou primeira aula
          let firstUnwatched = null;
          for (const module of data.modules) {
            for (const lesson of module.lessons || []) {
              if (!lesson.watched) {
                firstUnwatched = lesson;
                break;
              }
            }
            if (firstUnwatched) break;
          }
          
          const selected = firstUnwatched || data.modules[0]?.lessons?.[0];
          console.log('🎬 Aula selecionada:', selected);
          setSelectedLesson(selected);
        }
      } else {
        const error = await response.json();
        console.error('❌ Erro na API:', error);
      }
    } catch (error) {
      console.error('❌ Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsWatched = async (lessonId: string) => {
    if (!session?.user?.email) return;

    try {
      const response = await fetch('/api/student/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          watched: true,
          watchTime: Math.floor(videoRef.current?.currentTime || 0)
        })
      });

      if (response.ok) {
        fetchCourse(); // Recarregar para atualizar progresso
      }
    } catch (error) {
      console.error('Error marking lesson as watched:', error);
    }
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current && selectedLesson) {
      const currentTime = Math.floor(videoRef.current.currentTime);
      setWatchProgress({ ...watchProgress, [selectedLesson.id]: currentTime });

      if (currentTime > 0 && currentTime % 10 === 0) {
        updateProgress(selectedLesson.id, currentTime);
      }
    }
  };

  const updateProgress = async (lessonId: string, watchTime: number) => {
    if (!session?.user?.email) return;

    try {
      await fetch('/api/student/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          watchTime
        })
      });
    } catch (error) {
      console.error('Error updating progress:', error);
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

  const getNextLesson = () => {
    if (!selectedLesson || !course) return null;

    const allLessons = course.modules.flatMap(m => m.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === selectedLesson.id);
    
    if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
      return allLessons[currentIndex + 1];
    }
    
    return null;
  };

  const handleToggleWatched = async (lesson: Lesson, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir que clique na aula
    
    if (!session?.user?.email) return;

    const newWatchedState = !lesson.watched;
    
    try {
      const response = await fetch('/api/student/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id,
          watched: newWatchedState,
          watchTime: newWatchedState ? lesson.duration * 60 : 0
        })
      });

      if (response.ok) {
        fetchCourse(); // Recarregar para atualizar progresso
      }
    } catch (error) {
      console.error('Error toggling watched status:', error);
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    
    // Padrões de URL do YouTube
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }

    // Se já for uma URL embed, retornar como está
    if (url.includes('youtube.com/embed/')) {
      return url;
    }

    return null;
  };

  const isYouTubeUrl = (url?: string) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  if (loading || status === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-etpc-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando curso...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Você precisa estar autenticado para ver este curso</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Curso não encontrado ou você não está matriculado</p>
          <p className="text-gray-600 text-sm mt-2">Slug: {params.slug}</p>
          <p className="text-gray-600 text-sm">Email: {session?.user?.email}</p>
        </div>
      </div>
    );
  }

  const totalLessons = course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const watchedLessons = course.modules.reduce((sum, module) => 
    sum + module.lessons.filter(l => l.watched).length, 0
  );
  const progress = totalLessons > 0 ? Math.round((watchedLessons / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-etpc-blue transition-colors"
          >
            <FaArrowLeft />
            <span>Voltar aos Meus Cursos</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Coluna Principal - Vídeo e Descrição */}
          <div className="lg:col-span-2 space-y-6">
            {/* Título do Curso */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-gray-600">{course.description}</p>
            </div>

            {/* Progresso */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-4">Progresso do Curso</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{watchedLessons} de {totalLessons} aulas concluídas</span>
                  <span className="font-semibold text-etpc-blue">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-etpc-blue to-etpc-blue-dark h-3 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Player de Vídeo */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-black aspect-video relative">
                {selectedLesson?.videoUrl ? (
                  isYouTubeUrl(selectedLesson.videoUrl) ? (
                    <iframe
                      src={getYouTubeEmbedUrl(selectedLesson.videoUrl) || ''}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={selectedLesson.title}
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      src={selectedLesson.videoUrl}
                      className="w-full h-full"
                      controls
                      onTimeUpdate={handleVideoTimeUpdate}
                      onEnded={() => selectedLesson && markAsWatched(selectedLesson.id)}
                    />
                  )
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    <div className="text-center">
                      <FaPlay className="text-6xl mb-4 mx-auto opacity-50" />
                      <p>Selecione uma aula para assistir</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Informações da Aula */}
              {selectedLesson && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedLesson.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <FaClock />
                      <span>{formatTime(selectedLesson.duration)}</span>
                    </div>
                    {selectedLesson.watched && (
                      <div className="flex items-center gap-2 text-green-600">
                        <FaCheckCircle />
                        <span>Concluída</span>
                      </div>
                    )}
                  </div>
                  {selectedLesson.description && (
                    <p className="text-gray-600 mb-4">{selectedLesson.description}</p>
                  )}
                  <div className="flex gap-3">
                    {!isYouTubeUrl(selectedLesson.videoUrl) && (
                      <button
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.requestFullscreen();
                          }
                        }}
                        className="bg-etpc-blue text-white px-6 py-3 rounded-lg hover:bg-etpc-blue-dark transition-colors flex items-center gap-2"
                      >
                        <FaExpand />
                        Assistir em Tela Cheia
                      </button>
                    )}
                    
                    <button
                      onClick={() => markAsWatched(selectedLesson.id)}
                      className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 ${
                        selectedLesson.watched
                          ? 'bg-gray-200 text-gray-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      <FaCheckCircle />
                      {selectedLesson.watched ? 'Marcada como Assistida' : 'Marcar como Assistida'}
                    </button>

                    {getNextLesson() && (
                      <button
                        onClick={() => {
                          const nextLesson = getNextLesson();
                          if (nextLesson) setSelectedLesson(nextLesson);
                        }}
                        className="bg-etpc-blue text-white px-6 py-3 rounded-lg hover:bg-etpc-blue-dark transition-colors flex items-center gap-2"
                      >
                        Próxima Aula
                        <FaArrowLeft className="rotate-180" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Lista de Aulas */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-6">
              <div className="bg-gradient-to-r from-etpc-blue to-etpc-blue-dark p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Conteúdo do Curso</h3>
                <p className="text-sm opacity-90">
                  {course.modules.length} módulos • {totalLessons} aulas
                </p>
              </div>

              <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                {course.modules.map((module) => (
                  <div key={module.id} className="border-b border-gray-200">
                    {/* Cabeçalho do Módulo */}
                    <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{module.title}</h4>
                          <p className="text-sm text-gray-600">
                            {module.lessons.length} aulas
                            {module.description && ` • ${module.description}`}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleModule(module.id)}
                          className="ml-4"
                        >
                          {expandedModules.has(module.id) ? (
                            <FaChevronUp className="text-gray-400" />
                          ) : (
                            <FaChevronDown className="text-gray-400" />
                          )}
                        </button>
                      </div>
                      
                      {/* Botão de Prova */}
                      {module.exam && (
                        <div className="mt-3">
                          <Link
                            href={`/dashboard/${courseSlug}/prova/${module.id}`}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                              module.exam.passed
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : module.exam.hasAttempt
                                ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                                : 'bg-etpc-blue text-white hover:bg-etpc-blue-dark'
                            }`}
                          >
                            <FaFileAlt />
                            {module.exam.passed
                              ? 'Prova Aprovada'
                              : module.exam.hasAttempt
                              ? 'Refazer Prova'
                              : 'Fazer Prova'}
                          </Link>
                          {module.exam.hasAttempt && !module.exam.passed && (
                            <p className="text-xs text-gray-600 text-center mt-1">
                              Última nota: {module.exam.lastScore}%
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Lista de Aulas */}
                    {expandedModules.has(module.id) && (
                      <div className="bg-gray-50">
                        {module.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className={`w-full px-6 py-3 text-left flex items-start gap-3 hover:bg-gray-100 transition-colors border-l-4 ${
                              selectedLesson?.id === lesson.id
                                ? 'border-etpc-blue bg-blue-50'
                                : 'border-transparent'
                            }`}
                          >
                            <button
                              onClick={(e) => handleToggleWatched(lesson, e)}
                              className="flex-shrink-0 mt-1 cursor-pointer hover:scale-110 transition-transform"
                              title={lesson.watched ? 'Desmarcar como assistida' : 'Marcar como assistida'}
                            >
                              {lesson.watched ? (
                                <FaCheckCircle className="text-green-500 text-lg" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-green-500 transition-colors" />
                              )}
                            </button>
                            <button
                              onClick={() => setSelectedLesson(lesson)}
                              className="flex-1 min-w-0 text-left"
                            >
                              <p className={`text-sm font-medium ${
                                selectedLesson?.id === lesson.id
                                  ? 'text-etpc-blue'
                                  : 'text-gray-900'
                              }`}>
                                {lesson.title}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {formatTime(lesson.duration)}
                              </p>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
