'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaGraduationCap, FaBookOpen, FaChartBar, FaSignOutAlt, FaUser, FaHome } from 'react-icons/fa';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-etpc-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-800">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold text-white">ETPC Dashboard</h1>
          ) : (
            <FaGraduationCap className="text-2xl text-white" />
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-4 space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FaBookOpen />
              {sidebarOpen && <span>Meus Cursos</span>}
            </Link>
            <Link
              href="/dashboard/stats"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FaChartBar />
              {sidebarOpen && <span>Estatísticas</span>}
            </Link>
          </div>
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-etpc-blue flex items-center justify-center text-white font-bold">
              {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="text-sm font-semibold">{session?.user?.name}</p>
                <p className="text-xs text-gray-400">{session?.user?.email}</p>
              </div>
            )}
          </div>
          
          {sidebarOpen && (
            <>
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors mb-2 text-sm"
              >
                <FaHome />
                Voltar ao Site
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
              >
                <FaSignOutAlt />
                Sair
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Olá, <span className="font-semibold text-gray-900">{session?.user?.name?.split(' ')[0]}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

