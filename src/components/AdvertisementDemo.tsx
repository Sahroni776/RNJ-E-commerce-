import React, { useState, useEffect } from 'react';

const AdvertisementDemo: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Data demo iklan
  const demoAds = [
    {
      id: '1',
      image_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=400&fit=crop',
      promo_text: 'Diskon 50% Makanan Favorit!',
      end_date: '2025-07-31'
    },
    {
      id: '2', 
      image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=400&fit=crop',
      promo_text: 'Promo Spesial Pizza Keju',
      end_date: '2025-08-15'
    },
    {
      id: '3',
      image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=400&fit=crop',
      promo_text: 'Menu Baru Tersedia!',
      end_date: '2025-07-25'
    }
  ];

  // Auto slide effect dengan transisi
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === demoAds.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={`relative w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-lg ${className}`}>
      {/* Main Image Container dengan efek slide */}
      <div className="relative w-full h-full">
        <div 
          className="flex w-full h-full transition-transform duration-500 ease-in-out"
          style={{ 
            transform: `translateX(-${currentIndex * 100}%)`,
            width: `${demoAds.length * 100}%`
          }}
        >
          {demoAds.map((ad) => (
            <div
              key={ad.id}
              className="w-full h-full flex-shrink-0 relative"
              style={{ width: `${100 / demoAds.length}%` }}
            >
              {/* Background Image */}
              <div 
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ 
                  backgroundImage: `url(${ad.image_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <div className="text-white">
                    <h3 className="text-lg md:text-xl font-bold mb-1 drop-shadow-lg">
                      {ad.promo_text}
                    </h3>
                    <p className="text-xs md:text-sm opacity-90 drop-shadow">
                      Berlaku hingga {new Date(ad.end_date).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => goToSlide(currentIndex === 0 ? demoAds.length - 1 : currentIndex - 1)}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200 group"
        aria-label="Previous advertisement"
      >
        <svg className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={() => goToSlide(currentIndex === demoAds.length - 1 ? 0 : currentIndex + 1)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200 group"
        aria-label="Next advertisement"
      >
        <svg className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {demoAds.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-200 ${
              index === currentIndex 
                ? 'bg-white scale-110' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute top-2 right-2">
        <div className="w-8 h-1 bg-white/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white rounded-full animate-pulse"
            style={{
              width: '100%'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdvertisementDemo;

