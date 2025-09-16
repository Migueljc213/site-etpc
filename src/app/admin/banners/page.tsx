'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
    // Simular carregamento de banners
    const mockBanners: Banner[] = [
      {
        id: '1',
        title: 'Banner Principal',
        description: 'Banner principal da homepage',
        image: '/api/placeholder/800/400',
        link: '/cursos-tecnicos',
        position: 'homepage-top',
        active: true,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z'
      },
      {
        id: '2',
        title: 'Promoção Cursos',
        description: 'Banner promocional para cursos técnicos',
        image: '/api/placeholder/800/400',
        link: '/matriculas',
        position: 'homepage-middle',
        active: true,
        startDate: '2024-01-15',
        endDate: '2024-03-15',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      }
    ];
    
    setTimeout(() => {
      setBanners(mockBanners);
      setLoading(false);
    }, 1000);
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este banner?')) {
      setBanners(banners.filter(banner => banner.id !== id));
    }
  };

  const handleToggleActive = async (id: string) => {
    setBanners(banners.map(banner => 
      banner.id === id 
        ? { ...banner, active: !banner.active }
        : banner
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
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Banners</h1>
          <p className="text-gray-600">Gerencie todos os banners do site</p>
        </div>
        <Link
          href="/admin/banners/novo"
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Novo Banner
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
            <div key={banner.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start space-x-4">
                {/* Image Preview */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Imagem</span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{banner.title}</h3>
                    {banner.active ? (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Ativo
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        Inativo
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-2">{banner.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Posição: {banner.position}</span>
                    <span>Link: {banner.link}</span>
                    <span>Período: {banner.startDate} - {banner.endDate}</span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleActive(banner.id)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      banner.active 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {banner.active ? 'Desativar' : 'Ativar'}
                  </button>
                  
                  <Link
                    href={`/admin/banners/${banner.id}/editar`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Editar
                  </Link>
                  
                  <button
                    onClick={() => handleDelete(banner.id)}
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
