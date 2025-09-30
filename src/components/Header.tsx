'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaChevronDown } from 'react-icons/fa';

interface HeaderProps {
  currentPage?: string;
}

export default function Header({ currentPage }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileExtracurricularOpen, setMobileExtracurricularOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return currentPage === path;
  };

  return (
    <nav className={`fixed top-0 w-full transition-all duration-300 ${scrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-2xl py-2' : 'bg-slate-900/90 backdrop-blur-md py-3'} h-16 z-50`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-10">
          <div className="flex items-center">
            <Link href="/" className="text-white font-poppins font-bold text-2xl tracking-wide hover:scale-105 transition-transform cursor-pointer py-2">
              <div className="relative">
                <span className="block">etpc</span>
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white"></div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link href="/quem-somos" className={`text-white/90 hover:text-white transition-all duration-300 font-poppins text-sm relative group ${isActive('/quem-somos') ? 'text-white' : ''}`}>
              Quem Somos
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-white/60 transition-all duration-300 group-hover:w-full ${isActive('/quem-somos') ? 'w-full bg-white' : 'group-hover:bg-white'}`}></span>
            </Link>
            <Link href="/fundamental2" className={`text-white/90 hover:text-white transition-all duration-300 font-poppins text-sm relative group ${isActive('/fundamental2') ? 'text-white' : ''}`}>
              Fundamental 2
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-white/60 transition-all duration-300 group-hover:w-full ${isActive('/fundamental2') ? 'w-full bg-white' : 'group-hover:bg-white'}`}></span>
            </Link>
            <Link href="/ensinomedio" className={`text-white/90 hover:text-white transition-all duration-300 font-poppins text-sm relative group ${isActive('/ensinomedio') ? 'text-white' : ''}`}>
              Ensino Médio
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-white/60 transition-all duration-300 group-hover:w-full ${isActive('/ensinomedio') ? 'w-full bg-white' : 'group-hover:bg-white'}`}></span>
            </Link>
            <Link href="/cursos-tecnicos" className={`text-white/90 hover:text-white transition-all duration-300 font-poppins text-sm relative group ${isActive('/cursos-tecnicos') ? 'text-white' : ''}`}>
              Cursos Técnicos
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-white/60 transition-all duration-300 group-hover:w-full ${isActive('/cursos-tecnicos') ? 'w-full bg-white' : 'group-hover:bg-white'}`}></span>
            </Link>
            <div className="relative group">
              <button className={`text-white/90 hover:text-white transition-all duration-300 font-poppins text-sm relative group-hover:text-white focus:outline-none py-2 ${isActive('/cursos-rapidos') || isActive('/cursos-teen') ? 'text-white' : ''}`}>
                Extracurriculares
                <FaChevronDown className="ml-1 inline-block transition-transform duration-300 group-hover:rotate-180" />
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-white/60 transition-all duration-300 group-hover:w-full ${isActive('/cursos-rapidos') || isActive('/cursos-teen') ? 'w-full bg-white' : 'group-hover:bg-white'}`}></span>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100 z-20">
                <Link href="/cursos-rapidos" className={`block px-4 py-2 text-sm hover:bg-slate-700 hover:text-white ${isActive('/cursos-rapidos') ? 'bg-slate-700 text-white' : 'text-white/90'}`}>
                  Cursos Rápidos
                </Link>
                <Link href="/cursos-teen" className={`block px-4 py-2 text-sm hover:bg-slate-700 hover:text-white ${isActive('/cursos-teen') ? 'bg-slate-700 text-white' : 'text-white/90'}`}>
                  Cursos Teen
                </Link>
              </div>
            </div>
            <Link href="/in-company" className={`text-white/90 hover:text-white transition-all duration-300 font-poppins text-sm relative group ${isActive('/in-company') ? 'text-white' : ''}`}>
              In Company
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-white/60 transition-all duration-300 group-hover:w-full ${isActive('/in-company') ? 'w-full bg-white' : 'group-hover:bg-white'}`}></span>
            </Link>
            <Link href="/matriculas" className={`text-white/90 hover:text-white transition-all duration-300 font-poppins text-sm relative group ${isActive('/matriculas') ? 'text-white' : ''}`}>
              Matrículas
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-white/60 transition-all duration-300 group-hover:w-full ${isActive('/matriculas') ? 'w-full bg-white' : 'group-hover:bg-white'}`}></span>
            </Link>
            <Link href="/noticias" className={`text-white/90 hover:text-white transition-all duration-300 font-poppins text-sm relative group ${isActive('/noticias') ? 'text-white' : ''}`}>
              Notícias
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-white/60 transition-all duration-300 group-hover:w-full ${isActive('/noticias') ? 'w-full bg-white' : 'group-hover:bg-white'}`}></span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-white/90 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-white/10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`fixed top-16 left-0 right-0 lg:hidden bg-slate-900/98 backdrop-blur-md border-t border-white/20 shadow-2xl z-40 max-h-[calc(100vh-4rem)] overflow-y-auto transition-all duration-300 ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
            <div className="px-4 pt-4 pb-6 space-y-1">
              <Link href="/quem-somos" className={`block px-3 py-2 rounded-lg transition-all duration-300 ${isActive('/quem-somos') ? 'text-white bg-white/10' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>
                Quem Somos
              </Link>
              <Link href="/fundamental2" className={`block px-3 py-2 rounded-lg transition-all duration-300 ${isActive('/fundamental2') ? 'text-white bg-white/10' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>
                Fundamental 2
              </Link>
              <Link href="/ensinomedio" className={`block px-3 py-2 rounded-lg transition-all duration-300 ${isActive('/ensinomedio') ? 'text-white bg-white/10' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>
                Ensino Médio
              </Link>
              <Link href="/cursos-tecnicos" className={`block px-3 py-2 rounded-lg transition-all duration-300 ${isActive('/cursos-tecnicos') ? 'text-white bg-white/10' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>
                Cursos Técnicos
              </Link>
              <div className="w-full">
                <button
                  onClick={() => setMobileExtracurricularOpen(!mobileExtracurricularOpen)}
                  className={`flex justify-between items-center w-full px-3 py-2 rounded-lg transition-all duration-300 ${isActive('/cursos-rapidos') || isActive('/cursos-teen') ? 'text-white bg-white/10' : 'text-white/90 hover:text-white hover:bg-white/10'}`}
                >
                  Extracurriculares
                  <FaChevronDown className={`ml-1 transition-transform duration-300 ${mobileExtracurricularOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileExtracurricularOpen && (
                  <div className="flex flex-col items-center space-y-2 mt-2 bg-slate-800/80 rounded-lg py-2">
                    <Link href="/cursos-rapidos" className={`block w-full text-center px-3 py-2 rounded-lg transition-all duration-300 ${isActive('/cursos-rapidos') ? 'text-white bg-white/10' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>
                      Cursos Rápidos
                    </Link>
                    <Link href="/cursos-teen" className={`block w-full text-center px-3 py-2 rounded-lg transition-all duration-300 ${isActive('/cursos-teen') ? 'text-white bg-white/10' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>
                      Cursos Teen
                    </Link>
                  </div>
                )}
              </div>
              <Link href="/in-company" className={`block px-3 py-2 rounded-lg transition-all duration-300 ${isActive('/in-company') ? 'text-white bg-white/10' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>
                In Company
              </Link>
              <Link href="/matriculas" className={`block px-3 py-2 rounded-lg transition-all duration-300 ${isActive('/matriculas') ? 'text-white bg-white/10' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>
                Matrículas
              </Link>
              <Link href="/noticias" className={`block px-3 py-2 rounded-lg transition-all duration-300 ${isActive('/noticias') ? 'text-white bg-white/10' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>
                Notícias
              </Link>
            </div>
          </div>
      </div>
    </nav>
  );
}
