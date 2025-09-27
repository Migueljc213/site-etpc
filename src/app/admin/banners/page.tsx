'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaImage, FaEye, FaEyeSlash, FaEdit, FaTrash, FaCalendarAlt, FaLink, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  position: string;
  active: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export default function BannersAdmin() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/banners');
      const data = await response.json();
      
      if (response.ok) {
        setBanners(data);
      } else {
        console.error('Erro ao buscar banners:', data.error);
      }
    } catch (error) {
      console.error('Erro ao buscar banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este banner?')) {
      try {
        const response = await fetch(`/api/banners/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setBanners(banners.filter(banner => banner.id !== id));
        } else {
          toast.error('Erro ao excluir banner');
        }
      } catch (error) {
        console.error('Erro ao excluir banner:', error);
        toast.error('Erro ao excluir banner');
      }
    }
  };

  const handleToggleActive = async (id: string) => {
    const banner = banners.find(b => b.id === id);
    if (!banner) return;

    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...banner,
          active: !banner.active
        }),
      });
      
      if (response.ok) {
        setBanners(banners.map(banner => 
          banner.id === id 
            ? { ...banner, active: !banner.active }
            : banner
        ));
      } else {
        toast.error('Erro ao atualizar banner');
      }
    } catch (error) {
      console.error('Erro ao atualizar banner:', error);
      toast.error('Erro ao atualizar banner');
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
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Banners</h1>
          <p className="text-gray-600">Gerencie todos os banners do site</p>
        </div>
        <Link
          href="/admin/banners/novo"
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
        >
          <FaPlus className="text-sm" />
          Novo Banner
        </Link>
      </div>

      {/* Banners List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Banners ({banners.length})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {banners.map((banner) => (
            <div key={banner.id} className="p-6 hover:bg-blue-50 transition-colors">
              <div className="flex items-start space-x-6">
                {/* Image Preview */}
                <div className="flex-shrink-0">
                  <div className="w-40 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center border-2 border-blue-200">
                    <FaImage className="text-blue-600 text-2xl" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{banner.title}</h3>
                    {banner.active ? (
                      <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                        <FaEye className="text-xs" />
                        Ativo
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                        <FaEyeSlash className="text-xs" />
                        Inativo
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-3 leading-relaxed">{banner.description}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FaMapMarkerAlt className="text-blue-600" />
                      {banner.position}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaLink className="text-blue-600" />
                      {banner.link}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt className="text-blue-600" />
                      {banner.startDate} - {banner.endDate}
                    </span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleActive(banner.id)}
                    className={`px-4 py-2 text-sm rounded-lg transition-all transform hover:scale-105 flex items-center gap-2 ${
                      banner.active 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                    title={banner.active ? 'Desativar banner' : 'Ativar banner'}
                  >
                    {banner.active ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                    {banner.active ? 'Desativar' : 'Ativar'}
                  </button>
                  
                  <Link
                    href={`/admin/banners/${banner.id}/editar`}
                    className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm rounded-lg transition-all transform hover:scale-105 flex items-center gap-2"
                    title="Editar banner"
                  >
                    <FaEdit className="text-sm" />
                    Editar
                  </Link>
                  
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 text-sm rounded-lg transition-all transform hover:scale-105 flex items-center gap-2"
                    title="Excluir banner"
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
