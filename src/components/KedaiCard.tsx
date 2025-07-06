import React from 'react';

interface KedaiCardProps {
  id: string;
  nama_kedai: string;
  foto_url: string;
  jam_buka: string;
  deskripsi_singkat: string;
  onClick: () => void;
}

const KedaiCard: React.FC<KedaiCardProps> = ({
  nama_kedai,
  foto_url,
  jam_buka,
  deskripsi_singkat,
  onClick
}) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md"
      onClick={onClick}
    >
      <div className="h-32 w-full relative">
        <img 
          src={foto_url} 
          alt={nama_kedai}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/assets/icons_new/default_kedai.jpeg';
          }}
        />
        {/* Jam buka sebagai overlay di bagian bawah gambar dengan latar biru */}
        <div className="absolute bottom-0 left-0 bg-blue-500 text-white px-3 py-1 text-sm font-medium">
          Pukul {jam_buka}
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">{nama_kedai}</h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{deskripsi_singkat}</p>
        {/* Jam buka dipindahkan ke overlay, jadi dihapus dari sini */}
      </div>
    </div>
  );
};

export default KedaiCard;
