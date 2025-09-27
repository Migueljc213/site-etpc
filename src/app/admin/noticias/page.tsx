'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaSearch, FaFilter, FaStar, FaEye, FaEyeSlash, FaEdit, FaTrash, FaCalendarAlt, FaTag, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface Noticia {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  author: string;
  featured: boolean;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  tags: Array<{
    tag: {
      id: string;
      name: string;
    };
  }>;
}

export default function NoticiasAdmin() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('todas');

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/news');
        const data = await response.json();
        
        if (response.ok) {
          setNoticias(data.news);
        } else {
          console.error('Error fetching news:', data.error);
          toast.error('Erro ao carregar notícias');
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        toast.error('Erro ao carregar notícias');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNoticias();
  }, []);

  const filteredNoticias = noticias.filter(noticia => {
    const matchesSearch = noticia.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         noticia.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'todas' || noticia.category.slug === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta notícia?')) {
      try {
        const response = await fetch(`/api/news/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setNoticias(noticias.filter(noticia => noticia.id !== id));
          toast.success('Notícia excluída com sucesso!');
        } else {
          toast.error('Erro ao excluir notícia');
        }
      } catch (error) {
        console.error('Error deleting news:', error);
        toast.error('Erro ao excluir notícia');
      }
    }
  };

  const handleToggleFeatured = async (id: string) => {
    const noticia = noticias.find(n => n.id === id);
    if (!noticia) return;
    
    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...noticia,
          featured: !noticia.featured,
        }),
      });
      
      if (response.ok) {
        setNoticias(noticias.map(n => 
          n.id === id 
            ? { ...n, featured: !n.featured }
            : n
        ));
        toast.success('Status de destaque atualizado!');
      } else {
        toast.error('Erro ao atualizar destaque');
      }
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast.error('Erro ao atualizar destaque');
    }
  };

  const handleTogglePublished = async (id: string) => {
    const noticia = noticias.find(n => n.id === id);
    if (!noticia) return;
    
    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...noticia,
          published: !noticia.published,
          publishedAt: !noticia.published ? new Date().toISOString() : null,
        }),
      });
      
      if (response.ok) {
        setNoticias(noticias.map(n => 
          n.id === id 
            ? { ...n, published: !n.published, publishedAt: !n.published ? new Date().toISOString() : null }
            : n
        ));
        toast.success('Status de publicação atualizado!');
      } else {
        toast.error('Erro ao atualizar publicação');
      }
    } catch (error) {
      console.error('Error updating published status:', error);
      toast.error('Erro ao atualizar publicação');
    }
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
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
        >
          <FaPlus className="text-sm" />
          Nova Notícia
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaSearch className="text-blue-600" />
              Buscar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por título ou conteúdo..."
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaTag className="text-blue-600" />
              Categoria
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input-field"
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
            <div key={noticia.id} className="p-6 hover:bg-blue-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{noticia.title}</h3>
                    {noticia.featured && (
                      <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                        <FaStar className="text-xs" />
                        Destaque
                      </span>
                    )}
                    {!noticia.published && (
                      <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                        <FaClock className="text-xs" />
                        Rascunho
                      </span>
                    )}
                    {noticia.published && (
                      <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                        <FaEye className="text-xs" />
                        Publicado
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3 leading-relaxed">{noticia.excerpt}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt className="text-blue-600" />
                      {noticia.publishedAt ? new Date(noticia.publishedAt).toLocaleDateString('pt-BR') : 'Não publicado'}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaTag className="text-blue-600" />
                      {noticia.category.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock className="text-blue-600" />
                      {new Date(noticia.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-6">
                  <button
                    onClick={() => handleToggleFeatured(noticia.id)}
                    className={`px-4 py-2 text-sm rounded-lg transition-all transform hover:scale-105 flex items-center gap-2 ${
                      noticia.featured 
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    title={noticia.featured ? 'Remover Destaque' : 'Destacar'}
                  >
                    <FaStar className="text-sm" />
                    {noticia.featured ? 'Remover Destaque' : 'Destacar'}
                  </button>
                  
                  <button
                    onClick={() => handleTogglePublished(noticia.id)}
                    className={`px-4 py-2 text-sm rounded-lg transition-all transform hover:scale-105 flex items-center gap-2 ${
                      noticia.published 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                    title={noticia.published ? 'Despublicar' : 'Publicar'}
                  >
                    {noticia.published ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                    {noticia.published ? 'Despublicar' : 'Publicar'}
                  </button>
                  
                  <Link
                    href={`/admin/noticias/${noticia.id}/editar`}
                    className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm rounded-lg transition-all transform hover:scale-105 flex items-center gap-2"
                    title="Editar notícia"
                  >
                    <FaEdit className="text-sm" />
                    Editar
                  </Link>
                  
                  <button
                    onClick={() => handleDelete(noticia.id)}
                    className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 text-sm rounded-lg transition-all transform hover:scale-105 flex items-center gap-2"
                    title="Excluir notícia"
                  >
                    <FaTrash className="text-sm" />
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
