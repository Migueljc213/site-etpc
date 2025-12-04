'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: Array<{
    id: string;
    title: string;
    image: string;
    category: string;
  }>;
  currentIndex: number;
  onNavigate?: (index: number) => void;
}

export default function ImageModal({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNavigate
}: ImageModalProps) {
  const [imageIndex, setImageIndex] = useState(currentIndex);

  useEffect(() => {
    setImageIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, imageIndex]);

  const handlePrevious = () => {
    const newIndex = imageIndex > 0 ? imageIndex - 1 : images.length - 1;
    setImageIndex(newIndex);
    onNavigate?.(newIndex);
  };

  const handleNext = () => {
    const newIndex = imageIndex < images.length - 1 ? imageIndex + 1 : 0;
    setImageIndex(newIndex);
    onNavigate?.(newIndex);
  };

  if (!isOpen || !images[imageIndex]) return null;

  const currentImage = images[imageIndex];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-60 text-white hover:text-gray-300 transition-colors p-2 rounded-full bg-black/50 hover:bg-black/70"
        aria-label="Fechar modal"
      >
        <FaTimes className="w-6 h-6" />
      </button>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-60 text-white hover:text-gray-300 transition-colors p-3 rounded-full bg-black/50 hover:bg-black/70"
            aria-label="Imagem anterior"
          >
            <FaChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-60 text-white hover:text-gray-300 transition-colors p-3 rounded-full bg-black/50 hover:bg-black/70"
            aria-label="Próxima imagem"
          >
            <FaChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Image container */}
      <div className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center">
        <div className="relative flex-1 flex items-center justify-center">
          <Image
            src={currentImage.image}
            alt={currentImage.title}
            width={1200}
            height={800}
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            priority
          />
        </div>

        {/* Image info */}
        <div className="mt-4 text-center text-white bg-black/50 rounded-lg p-4 backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-2">{currentImage.title}</h3>
          <p className="text-sm text-gray-300 capitalize">{currentImage.category}</p>
          {images.length > 1 && (
            <p className="text-sm text-gray-400 mt-2">
              {imageIndex + 1} de {images.length}
            </p>
          )}
        </div>
      </div>

      {/* Thumbnail navigation for multiple images */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 bg-black/50 rounded-full p-2 backdrop-blur-sm">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setImageIndex(index);
                onNavigate?.(index);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === imageIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Ir para imagem ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Backdrop click to close */}
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
        aria-label="Fechar modal"
      />
    </div>
  );
}