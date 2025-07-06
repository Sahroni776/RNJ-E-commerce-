import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ProdukKueTumpeng, KuePemesanInfo } from '@/types';
import { MapPin } from 'lucide-react';

interface KueDetailModalProps {
  produk: ProdukKueTumpeng | null;
  isOpen: boolean;
  onClose: () => void;
}

const KueDetailModal: React.FC<KueDetailModalProps> = ({ produk, isOpen, onClose }) => {
  const [pemesanInfo, setPemesanInfo] = useState<KuePemesanInfo>({
    nama: '',
    alamat: '',
    catatan: '',
    lokasi: undefined
  });
  const [isLoading, setIsLoading] = useState(false);
  const [locationShared, setLocationShared] = useState(false);

  if (!produk) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPemesanInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleShareLocation = () => {
    setIsLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPemesanInfo(prev => ({
            ...prev,
            lokasi: { lat: latitude, lon: longitude }
          }));
          setLocationShared(true);
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
          alert('Gagal mendapatkan lokasi. Silakan coba lagi atau isi alamat secara manual.');
        }
      );
    } else {
      setIsLoading(false);
      alert('Browser Anda tidak mendukung fitur berbagi lokasi.');
    }
  };

  const handleWhatsAppOrder = () => {
    if (!pemesanInfo.nama || !pemesanInfo.alamat) {
      alert('Silakan isi nama dan alamat terlebih dahulu.');
      return;
    }

    const phoneNumber = '083844736762';
    let message = `Halo, saya ingin memesan:\n\n`;
    message += `Produk: ${produk.nama_produk}\n`;
    message += `Harga: Rp ${produk.harga.toLocaleString('id-ID')}\n\n`;
    message += `Nama: ${pemesanInfo.nama}\n`;
    message += `Alamat: ${pemesanInfo.alamat}\n`;
    
    if (pemesanInfo.catatan && pemesanInfo.catatan.trim() !== '') {
      message += `Catatan: ${pemesanInfo.catatan}\n`;
    }
    
    if (pemesanInfo.lokasi) {
      message += `Lokasi: https://maps.google.com/?q=${pemesanInfo.lokasi.lat},${pemesanInfo.lokasi.lon}\n`;
    }
    
    message += `\nTerima kasih!`;

    // Format phone number (remove leading 0 and add country code if needed)
    const formattedPhone = phoneNumber.startsWith('0') 
      ? `62${phoneNumber.substring(1)}` 
      : phoneNumber;
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-white border border-gray-200 shadow-xl">
        <DialogHeader className="border-b border-gray-100 pb-2">
          <DialogTitle className="text-xl font-bold text-gray-800">{produk.nama_produk}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="rounded-md overflow-hidden mb-4 border border-gray-100">
            <img 
              src={produk.url_foto} 
              alt={produk.nama_produk}
              className="w-full h-64 object-cover"
            />
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-green-600">
              Rp {produk.harga.toLocaleString('id-ID')}
            </h3>
            <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-600 mt-2">
              {produk.kategori}
            </span>
            <p className="mt-3 text-sm text-gray-600">{produk.deskripsi}</p>
          </div>
          
          <div className="border-t border-gray-100 pt-4">
            <h4 className="font-medium mb-3 text-gray-800">Informasi Pemesan</h4>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="nama" className="text-sm font-medium text-gray-700">
                  Nama
                </label>
                <Input
                  id="nama"
                  name="nama"
                  placeholder="Masukkan nama Anda"
                  value={pemesanInfo.nama}
                  onChange={handleInputChange}
                  className="mt-1 border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label htmlFor="alamat" className="text-sm font-medium text-gray-700">
                  Alamat
                </label>
                <Textarea
                  id="alamat"
                  name="alamat"
                  placeholder="Masukkan alamat lengkap Anda"
                  value={pemesanInfo.alamat}
                  onChange={handleInputChange}
                  className="mt-1 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  rows={3}
                />
              </div>
              
              <div>
                <label htmlFor="catatan" className="text-sm font-medium text-gray-700 flex items-center">
                  Catatan <span className="text-xs text-gray-500 ml-1">(opsional)</span>
                </label>
                <Textarea
                  id="catatan"
                  name="catatan"
                  placeholder="Masukkan catatan tambahan jika ada"
                  value={pemesanInfo.catatan}
                  onChange={handleInputChange}
                  className="mt-1 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  rows={2}
                />
              </div>
              
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2 border-gray-300 text-gray-700 hover:bg-green-50"
                onClick={handleShareLocation}
                disabled={isLoading || locationShared}
              >
                <MapPin size={16} className="text-green-500" />
                {locationShared ? 'Lokasi Telah Dibagikan' : 'Bagikan Lokasi'}
              </Button>
              
              <Button
                type="button"
                className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all"
                onClick={handleWhatsAppOrder}
              >
                Pesan via WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KueDetailModal;
