import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface ServiceCardProps {
  icon: IconDefinition;
  title: string;
  onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 md:p-6 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-75 aspect-square"
    >
      <FontAwesomeIcon icon={icon} className="text-3xl md:text-4xl text-teal-400 mb-2 md:mb-3" />
      <span className="text-sm md:text-base text-center font-medium text-gray-200">{title}</span>
    </button>
  );
};

export default ServiceCard;

