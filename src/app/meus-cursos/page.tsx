'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaPlayCircle, FaClock, FaCheckCircle } from 'react-icons/fa';

interface Course {
  id: string;
  title: string;
  slug: string;
  image: string;
  instructor: string;
  progress: number;
  totalMinutes: number;
  watchedMinutes: number;
}

export default function MeusCursosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.email) {
      fetchMyCourses();
    }
  }, [status, session]);

  const fetchMyCourses = async () => {
    try {
      const response = await fetch(`/api/student/courses?email=${session?.user?.email}`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-etpc-blue"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12 mt-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Meus Cursos</h1>
          <p className="text-gray-600">Gerencie seus cursos e acompanhe seu progresso</p>
        </div>

        {courses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaPlayCircle className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Você ainda não possui cursos
            </h2>
            <p className="text-gray-600 mb-6">
              Compre cursos online e eles aparecerão aqui
            </p>
            <a
              href="/cursos-online"
              className="inline-block bg-etpc-blue text-white px-6 py-3 rounded-lg hover:bg-etpc-blue-dark transition-colors"
            >
              Explorar Cursos
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/meus-cursos/${course.slug}`)}
              >
                {course.image && (
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <div className="bg-white rounded-full px-3 py-1 text-sm font-semibold text-etpc-blue">
                        {course.progress}%
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {course.instructor}
                  </p>

                  <div className="space-y-3">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progresso</span>
                        <span className="text-gray-900 font-semibold">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-etpc-blue h-2 rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Time Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaClock />
                        <span>{formatTime(course.watchedMinutes)}</span>
                      </div>
                      <span>/</span>
                      <div className="flex items-center gap-2">
                        <FaCheckCircle />
                        <span>{formatTime(course.totalMinutes)}</span>
                      </div>
                    </div>
                  </div>

                  <button className="mt-4 w-full bg-etpc-blue text-white py-2 px-4 rounded-lg hover:bg-etpc-blue-dark transition-colors flex items-center justify-center gap-2">
                    <FaPlayCircle />
                    Continuar Assistindo
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

