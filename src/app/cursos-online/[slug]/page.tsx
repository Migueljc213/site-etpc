'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaClock, FaChartLine, FaCheckCircle, FaStar, FaShoppingCart, FaUser } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  image?: string;
  instructor: string;
  price: number;
  discountPrice?: number;
  duration: string;
  level: string;
  category: string;
  rating?: number;
  totalStudents: number;
  whatYouWillLearn: string[];
  requirements?: string;
  validityDays: number;
  modules: Array<{
    id: string;
    title: string;
    description?: string;
    lessons: Array<{
      id: string;
      title: string;
      duration: number;
    }>;
  }>;
}

export default function CursoOnlineDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchCourse();
    if (session?.user?.email) {
      checkEnrollment();
    }
  }, [params.slug, session]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/online-courses/by-slug/${params.slug}`);
      if (response.ok) {
        const data = await response.json();
        setCourse(data);
      } else {
        toast.error('Curso não encontrado');
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Erro ao carregar curso');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const response = await fetch('/api/student/enrollments');
      if (response.ok) {
        const enrollments = await response.json();
        const enrolled = enrollments.some((e: any) => e.course.slug === params.slug);
        setIsEnrolled(enrolled);
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!session) {
      toast.info('Faça login para adicionar ao carrinho');
      router.push('/login');
      return;
    }

    if (!course) return;

    setAddingToCart(true);
    try {
      // Buscar ou criar carrinho no localStorage
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');

      // Verificar se já está no carrinho
      const alreadyInCart = cart.some((item: any) => item.id === course.id);

      if (alreadyInCart) {
        toast.info('Curso já está no carrinho');
        router.push('/checkout');
        return;
      }

      // Adicionar ao carrinho
      cart.push({
        id: course.id,
        title: course.title,
        price: course.discountPrice || course.price,
        image: course.image
      });

      localStorage.setItem('cart', JSON.stringify(cart));
      toast.success('Curso adicionado ao carrinho!');
      router.push('/checkout');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Erro ao adicionar ao carrinho');
    } finally {
      setAddingToCart(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getTotalLessons = () => {
    if (!course?.modules) return 0;
    return course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-etpc-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando curso...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Curso não encontrado</h1>
          <Link href="/cursos-online" className="text-etpc-blue hover:underline">
            Voltar para Cursos Online
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-etpc-blue to-etpc-blue-dark text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/cursos-online" className="text-white/80 hover:text-white mb-4 inline-block">
              ← Voltar para Cursos Online
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
            <p className="text-xl text-white/90 mb-6">{course.shortDescription}</p>

            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <FaUser />
                <span>{course.instructor}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaChartLine />
                <span className="capitalize">{course.level}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-400" />
                <span>{course.rating?.toFixed(1) || 'Novo'}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaUser />
                <span>{course.totalStudents} alunos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Course Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">O que você vai aprender</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {course.whatYouWillLearn.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Descrição</h2>
              <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: course.description }} />
            </div>

            {/* Requirements */}
            {course.requirements && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Requisitos</h2>
                <p className="text-gray-700">{course.requirements}</p>
              </div>
            )}

            {/* Course Content */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Conteúdo do Curso</h2>
              <p className="text-gray-600 mb-4">
                {course.modules.length} módulos • {getTotalLessons()} aulas
              </p>
              <div className="space-y-4">
                {course.modules.map((module, index) => (
                  <div key={module.id} className="border border-gray-200 rounded-lg">
                    <div className="p-4 bg-gray-50">
                      <h3 className="font-bold text-gray-900">
                        Módulo {index + 1}: {module.title}
                      </h3>
                      {module.description && (
                        <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-2">
                        {module.lessons.length} aulas
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Purchase Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              {course.image && (
                <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  {course.discountPrice ? (
                    <>
                      <span className="text-4xl font-bold text-etpc-blue">
                        {formatPrice(course.discountPrice)}
                      </span>
                      <span className="text-xl text-gray-400 line-through">
                        {formatPrice(course.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold text-etpc-blue">
                      {formatPrice(course.price)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Acesso por {course.validityDays} dias
                </p>
              </div>

              {isEnrolled ? (
                <Link
                  href={`/dashboard/${course.slug}`}
                  className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 mb-4"
                >
                  <FaCheckCircle />
                  Acessar Curso
                </Link>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="w-full bg-etpc-blue text-white py-4 px-6 rounded-lg font-bold hover:bg-etpc-blue-dark transition-colors flex items-center justify-center gap-2 mb-4 disabled:opacity-50"
                >
                  <FaShoppingCart />
                  {addingToCart ? 'Adicionando...' : 'Adicionar ao Carrinho'}
                </button>
              )}

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  <span>Certificado de conclusão</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  <span>Acesso vitalício ao conteúdo</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  <span>Suporte do instrutor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
