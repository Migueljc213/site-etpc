'use client';

import { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';
import { createPortal } from 'react-dom';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: FaCheckCircle,
    error: FaTimesCircle,
    info: FaInfoCircle,
    warning: FaExclamationCircle
  };

  const colors = {
    success: 'bg-green-500 border-green-600',
    error: 'bg-red-500 border-red-600',
    info: 'bg-blue-500 border-blue-600',
    warning: 'bg-yellow-500 border-yellow-600'
  };

  const Icon = icons[type];

  return createPortal(
    <div className="fixed bottom-4 right-4 z-[9999] animate-slide-up">
      <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg text-white min-w-[300px] max-w-md border-2 ${colors[type]}`}>
        <Icon className="text-2xl flex-shrink-0" />
        <p className="flex-1 font-medium">{message}</p>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors flex-shrink-0"
        >
          <FaTimesCircle />
        </button>
      </div>
    </div>,
    document.body
  );
}

