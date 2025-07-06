import React from 'react';
import KedaiCardGrid, { KedaiFilterType } from '../components/KedaiCardGrid'; // Import KedaiFilterType
import { Kedai } from '../types';
import { ArrowLeft } from 'lucide-react';

interface KedaiListPageProps {
  onBack: () => void;
  onKedaiSelect: (kedai: Kedai) => void;
  filterType: KedaiFilterType; // Add filterType prop
}

const KedaiListPage: React.FC<KedaiListPageProps> = ({ onBack, onKedaiSelect, filterType }) => {
  // Determine the title based on the filterType
  const pageTitle = filterType === 'minuman' ? 'Pesan Minum' : 
                   filterType === 'cemilan' ? 'Pesan Cemilan' : 'Pesan Makan';

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-gray-900 font-sans">
      <header className="relative pt-8 pb-4 px-4">
        <div className="relative z-10 flex items-center justify-center h-12"> {/* Adjusted div for flex layout */}
          <button 
            onClick={onBack}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-gray-700 rounded-full p-2 shadow-md hover:bg-gray-100 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Kembali"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          {/* Use dynamic page title */}
          <h1 className="text-xl font-bold text-gray-800">{pageTitle}</h1> 
        </div>
      </header>

      <main className="space-y-4 max-w-4xl mx-auto -mt-6 relative z-20 px-3">
        <section className="bg-white rounded-t-xl shadow-sm py-3 px-2">
          {/* Pass the filterType to KedaiCardGrid */}
          <KedaiCardGrid onKedaiSelect={onKedaiSelect} filterType={filterType} />
        </section>
      </main>


    </div>
  );
};

export default KedaiListPage;

