import React, { useEffect, useState } from 'react';
import { Kedai } from '../types'; // Remove MenuMakanan import as it's not used
import KedaiCard from './KedaiCard';
import { Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { sampleKedaiData } from '../data/sampleKedaiData';

// Define the possible filter types
export type KedaiFilterType = 'makanan' | 'minuman' | 'cemilan' | 'all';

interface KedaiCardGridProps {
  onKedaiSelect: (kedai: Kedai) => void;
  filterType: KedaiFilterType; // Add filterType prop
}

const KedaiCardGrid: React.FC<KedaiCardGridProps> = ({ onKedaiSelect, filterType }) => {
  const [kedaiList, setKedaiList] = useState<Kedai[]>([]);
  const [filteredKedaiList, setFilteredKedaiList] = useState<Kedai[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchKedaiData = async () => {
      setIsLoading(true);
      try {
        // Ambil data dari Supabase
        const { data, error } = await supabase
          .from('kedai')
          .select(`
            *,
            menu_makanan(*)
          `)
          .eq('aktif', true);

        let fetchedKedai: Kedai[] = [];
        if (error) {
          console.error('Error fetching data from Supabase:', error);
          // Fallback ke data sampel jika gagal
          fetchedKedai = sampleKedaiData;
        } else if (data && data.length > 0) {
          // Filter menu makanan yang tersedia first
          fetchedKedai = data.map((kedai: any) => ({
            ...kedai,
            menu_makanan: kedai.menu_makanan ? kedai.menu_makanan.filter((menu: any) => menu.tersedia) : []
          }));
        } else {
          // Fallback ke data sampel jika tidak ada data
          fetchedKedai = sampleKedaiData;
        }

        console.log("Filter type:", filterType);
        console.log("Fetched kedai before filtering:", fetchedKedai);

        // Filter kedai based on filterType (client-side filtering for now)
        let filteredByType: Kedai[] = [];
        if (filterType === 'minuman') {
          filteredByType = fetchedKedai.filter(kedai => 
            kedai.menu_makanan && kedai.menu_makanan.some((menu: any) => menu.kategori_menu?.trim().toLowerCase() === 'minuman')
          );
        } else if (filterType === 'cemilan') {
          // Show kedai that have at least one snack item with kategori_menu exactly 'Makanan Ringan'
          filteredByType = fetchedKedai.filter(kedai => 
            kedai.menu_makanan && kedai.menu_makanan.some((menu: any) => menu.kategori_menu?.trim().toLowerCase() === 'makanan ringan')
          );
        } else if (filterType === 'makanan') {
          // Show kedai that have at least one main food item with kategori_menu exactly 'Makanan Utama'
          filteredByType = fetchedKedai.filter(kedai => 
            kedai.menu_makanan && kedai.menu_makanan.some((menu: any) => 
              menu.kategori_menu?.trim().toLowerCase() === 'makanan utama'
            )
          );
        } else { // 'all'
          filteredByType = fetchedKedai;
        }

        console.log("Filtered kedai after type filtering:", filteredByType);
        setKedaiList(filteredByType);

      } catch (error) {
        console.error('Error in fetchKedaiData:', error);
        // Ensure sampleKedaiData has menu_makanan property for filtering
        const sampleDataWithMenu = sampleKedaiData.map(kedai => ({
          ...kedai,
          menu_makanan: kedai.menu_makanan || []
        }));
        
        // Filter sample data based on filterType
        const filteredSampleData = sampleDataWithMenu.filter(k => 
          filterType === 'all' || 
          (filterType === 'minuman' && k.menu_makanan.some((m: any) => m.kategori_menu?.trim().toLowerCase() === 'minuman')) ||
          (filterType === 'cemilan' && k.menu_makanan.some((m: any) => m.kategori_menu?.trim().toLowerCase() === 'cemilan')) ||
          (filterType === 'makanan' && k.menu_makanan.some((m: any) => m.kategori_menu?.trim().toLowerCase() === 'makanan'))
        );
        
        console.log("Filtered sample data:", filteredSampleData);
        setKedaiList(filteredSampleData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKedaiData();
  // Rerun fetch when filterType changes
  }, [filterType]);

  useEffect(() => {
    // Apply search query filtering on the type-filtered list
    if (searchQuery.trim() === '') {
      setFilteredKedaiList(kedaiList);
    } else {
      const filtered = kedaiList.filter(kedai => 
        kedai.nama_kedai.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kedai.deskripsi_singkat.toLowerCase().includes(searchQuery.toLowerCase())
        // Optionally, search in menu items as well
        // || (kedai.menu_makanan && kedai.menu_makanan.some(menu => menu.nama_makanan.toLowerCase().includes(searchQuery.toLowerCase())))
      );
      setFilteredKedaiList(filtered);
    }
  }, [searchQuery, kedaiList]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Get the appropriate placeholder text based on filterType
  const getPlaceholderText = () => {
    switch(filterType) {
      case 'minuman':
        return 'Cari Minuman...';
      case 'cemilan':
        return 'Cari Cemilan...';
      case 'makanan':
      default:
        return 'Cari Makanan...';
    }
  };

  // Get the appropriate empty state text based on filterType
  const getEmptyStateText = () => {
    switch(filterType) {
      case 'minuman':
        return 'minuman';
      case 'cemilan':
        return 'cemilan';
      case 'makanan':
      default:
        return 'makanan';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder={getPlaceholderText()}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Kedai Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredKedaiList.map((kedai) => (
          <KedaiCard
            key={kedai.id}
            id={kedai.id}
            nama_kedai={kedai.nama_kedai}
            foto_url={kedai.foto_url}
            jam_buka={kedai.jam_buka}
            deskripsi_singkat={kedai.deskripsi_singkat}
            onClick={() => onKedaiSelect(kedai)}
          />
        ))}
      </div>

      {filteredKedaiList.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          Tidak ada kedai {getEmptyStateText()} yang ditemukan {searchQuery ? 'untuk pencarian ini' : ''}
        </div>
      )}
    </div>
  );
};

export default KedaiCardGrid;
