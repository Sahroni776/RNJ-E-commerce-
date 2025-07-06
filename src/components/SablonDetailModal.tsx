
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SablonItem } from '@/types'; // Use SablonItem type
import { supabase } from '@/lib/supabase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareFromSquare, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

interface SablonDetailModalProps {
  item: SablonItem | null;
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to format currency (Keep for potential future use or remove if no price)
// const formatCurrency = (amount: number) => {
//   if (typeof amount !== 'number' || !isFinite(amount)) {
//     console.error('Invalid amount passed to formatCurrency:', amount);
//     return 'Rp -'; // Return a placeholder
//   }
//   return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
// };

const SablonDetailModal: React.FC<SablonDetailModalProps> = ({ item, isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', address: '', notes: '' }); // Added notes field
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  // const [totalPrice, setTotalPrice] = useState(0); // Remove price state if not applicable

  // Reset form and quantity when modal opens or item changes
  useEffect(() => {
    if (isOpen && item) {
      setFormData({ name: '', address: '', notes: '' });
      setQuantity(1);
      setLocation(null);
      // setTotalPrice(item.harga || 0); // Adjust if price exists
    } else if (!isOpen) {
      // Optionally reset when closing
      setFormData({ name: '', address: '', notes: '' });
      setQuantity(1);
      setLocation(null);
      // setTotalPrice(0);
    }
  }, [isOpen, item]);

  // Update total price when quantity or item changes (Remove if no price)
  // useEffect(() => {
  //   if (item && item.harga) {
  //     setTotalPrice(item.harga * quantity);
  //   }
  // }, [quantity, item]);

  if (!item) return null;

  // Construct the public URL for the photo from 'sablon' bucket
  let photoUrl = 
    item.foto && (item.foto.startsWith("http://") || item.foto.startsWith("https://"))
      ? item.foto
      : supabase.storage.from("sablon").getPublicUrl(item.foto || '').data?.publicUrl || '';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change)); // Ensure quantity is at least 1
  };

  const handleShareLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Tidak dapat mengakses lokasi Anda. Pastikan izin lokasi diaktifkan.');
          setIsGettingLocation(false);
        }
      );
    } else {
      alert('Geolocation tidak didukung oleh browser Anda.');
      setIsGettingLocation(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address) {
      alert('Mohon lengkapi Nama dan Alamat.');
      return;
    }

    const adminPhoneNumber = '6283844736762'; // Use the consistent admin number
    let message = `*Pemesanan Sablon*\n--------------------------\n`;
    message += `Item: ${item.nama}\n`;
    // message += `Harga Satuan: ${formatCurrency(item.harga || 0)}\n`; // Include if price exists
    message += `Jumlah: ${quantity}\n`;
    // message += `*Total Harga: ${formatCurrency(totalPrice)}*\n`; // Include if price exists
    message += `--------------------------\n`;
    message += `Nama Pemesan: ${formData.name}\n`;
    message += `Alamat Pengiriman: ${formData.address}\n`;
    if (formData.notes) {
        message += `Catatan: ${formData.notes}\n`;
    }
    if (location) {
      const mapsLink = `https://www.google.com/maps?q=${location.lat},${location.lon}`;
      message += `Lokasi (Map): ${mapsLink}\n`;
    }

    message += `--------------------------\nMohon segera diproses. Terima kasih!`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');

    onClose(); // Close modal after submission
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Apply scroll and max height here */}
      <DialogContent className="sm:max-w-[600px] p-0 bg-white rounded-xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Photo Section - Use object-contain */}
        <div className="relative h-64 md:h-80 w-full bg-gray-100 flex items-center justify-center">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={item.nama}
              className="w-auto h-full object-contain max-h-full mx-auto"
              onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Foto+Error'; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <p className="text-gray-500">Foto tidak tersedia</p>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* Name and Price (Price removed) */}
          <div className="flex justify-between items-start">
             <h2 className="text-2xl font-bold text-gray-800">{item.nama}</h2>
             {/* <p className="text-xl font-semibold text-green-600 whitespace-nowrap ml-4">{formatCurrency(item.harga || 0)}</p> */}
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm">{item.deskripsi}</p>

          {/* Order Form */}
          <div className="bg-white rounded-lg pt-4">
            <h3 className="font-semibold mb-4 text-lg text-gray-700">Form Pemesanan</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div>
                <Label htmlFor="sablon-name" className="text-gray-600">Nama Pemesan</Label>
                <Input
                  id="sablon-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama Anda"
                  required
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1"
                />
              </div>

              {/* Quantity Input - ADDED */}
              <div>
                <Label htmlFor="sablon-quantity" className="text-gray-600">Jumlah</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Button type="button" variant="outline" size="icon" onClick={() => handleQuantityChange(-1)} className="border-gray-300">
                    <FontAwesomeIcon icon={faMinus} />
                  </Button>
                  <Input
                    id="sablon-quantity"
                    name="quantity"
                    type="number"
                    value={quantity}
                    readOnly // Display only, controlled by buttons
                    className="w-16 text-center border-gray-300"
                  />
                  <Button type="button" variant="outline" size="icon" onClick={() => handleQuantityChange(1)} className="border-gray-300">
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                </div>
              </div>

              {/* Total Price Display (Removed) */}
               {/* <div>
                 <Label className="text-gray-600">Total Harga</Label>
                 <p className="text-lg font-semibold text-green-700 mt-1">{formatCurrency(totalPrice)}</p>
               </div> */}

              {/* Address Input */}
              <div>
                <Label htmlFor="sablon-address" className="text-gray-600">Alamat Pengiriman</Label>
                <Textarea
                  id="sablon-address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Masukkan alamat lengkap pengiriman"
                  required
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1"
                />
              </div>

              {/* Location Sharing */}
              <div>
                <Label htmlFor="sablon-location" className="text-gray-600">Lokasi Pengiriman (Opsional)</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleShareLocation}
                    disabled={isGettingLocation}
                    className="flex items-center border-blue-500 text-blue-600 hover:bg-blue-50"
                  >
                    <FontAwesomeIcon icon={faShareFromSquare} className="mr-2" />
                    {isGettingLocation ? 'Mendapatkan Lokasi...' : 'Bagikan Lokasi Saat Ini'}
                  </Button>
                  {location && (
                    <span className="text-green-600 text-sm">
                      Lokasi berhasil ditambahkan!
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Bagikan lokasi Anda jika sama dengan alamat pengiriman.</p>
              </div>

              {/* Notes Input - ADDED */}
              <div>
                <Label htmlFor="sablon-notes" className="text-gray-600">Catatan (Opsional)</Label>
                <Textarea
                  id="sablon-notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Misal: Ukuran kaos L, Warna Hitam"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1"
                />
              </div>

              {/* Submit Button */}
              <DialogFooter className="pt-4">
                 <DialogClose asChild>
                    <Button type="button" variant="outline">Batal</Button>
                 </DialogClose>
                 <Button
                    type="submit"
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Pesan
                  </Button>
              </DialogFooter>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SablonDetailModal;

