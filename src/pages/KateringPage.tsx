import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import KateringCardGrid from '@/components/KateringCardGrid';
import KateringDetailModal from '@/components/KateringDetailModal';
import { KateringItem } from '@/types';
import { getAllKateringItems } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface KateringPageProps {
  onBack: () => void;
}

const KateringPage: React.FC<KateringPageProps> = ({ onBack }) => {
  const [itemList, setItemList] = useState<KateringItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<KateringItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      console.log('[KateringPage] Attempting to fetch katering items...'); // Frontend log
      try {
        setIsLoading(true);
        setError(null); // Reset error state
        const data = await getAllKateringItems();
        console.log('[KateringPage] Fetched katering data:', data); // Frontend log: Log fetched data
        if (data && data.length > 0) {
          console.log(`[KateringPage] ${data.length} items fetched successfully.`); // Frontend log: Confirm count
          setItemList(data);
        } else {
          console.log('[KateringPage] No katering items found or data is empty.'); // Frontend log: Empty data
          setItemList([]); // Ensure item list is empty
        }
        setIsLoading(false);
      } catch (err: any) { // Catch specific error
        console.error('[KateringPage] Error fetching katering items:', err); // Frontend log: Log error
        setError(`Gagal memuat data katering: ${err.message || 'Unknown error'}`);
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleCardClick = (item: KateringItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white py-4 px-4 sticky top-0 z-10 shadow-md">
        <Container>
          <div className="flex items-center justify-between">
            <Button 
              className="rounded-full p-3 shadow-lg bg-gradient-to-r from-blue-500 to-teal-500 text-white border-0 hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
              onClick={onBack}
            >
              <ArrowLeft size={24} strokeWidth={2.5} />
            </Button>
            <h1 className="text-xl font-semibold text-gray-700">Menu Katering</h1>
             <div></div> 
          </div>
        </Container>
      </div>

      <Container className="py-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Memuat data katering...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64 bg-red-50 rounded-lg p-4">
            <p className="text-red-500">Error: {error}</p> {/* Display error message */}
          </div>
        // Explicitly check itemList length after loading and no error
        ) : itemList.length === 0 ? (
           <div className="flex justify-center items-center h-64">
             <p className="text-lg text-muted-foreground">Tidak ada item katering yang tersedia</p>
           </div>
        ) : (
          <KateringCardGrid 
            itemList={itemList}
            onCardClick={handleCardClick} 
          />
        )}

        <KateringDetailModal 
          item={selectedItem} 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
        />
      </Container>
    </div>
  );
};

export default KateringPage;

