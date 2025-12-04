'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaUser, FaEye, FaEyeSlash, FaEdit, FaTrash, FaEnvelope, FaCalendarAlt, FaUserShield } from 'react-icons/fa';

interface Usuario {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      // Mock data por enquanto - depois conectar com API
      const mockUsuarios: Usuario[] = [
        {
          id: '1',
          name: 'Administrador ETPC',
          email: 'admin@etpc.com.br',
          role: 'admin',
          active: true,
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z'
        }
      ];
      
      setTimeout(() => {
        setUsuarios(mockUsuarios);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setLoading(false);
    }
  };

  const filteredUsuarios = usuarios.filter(usuario => 
    usuario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsuarios(usuarios.filter(usuario => usuario.id !== id));
    }
  };

  const handleToggleActive = async (id: string) => {
    setUsuarios(usuarios.map(usuario => 
      usuario.id === id 
        ? { ...usuario, active: !usuario.active }
        : usuario
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
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Usuários</h1>
          <p className="text-gray-600">Gerencie todos os usuários do sistema</p>
        </div>
        <Link
          href="/admin/usuarios/novo"
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
        >
          <FaPlus className="text-sm" />
          Novo Usuário
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <FaUser className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Buscar Usuários</h3>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nome ou email..."
          className="input-field"
        />
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Usuários ({filteredUsuarios.length})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredUsuarios.map((usuario) => (
            <div key={usuario.id} className="p-6 hover:bg-blue-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center border-2 border-blue-200">
                    <FaUser className="text-blue-600" />
                  </div>
                  
                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{usuario.name}</h3>
                      {usuario.active ? (
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
                      <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                        <FaUserShield className="text-xs" />
                        {usuario.role}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaEnvelope className="text-blue-600" />
                        {usuario.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="text-blue-600" />
                        Criado em {new Date(usuario.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleActive(usuario.id)}
                    className={`px-4 py-2 text-sm rounded-lg transition-all transform hover:scale-105 flex items-center gap-2 ${
                      usuario.active 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                    title={usuario.active ? 'Desativar usuário' : 'Ativar usuário'}
                  >
                    {usuario.active ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                    {usuario.active ? 'Desativar' : 'Ativar'}
                  </button>
                  
                  <Link
                    href={`/admin/usuarios/${usuario.id}/editar`}
                    className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm rounded-lg transition-all transform hover:scale-105 flex items-center gap-2"
                    title="Editar usuário"
                  >
                    <FaEdit className="text-sm" />
                    Editar
                  </Link>
                  
                  <button
                    onClick={() => handleDelete(usuario.id)}
                    className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 text-sm rounded-lg transition-all transform hover:scale-105 flex items-center gap-2"
                    title="Excluir usuário"
                    disabled={usuario.role === 'admin'}
                  >
                    <FaTrash className="text-sm" />
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredUsuarios.length === 0 && (
            <div className="p-12 text-center">
              <FaUser className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum usuário encontrado</h3>
              <p className="text-gray-500">Tente ajustar os filtros ou criar um novo usuário.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
