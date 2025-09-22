'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaPlay, FaBroadcastTower, FaFileAlt, FaGraduationCap, FaUsers, FaBookOpen } from 'react-icons/fa';

interface Banner {
  id: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
  active: boolean;
}

interface BannerCarouselProps {
  banners: Banner[];
  autoPlay?: boolean;
  interval?: number;
}

export default function BannerCarousel({ 
  banners, 
  autoPlay = true, 
  interval = 5000 
}: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Filtrar apenas banners ativos
  const activeBanners = banners.filter(banner => banner.active);

  useEffect(() => {
    if (!autoPlay || activeBanners.length <= 1) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === activeBanners.length - 1 ? 0 : prevIndex + 1
        );
        setIsTransitioning(false);
      }, 300);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, activeBanners.length]);

  const goToSlide = (index: number) => {
    if (index === currentIndex || isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 150);
  };

  const goToPrevious = () => {
    if (isTransitioning) return;
    goToSlide(currentIndex === 0 ? activeBanners.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    goToSlide(currentIndex === activeBanners.length - 1 ? 0 : currentIndex + 1);
  };

  // Cards de serviços
  const serviceCards = [
    {
      icon: FaPlay,
      title: "Sala Web",
      description: "Confira em vídeos todos nossos recursos tecnológicos.",
      color: "from-slate-800 to-slate-900",
      iconColor: "text-white"
    },
    {
      icon: FaBroadcastTower,
      title: "Web Canal",
      description: "Eventos ao vivo para alunos, professores e famílias.",
      color: "from-slate-700 to-slate-800",
      iconColor: "text-white"
    },
    {
      icon: FaFileAlt,
      title: "Regulamentos",
      description: "Baixe nossa lista de materiais, normas e regimentos.",
      color: "from-slate-800 to-slate-900",
      iconColor: "text-white"
    }
  ];

  if (activeBanners.length === 0) {
    return (
      <div className="relative w-full h-screen bg-gradient-to-r from-slate-800 to-slate-900">
        {/* Conteúdo principal */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">QUALIDADE DE ENSINO</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">Excelência em educação técnica</p>
            
            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/matriculas" className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-slate-700 hover:to-slate-800 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl">
                Comece sua jornada
              </a>
              <a href="/cursos-tecnicos" className="bg-white text-slate-800 px-8 py-4 rounded-full text-lg font-semibold border-2 border-slate-800 hover:bg-slate-50 transition-all hover:shadow-lg">
                Conheça os cursos
              </a>
            </div>
          </div>
        </div>

        {/* Cards de serviços */}
        <div className="absolute bottom-8 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {serviceCards.map((card, index) => (
                <div key={index} className={`bg-gradient-to-r ${card.color} p-6 rounded-lg shadow-xl hover:scale-105 transition-transform duration-300`}>
                  <div className="flex items-center space-x-4">
                    <card.icon className={`text-2xl ${card.iconColor}`} />
                    <div>
                      <h3 className="text-white font-bold text-lg">{card.title}</h3>
                      <p className="text-white/90 text-sm">{card.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeBanners.length === 1) {
    const banner = activeBanners[0];
    return (
      <div className="relative w-full h-screen overflow-hidden">
        <Image
          src={banner.image}
          alt={banner.title}
          fill
          className="object-cover"
          priority
        />

        {/* Overlay escuro */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Conteúdo principal */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white px-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-2xl">
              {banner.title}
            </h1>
            {banner.description && (
              <p className="text-xl md:text-2xl text-white/90 drop-shadow-lg mb-8">
                {banner.description}
              </p>
            )}
            
            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/matriculas" className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-slate-700 hover:to-slate-800 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl">
                Comece sua jornada
              </a>
              <a href="/cursos-tecnicos" className="bg-white text-slate-800 px-8 py-4 rounded-full text-lg font-semibold border-2 border-slate-800 hover:bg-slate-50 transition-all hover:shadow-lg">
                Conheça os cursos
              </a>
            </div>
          </div>
        </div>

        {/* Cards de serviços */}
        <div className="absolute bottom-8 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {serviceCards.map((card, index) => (
                <div key={index} className={`bg-gradient-to-r ${card.color} p-6 rounded-lg shadow-xl hover:scale-105 transition-transform duration-300`}>
                  <div className="flex items-center space-x-4">
                    <card.icon className={`text-2xl ${card.iconColor}`} />
                    <div>
                      <h3 className="text-white font-bold text-lg">{card.title}</h3>
                      <p className="text-white/90 text-sm">{card.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden group">
      {/* Banner atual */}
      <div className="relative w-full h-full">
        <Image
          src={activeBanners[currentIndex].image}
          alt={activeBanners[currentIndex].title}
          fill
          className={`object-cover transition-all duration-500 ${
            isTransitioning ? 'scale-105 opacity-80' : 'scale-100 opacity-100'
          }`}
          priority={currentIndex === 0}
        />

        {/* Overlay escuro */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Conteúdo principal */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white px-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-2xl transition-all duration-500">
              {activeBanners[currentIndex].title}
            </h1>
            {activeBanners[currentIndex].description && (
              <p className="text-xl md:text-2xl text-white/90 drop-shadow-lg transition-all duration-500 mb-8">
                {activeBanners[currentIndex].description}
              </p>
            )}
            
            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/matriculas" className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-slate-700 hover:to-slate-800 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl">
                Comece sua jornada
              </a>
              <a href="/cursos-tecnicos" className="bg-white text-slate-800 px-8 py-4 rounded-full text-lg font-semibold border-2 border-slate-800 hover:bg-slate-50 transition-all hover:shadow-lg">
                Conheça os cursos
              </a>
            </div>
          </div>
        </div>

        {/* Botões de navegação */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100"
          aria-label="Banner anterior"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100"
          aria-label="Próximo banner"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Cards de serviços */}
      <div className="absolute bottom-8 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {serviceCards.map((card, index) => (
              <div key={index} className={`bg-gradient-to-r ${card.color} p-6 rounded-lg shadow-xl hover:scale-105 transition-transform duration-300`}>
                <div className="flex items-center space-x-4">
                  <card.icon className={`text-2xl ${card.iconColor}`} />
                  <div>
                    <h3 className="text-white font-bold text-lg">{card.title}</h3>
                    <p className="text-white/90 text-sm">{card.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {activeBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Ir para banner ${index + 1}`}
          />
        ))}
      </div>

      {/* Barra de progresso */}
      {autoPlay && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20 z-20">
          <div 
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{
              width: isTransitioning ? '100%' : '0%',
              transitionDuration: isTransitioning ? '300ms' : `${interval}ms`
            }}
          />
        </div>
      )}
    </div>
  );
}

