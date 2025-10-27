'use client';

import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { FaTimes, FaTrash, FaShoppingCart } from 'react-icons/fa';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-full md:w-96 bg-white shadow-2xl z-[210] transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-screen bg-white">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
            <div className="flex items-center gap-2">
              <FaShoppingCart className="text-etpc-blue text-xl" />
              <h2 className="text-xl font-bold text-gray-900">
                Carrinho ({items.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 pb-24">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <FaShoppingCart size={64} className="mb-4 text-gray-300" />
                <p className="text-lg font-medium">Seu carrinho está vazio</p>
                <p className="text-sm mt-2">Adicione cursos para começar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => {
                  const price = item.discountPrice || item.price;
                  return (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {/* Image */}
                      <div className="relative w-24 h-24 flex-shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-etpc-blue to-etpc-blue-dark rounded flex items-center justify-center">
                            <FaShoppingCart className="text-white text-2xl" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-base line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.instructor}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <div>
                            {item.discountPrice && (
                              <span className="text-xs text-gray-400 line-through mr-2">
                                {formatPrice(item.price)}
                              </span>
                            )}
                            <span className="font-bold text-etpc-blue">
                              {formatPrice(price)}
                            </span>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-2 rounded hover:bg-red-50"
                            title="Remover do carrinho"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="w-full text-sm text-red-500 hover:text-red-700 transition-colors py-2"
                  >
                    Limpar carrinho
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-4 sticky bottom-0 bg-white z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(getCartTotal())}
                </span>
              </div>

              <Link
                href="/checkout"
                onClick={onClose}
                className="block w-full bg-etpc-blue text-white py-3 rounded-lg font-semibold text-center hover:bg-etpc-blue-dark transition-colors"
              >
                Finalizar Compra
              </Link>

              <button
                onClick={onClose}
                className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Continuar Comprando
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
