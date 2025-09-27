'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Footer from '@/components/Footer';

interface Noticia {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  type: string;
  featured: boolean;
  published: boolean;
  image: string;
  author: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function NoticiaDetalhes() {
  const params = useParams();
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedNews, setRelatedNews] = useState<Noticia[]>([]);

  const fetchNoticia = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/news/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        setNoticia(data);
      } else {
        console.error('Error fetching news:', data.error);
        setNoticia(null);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setNoticia(null);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  const fetchRelatedNews = useCallback(async () => {
    try {
      const response = await fetch('/api/news?limit=3&published=true');
      const data = await response.json();

      if (response.ok) {
        setRelatedNews(data.news.filter((news: Noticia) => news.id !== params.id));
      }
    } catch (error) {
      console.error('Error fetching related news:', error);
    }
  }, [params.id]);

  useEffect(() => {
    fetchNoticia();
    fetchRelatedNews();
  }, [fetchNoticia, fetchRelatedNews]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando notícia...</p>
        </div>
      </div>
    );
  }

  if (!noticia) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Notícia não encontrada</h1>
          <Link href="/noticias" className="text-blue-600 hover:text-blue-800">
            ← Voltar para notícias
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              ETPC
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
              <Link href="/quem-somos" className="text-gray-700 hover:text-blue-600 transition-colors">Quem Somos</Link>
              <Link href="/cursos-tecnicos" className="text-gray-700 hover:text-blue-600 transition-colors">Cursos Técnicos</Link>
              <Link href="/noticias" className="text-gray-700 hover:text-blue-600 transition-colors">Notícias</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center space-x-2 text-sm text-gray-500">
                <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
                <li>/</li>
                <li><Link href="/noticias" className="hover:text-blue-600">Notícias</Link></li>
                <li>/</li>
                <li className="text-gray-900">{noticia.title}</li>
              </ol>
            </nav>

            {/* Article */}
            <article className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Featured Image */}
              {noticia.image ? (
                <div className="relative h-64 sm:h-80 lg:h-96">
                  <img
                    src={noticia.image}
                    alt={noticia.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4">
                        {noticia.title}
                      </h1>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative h-64 sm:h-80 lg:h-96 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900">
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4">
                        {noticia.title}
                      </h1>
                    </div>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute top-4 left-4 w-16 h-16 bg-yellow-400 rounded-full opacity-20"></div>
                  <div className="absolute bottom-4 right-4 w-12 h-12 bg-pink-400 rounded-full opacity-20"></div>
                  <div className="absolute top-1/2 right-8 w-8 h-8 bg-blue-400 transform rotate-45 opacity-20"></div>
                </div>
              )}

              {/* Article Meta */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-wrap items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {noticia.publishedAt ? new Date(noticia.publishedAt).toLocaleDateString('pt-BR') : 'Não publicado'}
                    </span>
                    <span className="text-red-600 font-medium">{typeof noticia.category === 'string' ? noticia.category : noticia.category.name}</span>
                    <span>Por {noticia.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Compartilhar:</span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                      </svg>
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Tags */}
                {noticia.tags && noticia.tags.length > 0 && (
                  <div className="flex flex-wrap items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">TAGS:</span>
                    {noticia.tags.map((tag, index) => (
                      <span key={index} className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                        {typeof tag === 'string' ? tag : tag.name}
                        {index < noticia.tags.length - 1 && ','}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Article Content */}
              <div className="p-6">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: noticia.content }}
                />
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Related News */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notícias Relacionadas</h3>
                <div className="space-y-4">
                  {relatedNews.map((news) => (
                    <Link key={news.id} href={`/noticia/${news.id}`} className="block group">
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          {news.image ? (
                            <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                              <img
                                src={news.image}
                                alt={news.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-500 text-xs">Imagem</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {news.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {news.publishedAt ? new Date(news.publishedAt).toLocaleDateString('pt-BR') : 'Não publicado'}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorias</h3>
                <div className="space-y-2">
                  <Link href="/noticias?categoria=noticias" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    + Notícias
                  </Link>
                  <Link href="/noticias?categoria=blog" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    + Blog
                  </Link>
                  <Link href="/noticias?categoria=eventos" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    + Eventos
                  </Link>
                  <Link href="/noticias?categoria=matriculas" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    + Matrículas
                  </Link>
                </div>
              </div>

              {/* Archive */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Arquivo</h3>
                <div className="text-sm text-gray-600">
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

      <Footer />
    </div>
  );
}
