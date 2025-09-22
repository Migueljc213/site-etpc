'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

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
      <div className="w-full h-[400px] bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">ETPC</h2>
          <p className="text-blue-100">Excelência em educação técnica</p>
        </div>
      </div>
    );
  }

  if (activeBanners.length === 1) {
    const banner = activeBanners[0];
    return (
      <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl">
        <Image
          src={banner.image}
          alt={banner.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-8">
            <h1 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg">
              {banner.title}
            </h1>
            {banner.description && (
              <p className="text-lg md:text-xl text-blue-100 drop-shadow-lg">
                {banner.description}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl group">
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
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Conteúdo do banner */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-8">
            <h1 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg transition-all duration-500">
              {activeBanners[currentIndex].title}
            </h1>
            {activeBanners[currentIndex].description && (
              <p className="text-lg md:text-xl text-blue-100 drop-shadow-lg transition-all duration-500">
                {activeBanners[currentIndex].description}
              </p>
            )}
          </div>
        </div>

        {/* Botões de navegação */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100"
          aria-label="Banner anterior"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100"
          aria-label="Próximo banner"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
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
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
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

