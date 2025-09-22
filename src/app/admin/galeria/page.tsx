'use client';

import { useState, useEffect } from 'react';
import { FaUpload, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import Image from 'next/image';
import { toast } from 'react-toastify';

interface GalleryPhoto {
  id: string;
  title: string;
  description?: string;
  image: string;
  category: string;
  order: number;
  active: boolean;
  createdAt: string;
}

export default function GaleriaAdmin() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [category, setCategory] = useState('geral');
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch('/api/gallery');
      const data = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('files', selectedFiles[i]);
      }
      formData.append('category', category);

      const response = await fetch('/api/gallery/upload-multiple', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        setShowUploadModal(false);
        setSelectedFiles(null);
        fetchPhotos();
      } else {
        const error = await response.json();
        toast.error('Erro ao fazer upload: ' + error.error);
      }
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast.error('Erro ao fazer upload das fotos');
    } finally {
      setUploading(false);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: !currentActive }),
      });

      if (response.ok) {
        fetchPhotos();
      }
    } catch (error) {
      console.error('Error toggling photo status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta foto?')) return;

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPhotos();
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-etpc-blue"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-poppins font-bold text-gray-900">Galeria de Fotos</h1>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-etpc-blue text-white px-4 py-2 rounded-lg hover:bg-etpc-blue-dark transition-colors flex items-center gap-2 font-poppins"
        >
          <FaUpload />
          Adicionar Fotos
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-etpc-blue">{photos.length}</div>
          <div className="text-gray-600 font-poppins">Total de Fotos</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{photos.filter(p => p.active).length}</div>
          <div className="text-gray-600 font-poppins">Ativas</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-red-600">{photos.filter(p => !p.active).length}</div>
          <div className="text-gray-600 font-poppins">Inativas</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-etpc-gold">{new Set(photos.map(p => p.category)).size}</div>
          <div className="text-gray-600 font-poppins">Categorias</div>
        </div>
      </div>

      {/* Lista de Fotos */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-poppins font-semibold text-gray-900">Fotos da Galeria</h2>
        </div>
        
        {photos.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FaUpload className="text-4xl mx-auto mb-4 text-gray-300" />
            <p className="font-poppins">Nenhuma foto encontrada. Adicione fotos para começar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {photos.map((photo) => (
              <div key={photo.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-square">
                  <Image
                    src={photo.image}
                    alt={photo.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => handleToggleActive(photo.id, photo.active)}
                      className={`p-2 rounded-full ${
                        photo.active 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-500 text-white'
                      }`}
                      title={photo.active ? 'Desativar' : 'Ativar'}
                    >
                      {photo.active ? <FaEye /> : <FaEyeSlash />}
                    </button>
                    <button
                      onClick={() => handleDelete(photo.id)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      title="Deletar"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-poppins font-semibold text-gray-900 truncate">{photo.title}</h3>
                  <p className="text-sm text-gray-600 font-poppins capitalize">{photo.category}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      photo.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {photo.active ? 'Ativa' : 'Inativa'}
                    </span>
                    <span className="text-xs text-gray-500">
                      #{photo.order}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Upload */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-poppins font-bold text-gray-900 mb-4">
              Adicionar Fotos
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-etpc-blue focus:border-etpc-blue font-poppins"
              >
                <option value="geral">Geral</option>
                <option value="laboratorio">Laboratório</option>
                <option value="evento">Evento</option>
                <option value="formatura">Formatura</option>
                <option value="aula">Aula</option>
                <option value="projeto">Projeto</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                Selecionar Fotos (múltiplas)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-etpc-blue focus:border-etpc-blue"
              />
              {selectedFiles && (
                <p className="text-sm text-gray-600 mt-1 font-poppins">
                  {selectedFiles.length} arquivo(s) selecionado(s)
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleUpload}
                disabled={!selectedFiles || uploading}
                className="flex-1 bg-etpc-blue text-white px-4 py-2 rounded-lg hover:bg-etpc-blue-dark transition-colors disabled:opacity-50 font-poppins"
              >
                {uploading ? 'Enviando...' : 'Enviar Fotos'}
              </button>
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-poppins"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
