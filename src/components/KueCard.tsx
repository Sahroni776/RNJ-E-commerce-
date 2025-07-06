import React from 'react';
import { Card, CardContent } from './ui/card';
import { ProdukKueTumpeng } from '@/types';

interface KueCardProps {
  produk: ProdukKueTumpeng;
  onClick: () => void;
}

const KueCard: React.FC<KueCardProps> = ({ produk, onClick }) => {
  return (
    <Card 
      className="card-container overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border border-gray-100"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={produk.url_foto} 
          alt={produk.nama_produk}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-500/70 to-transparent p-2">
          <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-white text-green-600">
            {produk.kategori}
          </span>
        </div>
      </div>
      <CardContent className="p-4 bg-white">
        <h3 className="text-lg font-semibold line-clamp-1 text-gray-800">{produk.nama_produk}</h3>
        <p className="text-green-600 font-medium mt-1">
          Rp {produk.harga.toLocaleString('id-ID')}
        </p>
      </CardContent>
    </Card>
  );
};

export default KueCard;
