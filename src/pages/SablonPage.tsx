
import React, { useState, useEffect, useRef } from 'react';
import { Container } from '@/components/ui/container';
import SablonCardGrid from '@/components/SablonCardGrid'; // To be created/modified
import SablonDetailModal from '@/components/SablonDetailModal'; // To be created/modified
import { SablonItem } from '@/types';
import { getSablonCategories, getAllSablonItems, getSablonItemsByCategory, supabase } from '@/lib/supabase'; // Added supabase import
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Upload } from 'lucide-react'; // Removed ShareFromSquare
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Keep FontAwesome if used elsewhere or replace
import { faShareFromSquare as faShareFromSquareSolid } from '@fortawesome/free-solid-svg-icons';

interface SablonPageProps {
  onBack: () => void;
}

const SablonPage: React.FC<SablonPageProps> = ({ onBack }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [itemList, setItemList] = useState<SablonItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<SablonItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for custom request form (similar to MebelPage)
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestFormData, setRequestFormData] = useState({
    name: '',
    address: '',
    description: '',
  });
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getSablonCategories();
        setCategories(['Semua', ...fetchedCategories]);
      } catch (err: any) {
        console.error('[SablonPage] Error fetching categories:', err);
        setError(`Gagal memuat kategori: ${err.message || 'Unknown error'}`);
      }
    };
    fetchCategories();
  }, []);

  // Fetch items when selected category changes
  useEffect(() => {
    // Don't fetch if showing request form
    if (showRequestForm) return;

    const fetchItems = async () => {
      console.log(`[SablonPage] Attempting to fetch sablon items for category: ${selectedCategory}`);
      try {
        setIsLoading(true);
        setError(null);
        let data;
        if (selectedCategory === 'Semua') {
          data = await getAllSablonItems();
        } else {
          data = await getSablonItemsByCategory(selectedCategory);
        }
        console.log(`[SablonPage] Fetched sablon data for ${selectedCategory}:`, data);
        if (data) {
          setItemList(data);
        } else {
          setItemList([]);
        }
        setIsLoading(false);
      } catch (err: any) {
        console.error(`[SablonPage] Error fetching sablon items for ${selectedCategory}:`, err);
        setError(`Gagal memuat data sablon: ${err.message || 'Unknown error'}`);
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [selectedCategory, showRequestForm]); // Add showRequestForm dependency

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setShowRequestForm(false); // Go back to gallery view when category changes
  };

  const handleCardClick = (item: SablonItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    setShowRequestForm(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // --- Handlers for Custom Request Form --- 
  const handleRequestCustom = () => {
    setShowRequestForm(true);
    setIsModalOpen(false);
    setSelectedItem(null);
    setRequestFormData({ name: '', address: '', description: '' });
    setLocation(null);
    setUploadedImage(null);
    setImagePreview(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToGallery = () => {
    setShowRequestForm(false);
    setSelectedCategory('Semua'); // Optionally reset category
  };

  const handleRequestInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRequestFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestFormData.name || !requestFormData.address) {
      alert('Mohon lengkapi data nama dan alamat.');
      return;
    }
    if (!uploadedImage) {
      alert('Mohon upload foto/desain yang diinginkan.');
      return;
    }

    // 1. Upload image to Supabase Storage
    const fileExt = uploadedImage.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `request_sablon/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('sablon') // Use the 'sablon' bucket as requested
        .upload(filePath, uploadedImage);

      if (uploadError) {
        throw uploadError;
      }

      // 2. Construct WhatsApp message including image path (or URL if needed)
      const adminPhoneNumber = '6283844736762'; // Replace with actual admin number if different
      let message = `*Request Custom Sablon*\n-----------------------------------\n`;
      message += `Nama: ${requestFormData.name}\n`;
      message += `Alamat: ${requestFormData.address}\n`;
      if (requestFormData.description) {
        message += `Deskripsi Request: ${requestFormData.description}\n`;
      }
      if (location) {
        const mapsLink = `https://www.google.com/maps?q=${location.lat},${location.lon}`;
        message += `Lokasi: ${mapsLink}\n`;
      }
      message += `\nFoto/Desain telah diupload ke: ${filePath}\n`; // Inform admin about the uploaded file path
      message += `-----------------------------------\nMohon segera diproses. Terima kasih!`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');

      // Reset form
      setShowRequestForm(false);
      setRequestFormData({ name: '', address: '', description: '' });
      setLocation(null);
      setUploadedImage(null);
      setImagePreview(null);
      alert('Request custom sablon berhasil dikirim!');

    } catch (error: any) {
      console.error('Error submitting custom sablon request:', error);
      alert(`Gagal mengirim request: ${error.message}`);
    }
  };
  // --- End Handlers for Custom Request Form ---

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white py-4 px-4 sticky top-0 z-10 shadow-md">
        <Container>
          <div className="flex items-center justify-between">
            <Button
              className="rounded-full p-3 shadow-lg bg-gradient-to-r from-blue-500 to-teal-500 text-white border-0 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={onBack}
            >
              <ArrowLeft size={24} strokeWidth={2.5} />
            </Button>
            <h1 className="text-xl font-semibold text-gray-700">Menu Sablon Baju</h1>
            <div></div>
          </div>
        </Container>
      </div>

      {/* Category Menu Bar - Only show if not in request form */}
      {!showRequestForm && (
        <div className="bg-white py-2 px-4 shadow-sm sticky top-[76px] z-9 overflow-x-auto whitespace-nowrap mb-4">
          <Container className="flex space-x-2">
            {categories.length > 1 ? (
              categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className={`rounded-full px-4 py-1 h-8 text-sm transition-colors duration-200 ${selectedCategory === category ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </Button>
              ))
            ) : (
              <p className="text-sm text-gray-500">Memuat kategori...</p>
            )}
          </Container>
        </div>
      )}

      {/* Content Area */}
      <Container className="py-6">
        {showRequestForm ? (
          // --- Custom Request Form --- 
          <div className="space-y-6">
            <div className="bg-white shadow-md rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-purple-800">Request Desain Custom</h2>
                 <Button
                   variant="outline"
                   onClick={handleBackToGallery}
                   className="flex items-center justify-center px-4 py-2 rounded-full border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                 >
                   <ArrowLeft size={18} className="mr-2" />
                   Kembali ke Galeri
                 </Button>
               </div>

              <form onSubmit={handleRequestSubmit} className="space-y-4">
                {/* Image Upload */}
                <div>
                  <Label htmlFor="upload-image" className="font-medium text-gray-700">Upload Foto/Desain Contoh</Label>
                  <div className="mt-2 flex flex-col items-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                      id="upload-image"
                    />
                    {imagePreview ? (
                      <div className="relative w-full max-w-sm mx-auto mb-2 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-auto object-contain max-h-[300px]"
                        />
                        <Button
                          type="button"
                          onClick={triggerFileInput}
                          className="absolute bottom-2 right-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
                          aria-label="Ganti Gambar"
                        >
                           <Edit size={18} />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        onClick={triggerFileInput}
                        variant="outline"
                        className="bg-gray-50 hover:bg-gray-100 text-gray-600 w-full h-40 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center p-4"
                      >
                        <Upload size={30} className="mb-2 text-gray-400" />
                        <span className="text-sm">Klik untuk upload foto/desain</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Name Input */}
                <div>
                  <Label htmlFor="request-name" className="font-medium text-gray-700">Nama Pemesan</Label>
                  <Input
                    id="request-name"
                    name="name"
                    value={requestFormData.name}
                    onChange={handleRequestInputChange}
                    placeholder="Masukkan nama Anda"
                    required
                    className="mt-1"
                  />
                </div>

                {/* Address Input */}
                <div>
                  <Label htmlFor="request-address" className="font-medium text-gray-700">Alamat Pengiriman</Label>
                  <Textarea
                    id="request-address"
                    name="address"
                    value={requestFormData.address}
                    onChange={handleRequestInputChange}
                    placeholder="Masukkan alamat lengkap pengiriman"
                    required
                    className="mt-1"
                  />
                </div>

                 {/* Location Sharing */}
                 <div>
                   <Label htmlFor="request-location" className="font-medium text-gray-700">Lokasi Pengiriman (Opsional)</Label>
                   <div className="flex items-center space-x-2 mt-1">
                     <Button
                       type="button"
                       variant="outline"
                       onClick={handleShareLocation}
                       disabled={isGettingLocation}
                       className="flex items-center border-blue-500 text-blue-600 hover:bg-blue-50"
                     >
                       <FontAwesomeIcon icon={faShareFromSquareSolid} className="mr-2" />
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

                {/* Description Input */}
                <div>
                  <Label htmlFor="request-description" className="font-medium text-gray-700">Deskripsi Request (Opsional)</Label>
                  <Textarea
                    id="request-description"
                    name="description"
                    value={requestFormData.description}
                    onChange={handleRequestInputChange}
                    placeholder="Jelaskan detail sablon yang Anda inginkan (misal: warna kaos, ukuran, posisi sablon)"
                    rows={4}
                    className="mt-1"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Kirim Request Custom Sablon
                </Button>
              </form>
            </div>
          </div>
          // --- End Custom Request Form ---
        ) : isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Memuat data sablon...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64 bg-red-50 rounded-lg p-4">
            <p className="text-red-500">Error: {error}</p>
          </div>
        ) : itemList.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-muted-foreground">Tidak ada item sablon yang tersedia untuk kategori 
              <span className='font-semibold'> "{selectedCategory}"</span>
            </p>
          </div>
        ) : (
          // --- Gallery View ---
          <div className="space-y-4">
            <div className="flex justify-end items-center">
               <Button
                 variant="outline"
                 onClick={handleRequestCustom}
                 className="flex items-center justify-center px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
               >
                 <Edit size={18} className="mr-2" />
                 Request Desain Custom
               </Button>
             </div>
             <SablonCardGrid
               itemList={itemList}
               onCardClick={handleCardClick}
             />
           </div>
           // --- End Gallery View ---
        )}

        <SablonDetailModal
          item={selectedItem}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </Container>
    </div>
  );
};

export default SablonPage;

