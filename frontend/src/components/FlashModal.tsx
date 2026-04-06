import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';

interface FlashModalProps {
  isOpen: boolean;
  onClose: () => void;
  notice: {
    title: string;
    message: string;
    image: string;
  };
}

const FlashModal: React.FC<FlashModalProps> = ({ isOpen, onClose, notice }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    } else {
      setTimeout(() => setIsVisible(false), 200); // Delay unmount for fade-out
      document.body.style.overflow = 'auto';
    }
  }, [isOpen, onClose]);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" />

      <div
        ref={modalRef}
        className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 z-10 transform transition-all duration-300 ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        style={{ maxHeight: '90vh' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none z-10"
          aria-label="Close"
        >
          <svg className="w-6 h-6 text-gray-500 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Content */}
        <div className="overflow-y-auto flex-1">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 pr-8">{notice.title}</h3>

          <div className="mb-4 flex justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
            <img
              src={notice.image}
              alt="Flash Notice"
              className="max-w-full max-h-[60vh] object-contain"
            />
          </div>

          <p className="font-bold text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-line">{notice.message}</p>
        </div>

        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/aboutus"
            className="text-blue-600 dark:text-blue-400 hover:underline block text-center py-2"
            onClick={onClose}
          >
            See About School
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default FlashModal;
