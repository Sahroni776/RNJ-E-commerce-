
import React from 'react';
import { SablonItem } from '@/types'; // Use SablonItem type
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase'; // Import supabase client

interface SablonCardProps {
  item: SablonItem;
  onClick: () => void;
}

// Helper function to format currency (Removed as price is not applicable)
// const formatCurrency = (amount: number) => { ... };

const SablonCard: React.FC<SablonCardProps> = ({ item, onClick }) => {
  // Check if item.foto is already a full URL
  let photoUrl = 
    item.foto && (item.foto.startsWith("http://") || item.foto.startsWith("https://"))
      ? item.foto
      : supabase.storage.from("sablon").getPublicUrl(item.foto || '').data?.publicUrl || '';

  // Remove the debugging div
  return (
    <Card
      className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col h-full bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-xl transform hover:-translate-y-1"
      onClick={onClick}
    >
      <CardHeader className="p-0 relative h-48 md:h-56"> {/* Adjusted height */}
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={item.nama}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Foto+Error'; }} // Placeholder on error
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <p className="text-gray-500 text-sm">Foto tidak tersedia</p>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col"> {/* Use flex-grow */}
        <CardTitle className="text-lg font-semibold mb-2 text-gray-800 truncate">{item.nama}</CardTitle>
        <p className="text-sm text-gray-600 line-clamp-2">{item.deskripsi}</p> {/* Display description */}
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto"> {/* Push footer to bottom */}
        <Button
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-medium rounded-lg py-2 shadow-md hover:shadow-lg transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click when button is clicked
            onClick(); // Still trigger the main click action
          }}
        >
          Pesan
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SablonCard;

