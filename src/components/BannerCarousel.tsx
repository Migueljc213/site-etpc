'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaGraduationCap } from 'react-icons/fa';

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

  if (activeBanners.length === 0) {
    return (
      <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 overflow-hidden">
        {/* Elementos decorativos fixos */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-48 translate-y-48"></div>
        
        {/* Elementos gráficos sutis */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 right-40 w-24 h-24 bg-yellow-300/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-yellow-500/20 rounded-full blur-lg"></div>
        
        {/* Layout principal - Texto à esquerda, imagem à direita */}
        <div className="relative z-10 h-full flex items-center justify-center pt-20 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Seção de texto à esquerda */}
              <div className="text-white space-y-6">
                <div className="space-y-3">
                  <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold font-poppins leading-tight">
                    Preparando Profissionais para o Mercado de Trabalho
                    <span className="block text-etpc-gold">Cursos técnicos</span>
                    <span className="block">que unem teoria e prática para impulsionar sua carreira com <span className="text-etpc-gold">qualidade</span> e <span className="text-etpc-gold">inovação</span>.</span>
                  </h1>
                  
                  <div className="flex items-center space-x-3 text-lg font-medium">
                    <span className="text-etpc-gold font-bold">ETPC</span>
                    <span>no ensino técnico.</span>
                  </div>
                </div>

                {/* Botão CTA */}
                <div className="pt-4">
                  <a 
                    href="/matriculas" 
                     className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105 shadow-2xl hover:shadow-yellow-400/25"
                  >
                    Comece sua jornada
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Seção de imagem à direita */}
              <div className="relative">
                <div className="relative w-full h-96 lg:h-[500px] xl:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-etpc-blue/20 to-etpc-gold/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <FaGraduationCap className="text-6xl text-white/80 mx-auto mb-4" />
                      <p className="text-lg font-medium">Imagem do estudante</p>
                      <p className="text-sm text-white/70">[Espaço para foto real]</p>
                    </div>
                  </div>
                </div>
                
                {/* Emblema no canto superior direito */}
                <div className="absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-etpc-blue to-etpc-gold rounded-full flex items-center justify-center">
                    <FaGraduationCap className="text-2xl text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeBanners.length === 1) {
    const banner = activeBanners[0];
    return (
      <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 overflow-hidden">
        {/* Elementos decorativos fixos */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-48 translate-y-48"></div>
        
        {/* Elementos gráficos sutis */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 right-40 w-24 h-24 bg-yellow-300/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-yellow-500/20 rounded-full blur-lg"></div>
        
        {/* Layout principal - Texto à esquerda, imagem à direita */}
        <div className="relative z-10 h-full flex items-center justify-center pt-20 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Seção de texto à esquerda */}
              <div className="text-white space-y-6">
                <div className="space-y-3">
                  <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold font-poppins leading-tight">
                    {banner.title}
                  </h1>
                  
                  {banner.description && (
                    <p className="text-lg text-white/90 leading-relaxed">
                      {banner.description}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-3 text-lg font-medium">
                    <span className="text-etpc-gold font-bold">ETPC</span>
                    <span>no ensino técnico.</span>
                  </div>
                </div>

                {/* Botão CTA */}
                <div className="pt-4">
                  <a 
                    href={banner.link || "/matriculas"} 
                     className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105 shadow-2xl hover:shadow-yellow-400/25"
                  >
                    Comece sua jornada
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Seção de imagem à direita */}
              <div className="relative">
                <div className="relative w-full h-96 lg:h-[500px] xl:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-etpc-blue/20 to-etpc-gold/20"></div>
                </div>
                
                {/* Emblema no canto superior direito */}
                <div className="absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-etpc-blue to-etpc-gold rounded-full flex items-center justify-center">
                    <FaGraduationCap className="text-2xl text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 overflow-hidden group">
      {/* Elementos decorativos fixos */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-48 translate-y-48"></div>
      
      {/* Layout principal - Texto à esquerda, imagem à direita */}
      <div className="relative z-10 h-full flex items-center pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Seção de texto à esquerda */}
            <div className="text-white space-y-6">
              <div className="space-y-3">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold font-poppins leading-tight transition-all duration-500">
                  {activeBanners[currentIndex].title}
                </h1>
                
                {activeBanners[currentIndex].description && (
                  <p className="text-lg text-white/90 leading-relaxed transition-all duration-500">
                    {activeBanners[currentIndex].description}
                  </p>
                )}
                
                <div className="flex items-center space-x-3 text-lg font-medium">
                  <span className="text-etpc-gold font-bold">ETPC</span>
                  <span>no ensino técnico.</span>
                </div>
              </div>

              {/* Botão CTA */}
              <div className="pt-4">
                <a 
                  href={activeBanners[currentIndex].link || "/matriculas"} 
                  className="inline-flex items-center bg-gradient-to-r from-etpc-gold to-etpc-gold-dark text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-etpc-gold-dark hover:to-etpc-gold transition-all transform hover:scale-105 shadow-2xl hover:shadow-etpc-gold/25"
                >
                  Agende uma visita
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Seção de imagem à direita */}
            <div className="relative">
              <div className="relative w-full h-96 lg:h-[500px] xl:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={activeBanners[currentIndex].image}
                  alt={activeBanners[currentIndex].title}
                  fill
                  className={`object-cover transition-all duration-500 ${
                    isTransitioning ? 'scale-105 opacity-80' : 'scale-100 opacity-100'
                  }`}
                  priority={currentIndex === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-etpc-blue/20 to-etpc-gold/20"></div>
              </div>
              
              {/* Emblema no canto superior direito */}
              <div className="absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-etpc-blue to-etpc-gold rounded-full flex items-center justify-center">
                  <FaGraduationCap className="text-2xl text-white" />
                </div>
              </div>
            </div>
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

      {/* Indicadores */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
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