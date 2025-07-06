import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface HomeServiceItemProps {
  icon: IconDefinition | string; // Can be FontAwesome icon or path to SVG/image
  title: string;
  onClick: () => void;
  // Added color prop for dynamic coloring of icons
  color?: string;
}

// Function to get a random color if none is provided
const getRandomColor = () => {
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const HomeServiceItem: React.FC<HomeServiceItemProps> = ({ icon, title, onClick, color }) => {
  // Use provided color or get a random one
  const bgColor = color || getRandomColor();
  const finalTextClasses = "text-gray-800 text-xs text-center font-medium mt-2";

  // Remove card background, keep only the icon and text
  const containerClasses = "flex flex-col items-center justify-center p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 w-full";
  
  // Create circular background for icons with dynamic color
  const iconContainerClasses = `flex items-center justify-center rounded-full ${bgColor} w-10 h-10 mb-1`;
  
  // Make icons smaller
  const iconSizeClasses = "w-6 h-6 object-contain";
  const fontAwesomeIconClasses = `text-xl`;

  return (
    <button
      onClick={onClick}
      className={containerClasses}
    >
      <div className={iconContainerClasses}>
        {typeof icon === 'string' ? (
          <div className="rounded-full overflow-hidden w-6 h-6 flex items-center justify-center">
            <img src={icon} alt={`${title} icon`} className={iconSizeClasses} />
          </div>
        ) : (
          <FontAwesomeIcon icon={icon} className={`${fontAwesomeIconClasses} text-white w-6 h-6`} />
        )}
      </div>
      <span className={finalTextClasses}>{title}</span>
    </button>
  );
};

export default HomeServiceItem;

