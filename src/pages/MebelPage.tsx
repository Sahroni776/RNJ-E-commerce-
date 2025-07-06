import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faShareFromSquare, faPlus, faMinus, faEdit, faUpload } from '@fortawesome/free-solid-svg-icons';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

interface Mebel {
  id: number;
  nama_mebel: string;
  foto: string;
  deskripsi: string;
}

const MebelPage = ({ onBack }: { onBack: () => void }) => {
  const [mebelItems, setMebelItems] = useState<Mebel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMebel, setSelectedMebel] = useState<Mebel | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    notes: '',
  });
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

  useEffect(() => {
    fetchMebelItems();
  }, []);

  const fetchMebelItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mebel')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        setMebelItems(data);
      }
    } catch (error) {
      console.error('Error fetching mebel items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMebelClick = (mebel: Mebel) => {
    setSelectedMebel(mebel);
    setShowForm(true);
    setShowRequestForm(false);
    setQuantity(1); // Reset quantity when selecting a new item
    // Scroll to top when a mebel item is selected
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRequestInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRequestFormData(prev => ({ ...prev, [name]: value }));
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleShareLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
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
      alert('Mohon lengkapi data nama dan alamat.');
      return;
    }

    const adminPhoneNumber = '6283844736762';
    let message = `*Pemesanan Mebel*\n-----------------------------------\n`;
    message += `Nama: ${formData.name}\n`;
    message += `Produk: ${selectedMebel?.nama_mebel}\n`;
    message += `Jumlah: ${quantity}\n`;
    message += `Alamat: ${formData.address}\n`;
    
    if (formData.notes) {
      message += `Catatan/Request: ${formData.notes}\n`;
    }
    
    if (location) {
      const mapsLink = `https://www.google.com/maps?q=${location.lat},${location.lon}`;
      message += `Lokasi: ${mapsLink}\n`;
    }
    
    message += `-----------------------------------\nMohon segera diproses. Terima kasih!`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // Reset form after submission
    setFormData({
      name: '',
      address: '',
      notes: '',
    });
    setLocation(null);
    setQuantity(1);
    setShowForm(false);
  };

  const handleRequestCustom = () => {
    setShowRequestForm(true);
    setShowForm(false);
    setSelectedMebel(null);
    // Reset request form data
    setRequestFormData({
      name: '',
      address: '',
      description: '',
    });
    setLocation(null);
    setUploadedImage(null);
    setImagePreview(null);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      
      // Create preview URL
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

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!requestFormData.name || !requestFormData.address) {
      alert('Mohon lengkapi data nama dan alamat.');
      return;
    }

    if (!uploadedImage) {
      alert('Mohon upload foto contoh mebel yang diinginkan.');
      return;
    }

    const adminPhoneNumber = '6283844736762';
    let message = `*Request Custom Mebel*\n-----------------------------------\n`;
    message += `Nama: ${requestFormData.name}\n`;
    message += `Alamat: ${requestFormData.address}\n`;
    
    if (requestFormData.description) {
      message += `Deskripsi Request: ${requestFormData.description}\n`;
    }
    
    if (location) {
      const mapsLink = `https://www.google.com/maps?q=${location.lat},${location.lon}`;
      message += `Lokasi: ${mapsLink}\n`;
    }
    
    message += `\nFoto contoh telah diupload. Mohon hubungi saya untuk detail lebih lanjut.\n`;
    message += `-----------------------------------\nMohon segera diproses. Terima kasih!`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // Reset form after submission
    setRequestFormData({
      name: '',
      address: '',
      description: '',
    });
    setLocation(null);
    setUploadedImage(null);
    setImagePreview(null);
    setShowRequestForm(false);
  };

  const handleBackToGallery = () => {
    setShowForm(false);
    setShowRequestForm(false);
    setSelectedMebel(null);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-gray-900 p-4 md:p-8 font-sans">
      <header className="mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          <span className="font-medium">Kembali</span>
        </Button>
      </header>

      <main className="space-y-6 max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center py-10">Memuat...</div>
        ) : showRequestForm ? (
          // Request Custom Form View
          <div className="space-y-6">
            <div className="bg-white shadow-md rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <Button 
                  variant="outline" 
                  onClick={handleBackToGallery}
                  className="flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                  <span className="font-medium">Kembali ke Galeri</span>
                </Button>
              </div>
              
              <h2 className="text-2xl font-bold text-purple-800 mb-4 text-center">Request Custom Mebel</h2>
              
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="upload-image">Upload Foto Contoh</Label>
                  <div className="mt-1 flex flex-col items-center">
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    {imagePreview ? (
                      <div className="relative w-full max-w-md mx-auto mb-2">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-auto rounded-lg object-cover shadow-md max-h-[300px]"
                        />
                        <Button
                          type="button"
                          onClick={triggerFileInput}
                          className="absolute bottom-2 right-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        onClick={triggerFileInput}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 w-full h-40 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center"
                      >
                        <FontAwesomeIcon icon={faUpload} className="text-3xl mb-2" />
                        <span>Klik untuk upload foto contoh</span>
                      </Button>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="name">Nama</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={requestFormData.name} 
                    onChange={handleRequestInputChange} 
                    placeholder="Masukkan nama Anda" 
                    required 
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Alamat</Label>
                  <Textarea 
                    id="address" 
                    name="address" 
                    value={requestFormData.address} 
                    onChange={handleRequestInputChange} 
                    placeholder="Masukkan alamat lengkap" 
                    required 
                  />
                </div>
                
                <div>
                  <Label htmlFor="location">Lokasi</Label>
                  <div className="flex items-center space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleShareLocation}
                      disabled={isGettingLocation}
                      className="flex items-center"
                    >
                      <FontAwesomeIcon icon={faShareFromSquare} className="mr-2" />
                      {isGettingLocation ? 'Mendapatkan Lokasi...' : 'Bagikan Lokasi'}
                    </Button>
                    {location && (
                      <span className="text-green-600 text-sm">
                        Lokasi berhasil ditambahkan
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Deskripsi Request (Opsional)</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={requestFormData.description} 
                    onChange={handleRequestInputChange} 
                    placeholder="Jelaskan detail mebel yang Anda inginkan" 
                    rows={4}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Kirim Request
                </Button>
              </form>
            </div>
          </div>
        ) : showForm && selectedMebel ? (
          // Detail and Form View
          <div className="space-y-6">
            {/* Selected Mebel Display */}
            <div className="bg-white shadow-md rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <Button 
                  variant="outline" 
                  onClick={handleBackToGallery}
                  className="flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                  <span className="font-medium">Kembali ke Galeri</span>
                </Button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <img 
                    src={selectedMebel.foto} 
                    alt={selectedMebel.nama_mebel} 
                    className="w-full h-auto rounded-lg object-cover shadow-md"
                  />
                </div>
                <div className="md:w-1/2">
                  <h2 className="text-2xl font-bold text-green-800 mb-2">{selectedMebel.nama_mebel}</h2>
                  <div className="prose prose-sm">
                    <p className="text-gray-700">{selectedMebel.deskripsi}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Form */}
            <div className="bg-white shadow-md rounded-xl p-4">
              <h2 className="font-semibold mb-4 text-xl text-center text-green-800">Form Pemesanan</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nama</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    placeholder="Masukkan nama Anda" 
                    required 
                  />
                </div>
                
                <div>
                  <Label htmlFor="quantity">Jumlah Pesanan</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Button 
                      type="button"
                      onClick={decreaseQuantity}
                      className="bg-green-600 hover:bg-green-700 text-white h-10 w-10 rounded-lg flex items-center justify-center"
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </Button>
                    <div className="bg-gray-100 h-10 px-4 rounded-lg flex items-center justify-center min-w-[60px] font-medium">
                      {quantity}
                    </div>
                    <Button 
                      type="button"
                      onClick={increaseQuantity}
                      className="bg-green-600 hover:bg-green-700 text-white h-10 w-10 rounded-lg flex items-center justify-center"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Alamat</Label>
                  <Textarea 
                    id="address" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleInputChange} 
                    placeholder="Masukkan alamat lengkap" 
                    required 
                  />
                </div>
                
                <div>
                  <Label htmlFor="location">Lokasi</Label>
                  <div className="flex items-center space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleShareLocation}
                      disabled={isGettingLocation}
                      className="flex items-center"
                    >
                      <FontAwesomeIcon icon={faShareFromSquare} className="mr-2" />
                      {isGettingLocation ? 'Mendapatkan Lokasi...' : 'Bagikan Lokasi'}
                    </Button>
                    {location && (
                      <span className="text-green-600 text-sm">
                        Lokasi berhasil ditambahkan
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="notes">Catatan (Opsional)</Label>
                  <Textarea 
                    id="notes" 
                    name="notes" 
                    value={formData.notes} 
                    onChange={handleInputChange} 
                    placeholder="Tambahkan catatan atau permintaan khusus" 
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Pesan Sekarang
                </Button>
              </form>
            </div>
          </div>
        ) : (
          // Gallery View - Vertical Cards
          <div className="bg-white shadow-md rounded-xl p-4">
            <div className="flex justify-end items-center mb-4">
              <Button 
                variant="outline" 
                onClick={handleRequestCustom}
                className="flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
              >
                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                <span className="font-medium">Request Desain Custom</span>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mebelItems.map((mebel) => (
                <div 
                  key={mebel.id} 
                  className="cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-100"
                  onClick={() => handleMebelClick(mebel)}
                  style={{
                    background: 'linear-gradient(to bottom, #f9f9f9, #ffffff)'
                  }}
                >
                  <div className="h-56 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent z-10"></div>
                    <img 
                      src={mebel.foto} 
                      alt={mebel.nama_mebel} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="font-medium text-center text-green-800 mb-2">{mebel.nama_mebel}</h3>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg py-2 shadow-md hover:shadow-lg transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMebelClick(mebel);
                      }}
                    >
                      Pesan
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MebelPage;
