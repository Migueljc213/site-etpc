'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaChartBar, FaNewspaper, FaImage, FaGraduationCap, FaUsers, FaCog, FaCamera, FaPhone } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
    } else if (status === 'unauthenticated') {
      // Se não estiver autenticado e não estiver na página de login, redirecionar
      if (pathname !== '/admin/login') {
        router.push('/admin/login');
      }
      setIsLoading(false);
    } else if (status === 'authenticated') {
      setIsLoading(false);
    }
  }, [status, pathname, router]);

  // Se estiver na página de login, não aplicar o layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-etpc-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, não mostrar nada (será redirecionado)
  if (!session) {
    return null;
  }

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: 'FaChartBar' },
    { name: 'Notícias', href: '/admin/noticias', icon: 'FaNewspaper' },
    { name: 'Banners', href: '/admin/banners', icon: 'FaImage' },
    { name: 'Galeria', href: '/admin/galeria', icon: 'FaCamera' },
    { name: 'Cursos', href: '/admin/cursos', icon: 'FaGraduationCap' },
    { name: 'Contatos', href: '/admin/contatos', icon: 'FaPhone' },
    { name: 'Usuários', href: '/admin/usuarios', icon: 'FaUsers' },
    { name: 'Configurações', href: '/admin/configuracoes', icon: 'FaCog' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link href="/admin" className="flex items-center">
            <div className="text-etpc-blue font-poppins font-bold text-2xl tracking-wide hover:scale-105 transition-transform cursor-pointer">
              <div className="relative">
                etpc
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-etpc-blue"></div>
              </div>
            </div>
            <span className="ml-2 text-sm font-medium text-gray-600">Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                <span className="mr-3 text-lg text-blue-600">
                  {item.icon === 'FaChartBar' && <FaChartBar />}
                  {item.icon === 'FaNewspaper' && <FaNewspaper />}
                  {item.icon === 'FaImage' && <FaImage />}
                  {item.icon === 'FaCamera' && <FaCamera />}
                  {item.icon === 'FaGraduationCap' && <FaGraduationCap />}
                  {item.icon === 'FaPhone' && <FaPhone />}
                  {item.icon === 'FaUsers' && <FaUsers />}
                  {item.icon === 'FaCog' && <FaCog />}
                </span>
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">Administrador</p>
              <p className="text-xs text-gray-500">admin@etpc.com.br</p>
            </div>
            <Link
              href="/admin/login"
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center space-x-4">
              <Link
                href="/"
                target="_blank"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Ver Site
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
      
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}