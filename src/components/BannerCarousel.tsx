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
  const [isLoading, setIsLoading] = useState(true);

  // Filtrar apenas banners ativos
  const activeBanners = banners.filter(banner => banner.active);

  // Controlar loading inicial
  useEffect(() => {
    if (activeBanners.length > 0) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000); // 1 segundo de loading
      return () => clearTimeout(timer);
    }
  }, [activeBanners.length]);

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

  // Tela de loading
  if (isLoading) {
    return (
      <div className="relative w-full h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 overflow-hidden flex items-center justify-center">
        {/* Elementos decorativos */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-48 translate-y-48"></div>
        
        {/* Loading spinner */}
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-white/80 text-lg font-poppins">Carregando...</p>
        </div>
      </div>
    );
  }

  if (activeBanners.length === 0) {
    return (
      <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden">
        {/* Imagem de fundo completa */}
        <div className="absolute inset-0">
          <Image
            src="/sofundoComaluno.jfif"
            alt="Banner ETPC com aluna"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Texto sobreposto no lado esquerdo */}
        <div className="relative z-10 h-full flex items-center py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-xl">
              <div className="space-y-4 text-white">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold font-poppins leading-tight">
                  Bem-vindo à ETPC
                </h1>

                <div className="space-y-2 text-lg text-white/90 leading-relaxed">
                  <p>Formação técnica de excelência que</p>
                  <p>conecta você diretamente ao mercado</p>
                  <p>de trabalho.</p>
                </div>

                {/* Botão CTA */}
                <div className="pt-6">
                  <a 
                    href="/matriculas" 
                    className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105 shadow-2xl hover:shadow-yellow-400/25"
                  >
                    Comece sua jornada →
                  </a>
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
      <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden">
        {/* Imagem de fundo completa */}
        <div className="absolute inset-0">
          <Image
            src="/sofundoComaluno.jfif"
            alt="Banner ETPC com aluna"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Texto sobreposto no lado esquerdo */}
        <div className="relative z-10 h-full flex items-center py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-xl">
              <div className="space-y-4 text-white">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold font-poppins leading-tight">
                  {banner.title}
                </h1>

                {banner.description && (
                  <div className="space-y-2 text-lg text-white/90 leading-relaxed">
                    {banner.description.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                )}

                {/* Botão CTA */}
                <div className="pt-6">
                  <a 
                    href={banner.link || "/matriculas"} 
                    className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105 shadow-2xl hover:shadow-yellow-400/25"
                  >
                    Comece sua jornada →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden group">
      {/* Imagem de fundo completa */}
      <div className="absolute inset-0">
        <Image
          src="/sofundoComaluno.jfif"
          alt="Banner ETPC com aluna"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Texto sobreposto no lado esquerdo */}
      <div className="relative z-10 h-full flex items-center py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl">
            <div className="space-y-4 text-white">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold font-poppins leading-tight transition-all duration-500">
                {activeBanners[currentIndex].title}
              </h1>

              {activeBanners[currentIndex].description && (
                <div className="space-y-2 text-lg text-white/90 leading-relaxed transition-all duration-500">
                  {activeBanners[currentIndex].description.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              )}

              {/* Botão CTA */}
              <div className="pt-6">
                <a 
                  href={activeBanners[currentIndex].link || "/matriculas"} 
                  className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105 shadow-2xl hover:shadow-yellow-400/25"
                >
                  Comece sua jornada →
                </a>
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