'use client';

import { useState, useEffect } from 'react';
import { FaStar, FaShoppingCart, FaClock, FaGraduationCap, FaCheck, FaFilter, FaCheckCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';

interface OnlineCourse {
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
  active: boolean;
  featured: boolean;
  whatYouWillLearn: string;
  requirements?: string;
  validityDays: number;
}

export default function CursosOnlinePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [courses, setCourses] = useState<OnlineCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<OnlineCourse[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (session?.user?.email) {
      fetchEnrolledCourses();
    }
  }, [session]);

  useEffect(() => {
    filterCourses();
  }, [selectedCategory, selectedLevel, courses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/online-courses?active=true');
      const data = await response.json();
      setCourses(data);
      setFilteredCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const response = await fetch(`/api/student/courses?email=${session?.user?.email}`);
      if (response.ok) {
        const enrolledCourses = await response.json();
        const courseIds = new Set(enrolledCourses.map((c: any) => c.id));
        setEnrolledCourseIds(courseIds);
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    }
  };

  const filterCourses = () => {
    let filtered = [...courses];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }

    setFilteredCourses(filtered);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleAddToCart = (course: OnlineCourse) => {
    // Verificar se o usuário já possui o curso
    if (enrolledCourseIds.has(course.id)) {
      return; // Não adicionar ao carrinho
    }

    addToCart({
      id: course.id,
      title: course.title,
      price: Number(course.price),
      discountPrice: course.discountPrice ? Number(course.discountPrice) : undefined,
      image: course.image,
      instructor: course.instructor
    });
  };

  const isEnrolled = (courseId: string) => {
    return enrolledCourseIds.has(courseId);
  };

  const formatValidityDays = (days: number) => {
    if (days >= 365) {
      const years = Math.floor(days / 365);
      return years === 1 ? '1 ano' : `${years} anos`;
    } else if (days >= 30) {
      const months = Math.floor(days / 30);
      return months === 1 ? '1 mês' : `${months} meses`;
    } else {
      return `${days} dias`;
    }
  };

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'programacao', label: 'Programação' },
    { value: 'design', label: 'Design' },
    { value: 'negocios', label: 'Negócios' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'tecnologia', label: 'Tecnologia' },
    { value: 'desenvolvimento-pessoal', label: 'Desenvolvimento Pessoal' }
  ];

  const levels = [
    { value: 'all', label: 'Todos os Níveis' },
    { value: 'iniciante', label: 'Iniciante' },
    { value: 'intermediario', label: 'Intermediário' },
    { value: 'avancado', label: 'Avançado' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="/cursos-online" />

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-r from-etpc-blue to-etpc-blue-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Cursos Online
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Aprenda no seu ritmo, onde e quando quiser. Cursos completos com certificado.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-600" />
              <span className="text-gray-700 font-medium">
                {filteredCourses.length} {filteredCourses.length === 1 ? 'curso encontrado' : 'cursos encontrados'}
              </span>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center gap-2 bg-etpc-blue text-white px-4 py-2 rounded-lg hover:bg-etpc-blue-dark transition-colors"
            >
              <FaFilter />
              Filtros
            </button>

            {/* Desktop Filters */}
            <div className="hidden md:flex items-center gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-etpc-blue bg-white text-gray-900 font-medium"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value} className="text-gray-900">{cat.label}</option>
                ))}
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-etpc-blue bg-white text-gray-900 font-medium"
              >
                {levels.map(level => (
                  <option key={level.value} value={level.value} className="text-gray-900">{level.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="md:hidden mt-4 flex flex-col gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-etpc-blue bg-white text-gray-900 font-medium"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value} className="text-gray-900">{cat.label}</option>
                ))}
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-etpc-blue bg-white text-gray-900 font-medium"
              >
                {levels.map(level => (
                  <option key={level.value} value={level.value} className="text-gray-900">{level.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FaGraduationCap className="text-6xl mx-auto mb-4" />
                <p className="text-xl text-gray-600">Nenhum curso encontrado</p>
                <p className="text-gray-500 mt-2">Tente ajustar os filtros</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => {
                const price = course.discountPrice || course.price;
                const hasDiscount = course.discountPrice && course.discountPrice < course.price;

                return (
                  <div
                    key={course.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 group"
                  >
                    {/* Course Image */}
                    <div className="relative h-48 overflow-hidden">
                      {course.image ? (
                        <Image
                          src={course.image}
                          alt={course.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-etpc-blue to-etpc-blue-dark flex items-center justify-center">
                          <FaGraduationCap className="text-white text-6xl opacity-50" />
                        </div>
                      )}

                      {isEnrolled(course.id) && (
                        <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                          <FaCheckCircle />
                          Já Comprado
                        </div>
                      )}

                      {!isEnrolled(course.id) && course.featured && (
                        <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Destaque
                        </div>
                      )}

                      {hasDiscount && !isEnrolled(course.id) && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          -{Math.round((1 - Number(course.discountPrice!) / Number(course.price)) * 100)}%
                        </div>
                      )}
                    </div>

                    {/* Course Content */}
                    <div className="p-6">
                      {/* Category and Level */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-etpc-blue bg-blue-50 px-3 py-1 rounded-full">
                          {course.category}
                        </span>
                        <span className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                          {course.level}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-etpc-blue transition-colors">
                        {course.title}
                      </h3>

                      {/* Short Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {course.shortDescription}
                      </p>

                      {/* Instructor */}
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <FaGraduationCap className="mr-2" />
                        {course.instructor}
                      </div>

                      {/* Duration, Students and Validity */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <FaClock className="mr-1" />
                            {course.duration}
                          </div>
                          <div>
                            {course.totalStudents} alunos
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                          ⏳ Acesso por {formatValidityDays(course.validityDays)}
                        </div>
                      </div>

                      {/* Rating */}
                      {course.rating && (
                        <div className="flex items-center mb-4">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FaStar
                              key={i}
                              className={`${
                                i < Math.floor(Number(course.rating))
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            {Number(course.rating).toFixed(1)}
                          </span>
                        </div>
                      )}

                      {/* Price and CTA */}
                      <div className="pt-4 border-t space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            {hasDiscount && (
                              <div className="text-sm text-gray-400 line-through">
                                {formatPrice(Number(course.price))}
                              </div>
                            )}
                            <div className="text-2xl font-bold text-etpc-blue">
                              {formatPrice(Number(price))}
                            </div>
                          </div>

                          {isEnrolled(course.id) ? (
                            <button
                              onClick={() => router.push('/dashboard')}
                              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition-all transform hover:scale-105"
                            >
                              <FaCheckCircle />
                              Acessar Curso
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(course)}
                              disabled={isInCart(course.id)}
                              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                                isInCart(course.id)
                                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                  : 'bg-etpc-blue text-white hover:bg-etpc-blue-dark'
                              }`}
                            >
                              {isInCart(course.id) ? (
                                <>
                                  <FaCheck />
                                  Adicionado
                                </>
                              ) : (
                                <>
                                  <FaShoppingCart />
                                  Adicionar
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => setExpandedCourseId(expandedCourseId === course.id ? null : course.id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                          aria-label={`Ver detalhes do curso ${course.title}`}
                        >
                          {expandedCourseId === course.id ? (
                            <>
                              Ocultar detalhes
                              <FaChevronUp />
                            </>
                          ) : (
                            <>
                              Ver detalhes
                              <FaChevronDown />
                            </>
                          )}
                        </button>
                      </div>

                      {/* Área de Detalhes Expandida */}
                      {expandedCourseId === course.id && (
                        <div className="mt-6 pt-6 border-t border-gray-200 space-y-6 animate-fadeIn">
                          {/* O que você vai aprender */}
                          <div>
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <FaCheckCircle className="text-green-500" />
                              O que você vai aprender
                            </h4>
                            <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-700">
                              {(() => {
                                try {
                                  const items = typeof course.whatYouWillLearn === 'string'
                                    ? JSON.parse(course.whatYouWillLearn)
                                    : course.whatYouWillLearn;

                                  return Array.isArray(items) ? items.map((item: string, idx: number) => (
                                    <div key={idx} className="flex items-start gap-2">
                                      <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                                      <span>{item}</span>
                                    </div>
                                  )) : null;
                                } catch (e) {
                                  return <p className="text-gray-500">Informações não disponíveis</p>;
                                }
                              })()}
                            </div>
                          </div>

                          {/* Descrição Completa */}
                          <div>
                            <h4 className="font-bold text-gray-900 mb-3">Descrição do Curso</h4>
                            <div
                              className="text-sm text-gray-700 prose max-w-none"
                              dangerouslySetInnerHTML={{ __html: course.description }}
                            />
                          </div>

                          {/* Requisitos */}
                          {course.requirements && (
                            <div>
                              <h4 className="font-bold text-gray-900 mb-3">Requisitos</h4>
                              <p className="text-sm text-gray-700">{course.requirements}</p>
                            </div>
                          )}

                          {/* Informações Adicionais */}
                          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Nível</p>
                              <p className="text-sm font-semibold text-gray-900 capitalize">{course.level}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Categoria</p>
                              <p className="text-sm font-semibold text-gray-900 capitalize">{course.category}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Validade</p>
                              <p className="text-sm font-semibold text-gray-900">{course.validityDays} dias</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Alunos</p>
                              <p className="text-sm font-semibold text-gray-900">{course.totalStudents} matriculados</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
