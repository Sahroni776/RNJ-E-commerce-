
import React from 'react';
import { SablonItem } from '@/types'; // Use SablonItem type
import SablonCard from './SablonCard'; // Use SablonCard component

interface SablonCardGridProps {
  itemList: SablonItem[];
  onCardClick: (item: SablonItem) => void;
}

const SablonCardGrid: React.FC<SablonCardGridProps> = ({ itemList, onCardClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {itemList.map((item) => (
        <SablonCard 
          key={item.id} 
          item={item} 
          onClick={() => onCardClick(item)} 
        />
      ))}
    </div>
  );
};

export default SablonCardGrid;

