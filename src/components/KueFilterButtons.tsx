import React from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface KueFilterButtonsProps {
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
}

const KueFilterButtons: React.FC<KueFilterButtonsProps> = ({
  activeCategory,
  setActiveCategory,
}) => {
  const categories = ['Kue Tar', 'Tumpeng', 'Kue Lain'];

  return (
    <div className="flex justify-between items-center w-full mb-6 overflow-x-auto no-scrollbar">
      <div className="flex space-x-3 mx-auto">
        {categories.map((category) => (
          <Button
            key={category}
            variant="outline"
            className={cn(
              "category-button whitespace-nowrap px-6 py-2.5 text-sm font-medium rounded-full shadow-md transition-all duration-300 transform hover:scale-105",
              activeCategory === category 
                ? "category-button-active bg-gradient-to-r from-green-400 to-green-600 text-white border-transparent" 
                : "category-button-inactive border-gray-200 hover:border-green-300 hover:text-green-600"
            )}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default KueFilterButtons;
