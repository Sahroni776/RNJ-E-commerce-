import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faShareFromSquare } from '@fortawesome/free-solid-svg-icons';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

interface DekorasiPernikahanFoto {
  id: number;
  url_foto: string;
}

const DekorasiPernikahanPage = ({ onBack }: { onBack: () => void }) => {
  const [photos, setPhotos] = useState<DekorasiPernikahanFoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<DekorasiPernikahanFoto | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    address: '',
    notes: '',
  });
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dekorasi_pengantin_foto')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        setPhotos(data);
      }
    } catch (error) {
      console.error('Error fetching dekorasi pernikahan photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoClick = (photo: DekorasiPernikahanFoto) => {
    setSelectedPhoto(photo);
    setShowForm(true);
    // Scroll to top when a photo is selected
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    
    if (!formData.name || !formData.date || !formData.address) {
      alert('Mohon lengkapi data nama, tanggal, dan alamat.');
      return;
    }

    const adminPhoneNumber = '6283844736762';
    let message = `*Pemesanan Dekorasi Pernikahan*\n-----------------------------------\n`;
    message += `Nama: ${formData.name}\n`;
    message += `Tanggal Pemesanan: ${formData.date}\n`;
    message += `Alamat: ${formData.address}\n`;
    
    if (formData.notes) {
      message += `Catatan/Request: ${formData.notes}\n`;
    }
    
    if (location) {
      const mapsLink = `https://www.google.com/maps?q=${location.lat},${location.lon}`;
      message += `Lokasi: ${mapsLink}\n`;
    }
    
    if (selectedPhoto) {
      message += `Referensi Foto: ${selectedPhoto.url_foto}\n`;
    }
    
    message += `-----------------------------------\nMohon segera diproses. Terima kasih!`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // Reset form after submission
    setFormData({
      name: '',
      date: '',
      address: '',
      notes: '',
    });
    setLocation(null);
    setShowForm(false);
  };

  const handleBackToGallery = () => {
    setShowForm(false);
    setSelectedPhoto(null);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-gray-900 p-4 md:p-8 font-sans">
      <header className="mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          <span className="font-medium">Kembali</span>
        </Button>
      </header>

      <main className="space-y-6 max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center py-10">Memuat...</div>
        ) : showForm && selectedPhoto ? (
          // Form View
          <div className="space-y-6">
            {/* Selected Photo Display */}
            <div className="bg-white shadow-md rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Detail Dekorasi</h2>
                <Button 
                  variant="outline" 
                  onClick={handleBackToGallery}
                  className="flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                  <span className="font-medium">Kembali ke Galeri</span>
                </Button>
              </div>
              <img 
                src={selectedPhoto.url_foto} 
                alt="Dekorasi Pernikahan" 
                className="w-full h-auto rounded-lg object-cover max-h-[400px]"
              />
            </div>

            {/* Order Form */}
            <div className="bg-white shadow-md rounded-xl p-4">
              <h2 className="font-semibold mb-4">Form Pemesanan</h2>
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
                  <Label htmlFor="date">Tanggal Pemesanan</Label>
                  <Input 
                    id="date" 
                    name="date" 
                    type="date" 
                    value={formData.date} 
                    onChange={handleInputChange} 
                    required 
                  />
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
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Pesan Sekarang
                </Button>
              </form>
            </div>
          </div>
        ) : (
          // Gallery View - Single Row Cards with Enhanced Styling
          <div className="bg-white shadow-md rounded-xl p-4">
            <div className="overflow-x-auto pb-4">
              <div className="flex space-x-6 min-w-max p-2">
                {photos.map((photo) => (
                  <div 
                    key={photo.id} 
                    className="cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex-shrink-0 w-64 transform hover:-translate-y-1 border border-purple-100"
                    onClick={() => handlePhotoClick(photo)}
                    style={{
                      background: 'linear-gradient(to bottom, #f9f9f9, #ffffff)'
                    }}
                  >
                    <div className="h-56 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent z-10"></div>
                      <img 
                        src={photo.url_foto} 
                        alt="Dekorasi Pernikahan" 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <div className="p-4 bg-white">
                      <Button 
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg py-2 shadow-md hover:shadow-lg transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePhotoClick(photo);
                        }}
                      >
                        Pesan
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DekorasiPernikahanPage;
