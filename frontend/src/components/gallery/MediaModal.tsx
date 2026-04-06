import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Media {
  id: number;
  image?: string;
  video_file?: string;
  caption: string;
  uploaded_date: string;
  type: 'photo' | 'video';
}

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: Media | null;
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  totalItems: number;
}

const MediaModal: React.FC<MediaModalProps> = ({
  isOpen,
  onClose,
  media,
  onNext,
  onPrev,
  currentIndex,
  totalItems,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isMediaLoading, setIsMediaLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowRight':
          onNext();
          break;
        case 'ArrowLeft':
          onPrev();
          break;
        case ' ':
          if (media?.type === 'video') break;
          setIsZoomed(prev => !prev);
          break;
        default:
          break;
      }
    },
    [isOpen, onClose, onNext, onPrev, media]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      onNext();
    } else if (touchEnd - touchStart > 50) {
      onPrev();
    }
  };

  // Focus trap and keyboard event listener
  useEffect(() => {
    if (!isOpen) return;

    const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements?.[0];
    const lastElement = focusableElements?.[focusableElements?.length ? focusableElements.length - 1 : 0];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      } else if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen, handleKeyDown]);

  // Reset loading and zoom state when media changes
  useEffect(() => {
    setIsMediaLoading(true);
    setIsZoomed(false);
  }, [media]);

  if (!isOpen || !media) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = media.image || media.video_file || '';
    link.download = `media-${media.id}-${Date.now()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full h-full max-w-6xl mx-4 outline-none flex items-center justify-center"
      >
        <h2 id="modal-title" className="sr-only">
          Media Viewer - {media.type === 'photo' ? 'Photo' : 'Video'}
        </h2>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white rounded-full"
          aria-label="Close modal"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Media Display */}
        <div
          className={`relative w-full h-full max-h-[90vh] flex items-center justify-center ${isZoomed ? 'cursor-zoom-out' : 'cursor-default'}`}
          onClick={() => media.type === 'photo' && setIsZoomed(!isZoomed)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {isMediaLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {media.type === 'photo' ? (
            <img
              src={media.image}
              alt={media.caption}
              className={`max-w-full max-h-[90vh] object-contain transition-transform duration-300 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'}`}
              onLoad={() => setIsMediaLoading(false)}
              onError={() => setIsMediaLoading(false)}
            />
          ) : (
            <video
              src={media.video_file}
              controls
              className="max-w-full max-h-[90vh]"
              onCanPlay={() => setIsMediaLoading(false)}
              onError={() => setIsMediaLoading(false)}
              autoPlay
            />
          )}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 sm:p-4 rounded-full hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Previous"
        >
          <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 sm:p-4 rounded-full hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Next"
        >
          <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="absolute bottom-4 right-4 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Download"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>

        {/* Media Info */}
        <div className="absolute bottom-4 left-4 right-4 z-10 bg-black bg-opacity-50 text-white p-4 rounded-lg max-w-2xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">
                {currentIndex} of {totalItems}
              </p>
              <p className="text-lg">{media.caption || 'No caption'}</p>
            </div>
            <p className="text-sm opacity-80">
              {new Date(media.uploaded_date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaModal;