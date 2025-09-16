'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
  createdAt: string;
  updatedAt: string;
}

export default function NoticiasAdmin() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('todas');

  useEffect(() => {
    // Simular carregamento de notícias
    const mockNoticias: Noticia[] = [
      {
        id: '1',
        title: 'ETPC abre inscrições para curso preparatório para concurso da Petrobrás 2023!',
        excerpt: 'A ETPC abriu as inscrições para curso preparatório para o concurso da Petrobrás de 2023...',
        content: 'Conteúdo completo da notícia...',
        date: '14 FEV',
        category: 'Notícias',
        type: 'noticias',
        featured: true,
        published: true,
        createdAt: '2024-01-14T10:00:00Z',
        updatedAt: '2024-01-14T10:00:00Z'
      },
      {
        id: '2',
        title: 'ETPC abre inscrições para capacitação em Energia Solar On-Grid e NR35',
        excerpt: 'Estão abertas as inscrições para a capacitação preparatória...',
        content: 'Conteúdo completo da notícia...',
        date: '17 JAN',
        category: 'Notícias',
        type: 'noticias',
        featured: false,
        published: true,
        createdAt: '2024-01-17T10:00:00Z',
        updatedAt: '2024-01-17T10:00:00Z'
      }
    ];
    
    setTimeout(() => {
      setNoticias(mockNoticias);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredNoticias = noticias.filter(noticia => {
    const matchesSearch = noticia.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         noticia.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'todas' || noticia.type === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta notícia?')) {
      setNoticias(noticias.filter(noticia => noticia.id !== id));
    }
  };

  const handleToggleFeatured = async (id: string) => {
    setNoticias(noticias.map(noticia => 
      noticia.id === id 
        ? { ...noticia, featured: !noticia.featured }
        : noticia
    ));
  };

  const handleTogglePublished = async (id: string) => {
    setNoticias(noticias.map(noticia => 
      noticia.id === id 
        ? { ...noticia, published: !noticia.published }
        : noticia
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Notícias</h1>
          <p className="text-gray-600">Gerencie todas as notícias do site</p>
        </div>
        <Link
          href="/admin/noticias/novo"
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Nova Notícia
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por título ou conteúdo..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todas">Todas as categorias</option>
              <option value="noticias">Notícias</option>
              <option value="blog">Blog</option>
              <option value="eventos">Eventos</option>
              <option value="matriculas">Matrículas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Noticias List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Notícias ({filteredNoticias.length})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredNoticias.map((noticia) => (
            <div key={noticia.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{noticia.title}</h3>
                    {noticia.featured && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        Destaque
                      </span>
                    )}
                    {!noticia.published && (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        Rascunho
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">{noticia.excerpt}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{noticia.date}</span>
                    <span>{noticia.category}</span>
                    <span>Criado em {new Date(noticia.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleToggleFeatured(noticia.id)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      noticia.featured 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {noticia.featured ? 'Remover Destaque' : 'Destacar'}
                  </button>
                  
                  <button
                    onClick={() => handleTogglePublished(noticia.id)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      noticia.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {noticia.published ? 'Despublicar' : 'Publicar'}
                  </button>
                  
                  <Link
                    href={`/admin/noticias/${noticia.id}/editar`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Editar
                  </Link>
                  
                  <button
                    onClick={() => handleDelete(noticia.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
