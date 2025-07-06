import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import KueFilterButtons from '@/components/KueFilterButtons';
import KueCardGrid from '@/components/KueCardGrid';
import KueDetailModal from '@/components/KueDetailModal';
import { ProdukKueTumpeng } from '@/types';
import { getAllProdukKueTumpeng } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface KueMenuPageProps {
  onBack: () => void;
}

const KueMenuPage: React.FC<KueMenuPageProps> = ({ onBack }) => {
  const [produkList, setProdukList] = useState<ProdukKueTumpeng[]>([]);
  const [filteredProdukList, setFilteredProdukList] = useState<ProdukKueTumpeng[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedProduk, setSelectedProduk] = useState<ProdukKueTumpeng | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all products on component mount
  useEffect(() => {
    const fetchProduk = async () => {
      try {
        setIsLoading(true);
        const data = await getAllProdukKueTumpeng();
        setProdukList(data);
        setFilteredProdukList(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching produk:', err);
        setError('Gagal memuat data produk. Silakan coba lagi nanti.');
        setIsLoading(false);
      }
    };

    fetchProduk();
  }, []);

  // Filter products when category changes
  useEffect(() => {
    if (activeCategory === null) {
      setFilteredProdukList(produkList);
    } else {
      const filtered = produkList.filter(produk => produk.kategori === activeCategory);
      setFilteredProdukList(filtered);
    }
  }, [activeCategory, produkList]);

  const handleCardClick = (produk: ProdukKueTumpeng) => {
    setSelectedProduk(produk);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduk(null);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-white py-4 px-4 sticky top-0 z-10 shadow-md">
        <Container>
          <div className="flex items-center justify-between">
            <Button 
              className="rounded-full p-3 shadow-lg bg-gradient-to-r from-green-400 to-green-600 text-white border-0 hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
              onClick={onBack}
            >
              <ArrowLeft size={24} strokeWidth={2.5} />
            </Button>
            
            <KueFilterButtons 
              activeCategory={activeCategory} 
              setActiveCategory={setActiveCategory} 
            />
          </div>
        </Container>
      </div>

      <Container className="py-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Memuat data...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64 bg-red-50 rounded-lg p-4">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <KueCardGrid 
            produkList={filteredProdukList} 
            onCardClick={handleCardClick} 
          />
        )}

        <KueDetailModal 
          produk={selectedProduk} 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
        />
      </Container>
    </div>
  );
};

export default KueMenuPage;
