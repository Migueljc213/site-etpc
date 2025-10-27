'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaPlay, FaClock, FaCheckCircle, FaBookOpen } from 'react-icons/fa';

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
  watched: boolean;
  watchTime: number;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  image: string;
  instructor: string;
  modules: Module[];
}

export default function CursoDetalhesPage() {
  const { data: session } = useSession();
  const { slug } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [watchProgress, setWatchProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug && session?.user?.email) {
      fetchCourseDetails();
    }
  }, [slug, session]);

  const fetchCourseDetails = async () => {
    try {
      const response = await fetch(`/api/student/courses/${slug}?email=${session?.user?.email}`);
      if (response.ok) {
        const data = await response.json();
        setCourse(data);
        
        // Selecionar primeira aula não assistida ou última assistida
        if (data.modules && data.modules.length > 0) {
          const allLessons = data.modules.flatMap((m: Module) => m.lessons);
          const unwatchedLesson = allLessons.find((l: Lesson) => !l.watched);
          setSelectedLesson(unwatchedLesson || allLessons[allLessons.length - 1]);
        }
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoProgress = async (currentTime: number, duration: number) => {
    if (!selectedLesson || !session?.user?.email) return;

    const progress = (currentTime / duration) * 100;
    setWatchProgress(progress);

    // Salvar progresso a cada 30 segundos
    if (currentTime % 30 < 1) {
      await fetch('/api/student/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: selectedLesson.id,
          studentEmail: session.user.email,
          watchTime: currentTime
        })
      });
    }

    // Marcar como assistida quando chegar a 80% do vídeo
    if (progress >= 80 && !selectedLesson.watched) {
      await fetch('/api/student/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: selectedLesson.id,
          studentEmail: session.user.email,
          watchTime: currentTime,
          watched: true
        })
      });
      
      // Atualizar estado local
      if (course) {
        const updatedModules = course.modules.map(m => ({
          ...m,
          lessons: m.lessons.map(l =>
            l.id === selectedLesson.id ? { ...l, watched: true } : l
          )
        }));
        setCourse({ ...course, modules: updatedModules });
        setSelectedLesson({ ...selectedLesson, watched: true });
      }
    }
  };

  const handleVideoEnd = async () => {
    if (!selectedLesson || !session?.user?.email) return;

    await fetch('/api/student/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lessonId: selectedLesson.id,
        studentEmail: session.user.email,
        watched: true
      })
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-etpc-blue"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Curso não encontrado</h1>
          <button
            onClick={() => router.push('/meus-cursos')}
            className="text-etpc-blue hover:underline"
          >
            Voltar para Meus Cursos
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar - Módulos e Aulas */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6 h-fit sticky top-24">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Conteúdo do Curso</h2>
                <p className="text-sm text-gray-600">{course.title}</p>
              </div>

              <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                {course.modules.map((module, moduleIndex) => (
                  <div key={module.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-3">
                      <FaBookOpen className="text-etpc-blue" />
                      <h3 className="font-semibold text-gray-900">
                        Módulo {moduleIndex + 1}: {module.title}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {module.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => setSelectedLesson(lesson)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            selectedLesson?.id === lesson.id
                              ? 'bg-etpc-blue text-white'
                              : lesson.watched
                              ? 'bg-green-50 text-gray-700 hover:bg-green-100'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {lesson.watched ? (
                              <FaCheckCircle className="text-green-600 flex-shrink-0" />
                            ) : (
                              <FaPlay className="flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{lesson.title}</p>
                              <div className="flex items-center gap-2 text-xs mt-1">
                                <FaClock />
                                <span>{lesson.duration}min</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conteúdo Principal - Player de Vídeo */}
            <div className="lg:col-span-2">
              {selectedLesson ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Player de Vídeo */}
                  <div className="aspect-video bg-black">
                    {selectedLesson.videoUrl ? (
                      <video
                        key={selectedLesson.id}
                        controls
                        autoPlay
                        className="w-full h-full"
                        onTimeUpdate={(e) => {
                          const video = e.currentTarget;
                          handleVideoProgress(video.currentTime, video.duration);
                        }}
                        onEnded={handleVideoEnd}
                      >
                        <source src={selectedLesson.videoUrl} type="video/mp4" />
                        Seu navegador não suporta o elemento de vídeo.
                      </video>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">
                        <p>Vídeo não disponível</p>
                      </div>
                    )}
                  </div>

                  {/* Informações da Aula */}
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {selectedLesson.title}
                    </h1>
                    <p className="text-gray-600 mb-4">{selectedLesson.description}</p>
                    
                    {selectedLesson.watched && (
                      <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg mb-4">
                        <FaCheckCircle />
                        <span className="font-medium">Aula concluída</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <p className="text-gray-600">Selecione uma aula para assistir</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

