import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Advertisement {
  id: string;
  image_url: string | null;
  promo_text: string | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
}

interface AdvertisementBannerProps {
  advertisements?: Advertisement[];
  autoSlideInterval?: number;
  className?: string;
}

const AdvertisementBannerSlide: React.FC<AdvertisementBannerProps> = ({
  advertisements = [],
  autoSlideInterval = 5000,
  className = ''
}) => {
  console.log('[AdvertisementBannerSlide] Component rendered. Advertisements prop:', advertisements);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  
  // Refs untuk cleanup dan mounted state
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);

  // Memoize ads dengan error handling yang lebih baik
  const ads = React.useMemo(() => {
    console.log('[AdvertisementBannerSlide] useMemo for ads triggered.');
    try {
      if (!advertisements || advertisements.length === 0) {
        console.log('[AdvertisementBannerSlide] No advertisements provided or empty array.');
        return [];
      }
      const filteredAds = advertisements.filter(ad => 
        ad && 
        ad.image_url && 
        ad.promo_text && 
        ad.is_active
      );
      console.log('[AdvertisementBannerSlide] Filtered ads:', filteredAds);
      return filteredAds;
    } catch (error) {
      console.error('[AdvertisementBannerSlide] Error processing ads in useMemo:', error);
      return [];
    }
  }, [advertisements]);

  // Cleanup function yang aman
  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      console.log('[AdvertisementBannerSlide] Timeout cleared.');
    }
  }, []);

  // Safe state update function
  const safeSetCurrentIndex = useCallback((newIndex: number | ((prev: number) => number)) => {
    if (isMountedRef.current) {
      setCurrentIndex(newIndex);
    }
  }, []);

  // Navigation functions dengan error handling
  const goToPrevious = useCallback(() => {
    console.log('[AdvertisementBannerSlide] goToPrevious triggered.');
    try {
      if (ads.length === 0) return;
      safeSetCurrentIndex(prev => prev === 0 ? ads.length - 1 : prev - 1);
    } catch (error) {
      console.error('[AdvertisementBannerSlide] Error in goToPrevious:', error);
    }
  }, [ads.length, safeSetCurrentIndex]);

  const goToNext = useCallback(() => {
    console.log('[AdvertisementBannerSlide] goToNext triggered.');
    try {
      if (ads.length === 0) return;
      safeSetCurrentIndex(prev => prev === ads.length - 1 ? 0 : prev + 1);
    } catch (error) {
      console.error('[AdvertisementBannerSlide] Error in goToNext:', error);
    }
  }, [ads.length, safeSetCurrentIndex]);

  const goToSlide = useCallback((index: number) => {
    console.log('[AdvertisementBannerSlide] goToSlide triggered. Target index:', index);
    try {
      if (ads.length === 0 || index < 0 || index >= ads.length) return;
      safeSetCurrentIndex(index);
    } catch (error) {
      console.error('[AdvertisementBannerSlide] Error in goToSlide:', error);
    }
  }, [ads.length, safeSetCurrentIndex]);

  // Auto slide effect dengan dependency yang diperbaiki
  useEffect(() => {
    console.log('[AdvertisementBannerSlide] useEffect for auto-slide triggered. CurrentIndex:', currentIndex, 'Ads length:', ads.length, 'Is hovered:', isHovered);
    
    // Reset timeout sebelumnya
    resetTimeout();
    
    // Kondisi untuk auto-slide
    if (ads.length <= 1 || isHovered || !isMountedRef.current) {
      console.log('[AdvertisementBannerSlide] Auto-slide conditions not met.');
      return;
    }

    timeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        safeSetCurrentIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % ads.length;
          console.log('[AdvertisementBannerSlide] Auto-sliding to next index:', nextIndex);
          return nextIndex;
        });
      }
    }, autoSlideInterval);

    // Cleanup function
    return () => {
      resetTimeout();
    };
  }, [currentIndex, ads.length, autoSlideInterval, isHovered, resetTimeout, safeSetCurrentIndex]);

  // Handle transition end untuk infinite loop
  const handleTransitionEnd = useCallback(() => {
    console.log('[AdvertisementBannerSlide] handleTransitionEnd triggered. CurrentIndex:', currentIndex, 'Ads length:', ads.length);
    
    if (!isMountedRef.current) return;
    
    try {
      // Untuk infinite loop, reset ke index 0 jika sudah di akhir
      if (currentIndex >= ads.length && ads.length > 0) {
        console.log('[AdvertisementBannerSlide] Resetting to first slide (index 0) without transition.');
        setIsTransitioning(false);
        safeSetCurrentIndex(0);
        
        // Force reflow dan enable transition kembali
        setTimeout(() => {
          if (isMountedRef.current) {
            setIsTransitioning(true);
          }
        }, 50);
      }
    } catch (error) {
      console.error('[AdvertisementBannerSlide] Error in handleTransitionEnd:', error);
    }
  }, [currentIndex, ads.length, safeSetCurrentIndex]);

  // Cleanup saat unmount
  useEffect(() => {
    return () => {
      console.log('[AdvertisementBannerSlide] Component unmounting. Cleaning up...');
      isMountedRef.current = false;
      resetTimeout();
    };
  }, [resetTimeout]);

  // Jika tidak ada ads yang valid, return null
  if (ads.length === 0) {
    console.log('[AdvertisementBannerSlide] No valid ads to display. Returning null.');
    return null;
  }

  // Pastikan currentIndex dalam range yang valid
  const safeCurrentIndex = Math.max(0, Math.min(currentIndex, ads.length - 1));

  console.log('[AdvertisementBannerSlide] Rendering JSX. CurrentIndex:', safeCurrentIndex);
  
  return (
    <div 
      className={`relative w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-lg ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image Container */}
      <div className="relative w-full h-full">
        <div 
          ref={containerRef}
          className={`flex w-full h-full ${isTransitioning ? 'transition-transform duration-1000 ease-in-out' : ''}`}
          style={{ 
            transform: `translateX(-${safeCurrentIndex * 100}%)`,
            width: `${ads.length * 100}%`
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {ads.map((ad, index) => (
            <div
              key={`${ad.id}-${index}`}
              className="w-full h-full flex-shrink-0 relative"
              style={{ width: `${100 / ads.length}%` }}
            >
              {/* Background Image dengan fallback */}
              <div 
                className="w-full h-full bg-cover bg-center bg-no-repeat bg-gray-200"
                style={{ 
                  backgroundImage: `url(${ad.image_url || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=400&fit=crop'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <div className="text-white">
                    <h3 className="text-lg md:text-xl font-bold mb-1 drop-shadow-2xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                      {ad.promo_text || 'Promo Menarik'}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {ads.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200 group z-10"
            aria-label="Previous advertisement"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200 group z-10"
            aria-label="Next advertisement"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {ads.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {ads.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-200 ${
                index === safeCurrentIndex
                  ? 'bg-white scale-110' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar untuk Auto-slide */}
      {ads.length > 1 && !isHovered && (
        <div className="absolute top-2 right-2 z-10">
          <div className="w-8 h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full animate-pulse"
              style={{
                width: '100%'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvertisementBannerSlide;

