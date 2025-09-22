'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import NoticiaCard from '@/components/NoticiaCard';
import Footer from '@/components/Footer';
import { FaNewspaper } from 'react-icons/fa';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: {
    name: string;
    slug: string;
  };
  type: string;
  featured: boolean;
  published: boolean;
  author: string;
  image?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export default function Noticias() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [currentPage, setCurrentPage] = useState(1);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const newsPerPage = 6;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: newsPerPage.toString(),
        published: 'true',
        ...(selectedCategory !== 'todas' && { category: selectedCategory }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/news?${params}`);
      const data = await response.json();

      if (response.ok) {
        setNews(data.news);
        setTotalPages(data.pagination.pages);
      } else {
        console.error('Error fetching news:', data.error);
        // Fallback para dados mock em caso de erro
        setNews([]);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, searchTerm]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchNews();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const paginatedNews = news;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              ETPC
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors font-medium relative group">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-400 transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/quem-somos" className="text-gray-600 hover:text-gray-900 transition-colors font-medium relative group">
                Quem Somos
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-400 transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/fundamental2" className="text-gray-600 hover:text-gray-900 transition-colors font-medium relative group">
                Fundamental 2
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-400 transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/ensinomedio" className="text-gray-600 hover:text-gray-900 transition-colors font-medium relative group">
                Ensino Médio + Técnico
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-400 transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/cursos-tecnicos" className="text-gray-600 hover:text-gray-900 transition-colors font-medium relative group">
                Cursos Técnicos
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-400 transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/in-company" className="text-gray-600 hover:text-gray-900 transition-colors font-medium relative group">
                In Company
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-400 transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/matriculas" className="text-gray-600 hover:text-gray-900 transition-colors font-medium relative group">
                Matrículas
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-400 transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/noticias" className="text-gray-900 font-medium relative">
                Notícias
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-600"></span>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden bg-white border-t border-gray-200 transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link href="/" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">Home</Link>
            <Link href="/quem-somos" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">Quem Somos</Link>
            <Link href="/fundamental2" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">Fundamental 2</Link>
            <Link href="/ensinomedio" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">Ensino Médio + Técnico</Link>
            <Link href="/cursos-tecnicos" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">Cursos Técnicos</Link>
            <Link href="/in-company" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">In Company</Link>
            <Link href="/matriculas" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">Matrículas</Link>
            <Link href="/noticias" className="block px-3 py-2 text-gray-900 bg-gray-100 rounded-lg">Notícias</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-700 to-gray-800 py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6">
              Notícias ETPC
            </h1>
            <div className="w-24 h-1 bg-gray-400 mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Fique por dentro das últimas novidades, eventos e conquistas da ETPC
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Search and Filters */}
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Buscar notícias..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <select
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="todas">Todas as categorias</option>
                        <option value="noticias">Notícias</option>
                        <option value="blog">Blog</option>
                        <option value="eventos">Eventos</option>
                        <option value="matriculas">Matrículas</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Buscar
                  </button>
                </form>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              )}

              {/* News List */}
              {!loading && (
                <>
                  {/* Featured Article */}
                  {paginatedNews.length > 0 && paginatedNews[0]?.featured && (
                    <NoticiaCard article={paginatedNews[0]} featured={true} />
                  )}

                  {/* Regular Articles */}
                  <div className="space-y-8">
                    {paginatedNews.filter(article => !article.featured).map((article) => (
                      <NoticiaCard key={article.id} article={article} />
                    ))}
                  </div>

                  {/* No Results */}
                  {paginatedNews.length === 0 && !loading && (
                    <div className="text-center py-12">
                      <FaNewspaper className="text-6xl mb-4 text-gray-400 mx-auto" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma notícia encontrada</h3>
                      <p className="text-gray-600">Tente ajustar os filtros de busca.</p>
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex justify-center">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="px-4 py-2 border border-gray-600 text-gray-600 rounded-lg hover:bg-gray-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Anterior
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              currentPage === page
                                ? 'bg-gray-600 text-white'
                                : 'border border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 border border-gray-600 text-gray-600 rounded-lg hover:bg-gray-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Próxima
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Search */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Buscar</h3>
                  <form onSubmit={handleSearch} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Digite sua busca..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Buscar
                    </button>
                  </form>
                </div>

                {/* Categories */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorias</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleCategoryChange('todas')}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === 'todas'
                          ? 'bg-blue-100 text-blue-800'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Todas
                    </button>
                    <button
                      onClick={() => handleCategoryChange('noticias')}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === 'noticias'
                          ? 'bg-blue-100 text-blue-800'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Notícias
                    </button>
                    <button
                      onClick={() => handleCategoryChange('blog')}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === 'blog'
                          ? 'bg-blue-100 text-blue-800'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Blog
                    </button>
                    <button
                      onClick={() => handleCategoryChange('eventos')}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === 'eventos'
                          ? 'bg-blue-100 text-blue-800'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Eventos
                    </button>
                    <button
                      onClick={() => handleCategoryChange('matriculas')}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === 'matriculas'
                          ? 'bg-blue-100 text-blue-800'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Matrículas
                    </button>
                  </div>
                </div>

                {/* Archive */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Arquivo</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Agosto 2024</p>
                    <p>Julho 2024</p>
                    <p>Junho 2024</p>
                    <p>Maio 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}