import React from 'react';
import { KateringItem } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase'; // Import supabase client

interface KateringCardProps {
  item: KateringItem;
  onClick: () => void;
}

// Helper function to format currency
const KateringCard: React.FC<KateringCardProps> = ({ item, onClick }) => {
  // Construct the public URL for the photo
  const { data: urlData } = supabase.storage.from("foto-katering").getPublicUrl(item.foto);
  const photoUrl = urlData?.publicUrl || ""; // Use empty string as fallback

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
            onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/300x200?text=Foto+Error"; }} // Placeholder on error
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <p className="text-gray-500 text-sm">Foto tidak tersedia</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col"> {/* Use flex-grow */}
        <CardTitle className="text-lg font-semibold mb-2 text-gray-800 truncate">{item.nama}</CardTitle>
        <p className="text-base font-medium text-green-600 mb-3">{item.harga}</p>
        {/* Description removed as per user request */}
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto"> {/* Push footer to bottom */}
        <Button 
          className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-medium rounded-lg py-2 shadow-md hover:shadow-lg transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click when button is clicked
            onClick(); // Still trigger the main click action
          }}
        >
          Lihat Detail & Pesan
        </Button>
      </CardFooter>
    </Card>
  );
};

export default KateringCard;

