'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaSave, FaImage, FaLink, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  position: string;
  order: number;
  active: boolean;
  startDate: string;
  endDate: string;
}

export default function EditarBanner() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
    position: 'homepage-carousel',
    order: 0,
    active: true,
    startDate: '',
    endDate: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    fetchBanner();
  }, [params.id]);

  const fetchBanner = async () => {
    try {
      setLoadingData(true);
      const response = await fetch(`/api/banners/${params.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setFormData({
          title: data.title || '',
          description: data.description || '',
          image: data.image || '',
          link: data.link || '',
          position: data.position || 'homepage-carousel',
          order: data.order || 0,
          active: data.active ?? true,
          startDate: data.startDate ? data.startDate.split('T')[0] : '',
          endDate: data.endDate ? data.endDate.split('T')[0] : ''
        });
      } else {
        toast.error('Erro ao carregar banner');
        router.push('/admin/banners');
      }
    } catch (error) {
      console.error('Erro ao carregar banner:', error);
      toast.error('Erro ao carregar banner');
      router.push('/admin/banners');
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
        uploadData.append('type', 'banner');

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

      const response = await fetch(`/api/banners/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          image: imagePath
        }),
      });

      if (response.ok) {
        toast.success('Banner atualizado com sucesso!');
        router.push('/admin/banners');
      } else {
        const error = await response.json();
        toast.error(`Erro ao atualizar banner: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating banner:', error);
      toast.error('Erro ao atualizar banner');
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
            href="/admin/banners"
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FaArrowLeft className="text-xl" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Banner</h1>
            <p className="text-gray-600">Editar banner existente</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                placeholder="Título do banner"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-600" />
                Posição
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="homepage-carousel">Homepage - Carrossel</option>
                <option value="homepage-top">Homepage - Topo</option>
                <option value="homepage-middle">Homepage - Meio</option>
                <option value="sidebar">Sidebar</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Descrição do banner"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaImage className="text-blue-600" />
              Imagem do Banner *
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
                  placeholder="/images/banners/banner-1.jpg ou https://exemplo.com/imagem.jpg"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaLink className="text-blue-600" />
                Link de Destino
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                className="input-field"
                placeholder="/cursos-tecnicos"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordem
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleInputChange}
                className="input-field"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaCalendarAlt className="text-blue-600" />
                Data de Início
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaCalendarAlt className="text-blue-600" />
                Data de Fim
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="active"
              id="active"
              checked={formData.active}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
              Banner ativo
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Link
              href="/admin/banners"
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
            >
              <FaSave className="text-sm" />
              {loading ? 'Salvando...' : 'Atualizar Banner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
