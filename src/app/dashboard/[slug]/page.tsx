'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaCheckCircle, FaClock, FaFileVideo } from 'react-icons/fa';

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

interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
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
  const { data: session, status } = useSession();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [watchProgress, setWatchProgress] = useState<{ [key: string]: number }>({});
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email && params.slug) {
      fetchCourse();
    }
  }, [status, session, params]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/student/courses/${params.slug}`);
      if (response.ok) {
        const data = await response.json();
        setCourse(data);
        
        if (data.modules?.[0]?.lessons?.[0]) {
          setSelectedLesson(data.modules[0].lessons[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching course:', error);
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

      if (response.ok && selectedLesson) {
        setSelectedLesson({ ...selectedLesson, watched: true });
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

  if (!course || !session) {
    return null;
  }

  const totalLessons = course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const watchedLessons = course.modules.reduce((sum, module) => 
    sum + module.lessons.filter(l => l.watched).length, 0
  );
  const progress = totalLessons > 0 ? Math.round((watchedLessons / totalLessons) * 100) : 0;

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Conteúdo do Curso</h2>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progresso</span>
              <span className="font-semibold text-gray-900">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-etpc-blue h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="space-y-4">
            {course.modules.map((module) => (
              <div key={module.id}>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  {module.title}
                </h3>
                <div className="space-y-1">
                  {module.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => setSelectedLesson(lesson)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-3 ${
                        selectedLesson?.id === lesson.id
                          ? 'bg-etpc-blue text-white'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <FaFileVideo className="flex-shrink-0" />
                      <span className="flex-1 text-sm truncate">{lesson.title}</span>
                      {lesson.watched && (
                        <FaCheckCircle className="text-green-500 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Video Player */}
        <div className="bg-black aspect-video">
          {selectedLesson?.videoUrl ? (
            <video
              ref={videoRef}
              src={selectedLesson.videoUrl}
              className="w-full h-full"
              controls
              onTimeUpdate={handleVideoTimeUpdate}
              onEnded={() => selectedLesson && markAsWatched(selectedLesson.id)}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              <p>Selecione uma aula para assistir</p>
            </div>
          )}
        </div>

        {/* Lesson Info */}
        {selectedLesson && (
          <div className="p-6 bg-white border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedLesson.title}
            </h2>
            {selectedLesson.description && (
              <p className="text-gray-600">{selectedLesson.description}</p>
            )}
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FaClock />
                <span>{Math.floor(selectedLesson.duration)} min</span>
              </div>
              {selectedLesson.watched && (
                <div className="flex items-center gap-2 text-green-600">
                  <FaCheckCircle />
                  <span>Assistida</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
