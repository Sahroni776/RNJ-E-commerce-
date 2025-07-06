import React from 'react';
import { ProdukKueTumpeng } from '@/types';
import KueCard from './KueCard';

interface KueCardGridProps {
  produkList: ProdukKueTumpeng[];
  onCardClick: (produk: ProdukKueTumpeng) => void;
}

const KueCardGrid: React.FC<KueCardGridProps> = ({ produkList, onCardClick }) => {
  if (produkList.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-muted-foreground">Tidak ada produk yang tersedia</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {produkList.map((produk) => (
        <KueCard 
          key={produk.id} 
          produk={produk} 
          onClick={() => onCardClick(produk)} 
        />
      ))}
    </div>
  );
};

export default KueCardGrid;
