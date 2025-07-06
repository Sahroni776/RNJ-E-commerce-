import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faShareFromSquare } from '@fortawesome/free-solid-svg-icons';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

// Define the interface for Tenda items based on user requirements
interface TendaItem {
  id: number;
  nama: string;
  foto: string; // URL to the photo in Supabase storage
  deskripsi: string;
}

const TendaPage = ({ onBack }: { onBack: () => void }) => {
  const [tendaItems, setTendaItems] = useState<TendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTendaItem, setSelectedTendaItem] = useState<TendaItem | null>(null);
  const [showForm, setShowForm] = useState(false); // Reusing state to show detail/form view
  const [formData, setFormData] = useState({
    name: '',
    date: '', // Changed label to 'Tanggal Acara'
    address: '',
  });
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    fetchTendaItems();
  }, []);

  const fetchTendaItems = async () => {
    try {
      setLoading(true);
      // Fetch data from the 'tenda' table
      const { data, error } = await supabase
        .from('tenda')
        .select('id, nama, foto, deskripsi');

      if (error) {
        console.error('Supabase fetch error:', error);
        throw error;
      }

      console.log('Raw data from Supabase:', data); // Log raw data

      if (data) {
        // Construct the full public URL for each photo from Supabase storage
        const itemsWithFullUrls = data.map(item => {
          console.log(`Processing item ${item.id}, foto path: ${item.foto}`); // Log item path
          // Ensure item.foto is not null or empty before getting URL
          if (!item.foto) {
            console.warn(`Item ${item.id} has missing foto path.`);
            return {
              ...item,
              foto: '' // Assign empty string or a placeholder URL
            };
          }
          // Correctly get public URL - Supabase JS v2 getPublicUrl returns { data: { publicUrl: string } }
          const { data: urlData } = supabase.storage.from("foto-tenda").getPublicUrl(item.foto);
          
          console.log(`Generated URL data for ${item.foto}:`, urlData); // Log generated URL data
          
          return {
            ...item,
            foto: urlData?.publicUrl || '' // Fallback to empty string if URL generation fails or path is invalid
          };
        });
        console.log('Items with processed URLs:', itemsWithFullUrls); // Log final items
        setTendaItems(itemsWithFullUrls);
      }
    } catch (error) {
      console.error('Error fetching tenda items:', error);
      // Optionally, show an error message to the user
    } finally {
      setLoading(false);
    }
  };

  const handleTendaClick = (item: TendaItem) => {
    setSelectedTendaItem(item);
    setShowForm(true);
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
      alert('Mohon lengkapi data nama, tanggal acara, dan alamat.');
      return;
    }

    const adminPhoneNumber = '6283844736762'; // Same admin number as requested
    let message = `*Pemesanan Tenda*\n--------------------------\n`;
    if (selectedTendaItem) {
        message += `Tenda: ${selectedTendaItem.nama}\n`;
        // Use a placeholder if the photo URL is empty
        const photoRef = selectedTendaItem.foto ? selectedTendaItem.foto : 'Foto tidak tersedia';
        message += `Foto Ref: ${photoRef}\n`; 
    }
    message += `Nama Pemesan: ${formData.name}\n`;
    message += `Tanggal Acara: ${formData.date}\n`;
    message += `Alamat Acara: ${formData.address}\n`;

    if (location) {
      const mapsLink = `https://www.google.com/maps?q=${location.lat},${location.lon}`;
      message += `Lokasi (Map): ${mapsLink}\n`;
    }

    message += `--------------------------\nMohon segera diproses. Terima kasih!`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');

    // Reset form after submission
    setFormData({
      name: '',
      date: '',
      address: '',
    });
    setLocation(null);
    setShowForm(false);
    setSelectedTendaItem(null); // Also reset selected item
  };

  const handleBackToGallery = () => {
    setShowForm(false);
    setSelectedTendaItem(null);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-gray-900 p-4 md:p-8 font-sans">
      <header className="mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          <span className="font-medium">Kembali</span>
        </Button>
      </header>

      <main className="space-y-6 max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center py-10">Memuat data tenda...</div>
        ) : showForm && selectedTendaItem ? (
          // Detail & Form View
          <div className="space-y-6">
            {/* Selected Tenda Display */}
            <div className="bg-white shadow-md rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                {/* Title removed as per user request */}
                <Button
                  variant="outline"
                  onClick={handleBackToGallery}
                  className="flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                  <span className="font-medium">Kembali ke Galeri</span>
                </Button>
              </div>
              {selectedTendaItem.foto ? (
                 <img
                  src={selectedTendaItem.foto}
                  alt={`Tenda ${selectedTendaItem.nama}`}
                  className="w-full h-auto rounded-lg object-cover max-h-[450px] mb-4"
                  onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Foto+Tidak+Tersedia'; }} // Add placeholder on error
                 />
              ) : (
                 <div className="w-full h-[450px] flex items-center justify-center bg-gray-200 rounded-lg mb-4">
                   <p className="text-gray-500">Foto tidak tersedia</p>
                 </div>
              )}
             
              <h3 className="font-semibold text-lg mb-2 text-gray-800">{selectedTendaItem.nama}</h3>
              <p className="text-gray-700 mb-6">{selectedTendaItem.deskripsi}</p>

              {/* Order Form */}
              <div className="bg-white shadow-inner rounded-lg p-4">
                <h3 className="font-semibold mb-4 text-lg">Form Pemesanan</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nama Pemesan</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Masukkan nama Anda"
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="date">Tanggal Acara</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Alamat Acara</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Masukkan alamat lengkap acara"
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Lokasi Acara (Opsional)</Label>
                    <div className="flex items-center space-x-2">
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
                     <p className="text-xs text-gray-500 mt-1">Bagikan lokasi Anda saat ini jika sama dengan lokasi acara.</p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Pesan via WhatsApp
                  </Button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          // Gallery View - Adapted for Tenda
          <div className="bg-white shadow-md rounded-xl p-4">
             <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Galeri Tenda</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {tendaItems.map((item) => (
                <div
                  key={item.id}
                  className="cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col bg-white border border-gray-200 transform hover:-translate-y-1"
                  onClick={() => handleTendaClick(item)}
                >
                  <div className="h-56 overflow-hidden relative">
                    {item.foto ? (
                      <img
                        src={item.foto}
                        alt={`Tenda ${item.nama}`}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Foto+Tidak+Tersedia'; }} // Add placeholder on error
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <p className="text-gray-500">Foto tidak tersedia</p>
                      </div>
                    )}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-semibold text-lg mb-2 text-gray-800 truncate">{item.nama}</h3>
                    {/* Description removed from card view as per user request */}
                    <Button
                      className="w-full mt-auto bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-medium rounded-lg py-2 shadow-md hover:shadow-lg transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the outer div's onClick
                        handleTendaClick(item);
                      }}
                    >
                      Lihat Detail & Pesan
                    </Button>
                  </div>
                </div>
              ))}
            </div>
             {tendaItems.length === 0 && !loading && (
                <p className="text-center text-gray-500 py-10">Belum ada data tenda yang tersedia.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default TendaPage;

