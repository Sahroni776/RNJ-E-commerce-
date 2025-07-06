import React from 'react';
import { KateringItem } from '@/types'; // Use KateringItem type
import KateringCard from './KateringCard'; // Use KateringCard component

interface KateringCardGridProps {
  itemList: KateringItem[]; // Change prop name and type
  onCardClick: (item: KateringItem) => void; // Change type
}

const KateringCardGrid: React.FC<KateringCardGridProps> = ({ itemList, onCardClick }) => {
  if (itemList.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-muted-foreground">Tidak ada item katering yang tersedia</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {itemList.map((item) => (
        <KateringCard 
          key={item.id} 
          item={item} // Pass item to KateringCard
          onClick={() => onCardClick(item)} 
        />
      ))}
    </div>
  );
};

export default KateringCardGrid;

