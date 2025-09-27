'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaSave, FaImage, FaNewspaper, FaCalendarAlt, FaTag } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function EditarNoticia() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    author: 'ETPC',
    category: 'noticias',
    featured: false,
    published: false,
    date: new Date().toISOString().split('T')[0]
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    fetchNoticia();
  }, [params.id]);

  const fetchNoticia = async () => {
    try {
      setLoadingData(true);
      const response = await fetch(`/api/news/${params.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setFormData({
          title: data.title || '',
          excerpt: data.excerpt || '',
          content: data.content || '',
          image: data.image || '',
          author: data.author || 'ETPC',
          category: data.category?.slug || 'noticias',
          featured: data.featured || false,
          published: data.published || false,
          date: data.publishedAt ? data.publishedAt.split('T')[0] : new Date().toISOString().split('T')[0]
        });
      } else {
        toast.error('Erro ao carregar notícia');
        router.push('/admin/noticias');
      }
    } catch (error) {
      console.error('Erro ao carregar notícia:', error);
      toast.error('Erro ao carregar notícia');
      router.push('/admin/noticias');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imagePath = formData.image;

      // Se há um arquivo de imagem, fazer upload primeiro
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);
        uploadData.append('type', 'news');

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          imagePath = uploadResult.path;
        } else {
          toast.error('Erro ao fazer upload da imagem');
          setLoading(false);
          return;
        }
      }

      const response = await fetch(`/api/news/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          image: imagePath,
          categoryId: 'cmfrf39r90003i51wvvo84apg'
        }),
      });

      if (response.ok) {
        toast.success('Notícia atualizada com sucesso!');
        router.push('/admin/noticias');
      } else {
        const error = await response.json();
        toast.error(`Erro ao atualizar notícia: ${error.error}`);
      }
    } catch (error) {
      console.error('Erro ao atualizar notícia:', error);
      toast.error('Erro ao atualizar notícia');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/noticias"
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FaArrowLeft className="text-xl" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FaNewspaper className="text-blue-600" />
              Editar Notícia
            </h1>
            <p className="text-gray-600">Editar notícia existente</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Digite o título da notícia"
                />
              </div>

              {/* Imagem */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaImage className="text-blue-600" />
                  Imagem da Notícia *
                </label>
                <div className="space-y-4">
                  {/* Upload de arquivo */}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      Selecione uma nova imagem (JPG, PNG, WebP) - máximo 5MB
                    </p>
                  </div>
                  
                  {/* Ou URL manual */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Ou digite a URL da imagem:</label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="/images/noticias/imagem.jpg ou https://exemplo.com/imagem.jpg"
                    />
                  </div>

                  {/* Preview da imagem */}
                  {(imagePreview || formData.image) && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                      <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={imagePreview || formData.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Resumo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resumo *
                </label>
                <textarea
                  name="excerpt"
                  required
                  rows={3}
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Digite um resumo da notícia"
                />
              </div>

              {/* Conteúdo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conteúdo *
                </label>
                <textarea
                  name="content"
                  required
                  rows={10}
                  value={formData.content}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Digite o conteúdo completo da notícia"
                />
              </div>

              {/* Autor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Autor
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Nome do autor"
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Configurações */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FaTag className="text-blue-600" />
                      Categoria
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="noticias">Notícias</option>
                      <option value="blog">Blog</option>
                      <option value="eventos">Eventos</option>
                      <option value="matriculas">Matrículas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-600" />
                      Data
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Destacar notícia</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="published"
                        checked={formData.published}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Publicar</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 text-sm">
                    {formData.title || 'Título da notícia'}
                  </h4>
                  <p className="text-gray-600 text-xs">
                    {formData.excerpt || 'Resumo da notícia...'}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{formData.date}</span>
                    <span>{formData.category}</span>
                    {formData.featured && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        Destaque
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Link
              href="/admin/noticias"
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
            >
              <FaSave className="text-sm" />
              {loading ? 'Salvando...' : 'Atualizar Notícia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
