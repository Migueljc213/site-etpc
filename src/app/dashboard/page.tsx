'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaPlayCircle, FaClock, FaCheckCircle, FaGraduationCap, FaBookOpen, FaTrophy, FaChartLine } from 'react-icons/fa';

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

interface DashboardStats {
  totalCourses: number;
  totalMinutes: number;
  watchedMinutes: number;
  completedCourses: number;
}

export default function StudentDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    totalMinutes: 0,
    watchedMinutes: 0,
    completedCourses: 0
  });

  useEffect(() => {
    setIsClient(true);
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
        
        // Calcular estatísticas
        const totalCourses = data.length;
        const totalMinutes = data.reduce((sum: number, course: Course) => sum + course.totalMinutes, 0);
        const watchedMinutes = data.reduce((sum: number, course: Course) => sum + course.watchedMinutes, 0);
        const completedCourses = data.filter((course: Course) => course.progress === 100).length;
        
        setStats({
          totalCourses,
          totalMinutes,
          watchedMinutes,
          completedCourses
        });
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

  if (!isClient || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-etpc-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        {/* Header com Welcome */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Olá, {session?.user?.name?.split(' ')[0] || 'Estudante'}! 👋
          </h1>
          <p className="text-gray-600">Bem-vindo ao seu painel de aprendizado</p>
        </div>

        {/* Cards de Estatísticas */}
        {courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Cursos */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-etpc-blue">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-etpc-blue bg-opacity-10 rounded-lg p-3">
                  <FaBookOpen className="text-etpc-blue text-2xl" />
                </div>
                <FaChartLine className="text-gray-400 text-sm" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Meus Cursos</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCourses}</p>
            </div>

            {/* Horas Assistidas */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-500 bg-opacity-10 rounded-lg p-3">
                  <FaClock className="text-green-500 text-2xl" />
                </div>
                <FaChartLine className="text-gray-400 text-sm" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Horas Assistidas</h3>
              <p className="text-3xl font-bold text-gray-900">
                {formatTime(stats.watchedMinutes)}
              </p>
            </div>

            {/* Concluídos */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-500 bg-opacity-10 rounded-lg p-3">
                  <FaTrophy className="text-purple-500 text-2xl" />
                </div>
                <FaChartLine className="text-gray-400 text-sm" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Cursos Concluídos</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.completedCourses}</p>
            </div>

            {/* Progresso Médio */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-500 bg-opacity-10 rounded-lg p-3">
                  <FaGraduationCap className="text-orange-500 text-2xl" />
                </div>
                <FaChartLine className="text-gray-400 text-sm" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Progresso Médio</h3>
              <p className="text-3xl font-bold text-gray-900">
                {courses.length > 0 
                  ? Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length)
                  : 0}%
              </p>
            </div>
          </div>
        )}

        {/* Grid de Cursos */}
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
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Meus Cursos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/dashboard/${course.slug}`)}
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
          </>
        )}
      </div>
    </div>
  );
}

