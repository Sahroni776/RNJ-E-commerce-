import React, { useState, useEffect } from 'react';

interface Advertisement {
  id: string;
  image_url: string;
  promo_text: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

interface AdvertisementBannerProps {
  advertisements?: Advertisement[];
  autoSlideInterval?: number;
  className?: string;
}

const AdvertisementBanner: React.FC<AdvertisementBannerProps> = ({
  advertisements = [],
  autoSlideInterval = 3000,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide effect
  useEffect(() => {
    if (advertisements.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === advertisements.length - 1 ? 0 : prevIndex + 1
      );
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [advertisements.length, autoSlideInterval]);

  if (advertisements.length === 0) {
    return (
      <div className={`relative w-full h-48 md:h-64 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl overflow-hidden ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h3 className="text-xl md:text-2xl font-bold mb-2">Promo Spesial!</h3>
            <p className="text-sm md:text-base opacity-90">Dapatkan penawaran terbaik hari ini</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-lg ${className}`}>
      {/* Main Image Container */}
      <div className="relative w-full h-full">
        {advertisements.map((ad, index) => (
          <div
            key={ad.id}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
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

      {/* Dots Indicator */}
      {advertisements.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {advertisements.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-white scale-110' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvertisementBanner;

