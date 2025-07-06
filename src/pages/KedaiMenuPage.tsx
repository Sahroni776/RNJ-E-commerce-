import { useState, useMemo, useEffect } from 'react';
import { Kedai, MenuMakanan, BuyerInfo } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Plus, Minus, MapPin, ShoppingCart, ArrowLeft } from 'lucide-react';
import { KedaiFilterType } from '../components/KedaiCardGrid'; // Import the filter type

interface KedaiMenuPageProps {
  kedai: Kedai;
  onBack: () => void;
  filterType: KedaiFilterType; // Add filterType prop
}

const KedaiMenuPage: React.FC<KedaiMenuPageProps> = ({ kedai, onBack, filterType }) => {
  // Filter menu items based on filterType
  const availableMenus = useMemo(() => {
    if (!kedai.menu_makanan) return [];
    
    console.log("Filtering menus with filterType:", filterType);
    console.log("Available menu items before filtering:", kedai.menu_makanan);
    
    let filteredMenus = [];
    
    if (filterType === 'minuman') {
      filteredMenus = kedai.menu_makanan.filter(menu => menu.kategori_menu?.trim().toLowerCase() === 'minuman' && menu.tersedia);
    } else if (filterType === 'cemilan') {
      // Show only snack items with kategori_menu exactly 'Makanan Ringan'
      filteredMenus = kedai.menu_makanan.filter(menu => menu.kategori_menu?.trim().toLowerCase() === 'makanan ringan' && menu.tersedia);
    } else if (filterType === 'makanan') {
      // Show only main food items with kategori_menu exactly 'Makanan Utama'
      filteredMenus = kedai.menu_makanan.filter(menu => menu.kategori_menu?.trim().toLowerCase() === 'makanan utama' && menu.tersedia);
    } else {
      // Default to showing all available items if filterType is 'all' or undefined
      filteredMenus = kedai.menu_makanan.filter(menu => menu.tersedia);
    }
    
    console.log("Filtered menu items:", filteredMenus);
    return filteredMenus;
  }, [kedai.menu_makanan, filterType]);

  const [selectedMenu, setSelectedMenu] = useState<MenuMakanan | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [menuQuantities, setMenuQuantities] = useState<Record<string, number>>({});
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({
    nama: ".",
    alamat: ".",
    catatan: ""
  });

  // Set initial selected menu based on filtered list
  useEffect(() => {
    if (availableMenus.length > 0) {
      setSelectedMenu(availableMenus[0]);
    } else {
      setSelectedMenu(null); // No menu available for this filter type
    }
  }, [availableMenus]);

  // Calculate total price using useMemo based on availableMenus
  const calculatedTotal = useMemo(() => {
    let total = 0;
    availableMenus.forEach(menu => {
      total += menu.harga * (menuQuantities[menu.id] || 0);
    });
    return total;
  }, [menuQuantities, availableMenus]);

  const handleMenuSelect = (menu: MenuMakanan) => {
    setSelectedMenu(menu);
  };

  const handleOpenOrderModal = () => {
    // Initialize quantities only for available menu items to 0
    const initialQuantities: Record<string, number> = {};
    availableMenus.forEach(menu => {
      initialQuantities[menu.id] = menuQuantities[menu.id] || 0; // Keep existing quantities if modal was opened before
    });
    setMenuQuantities(initialQuantities);
    setShowOrderModal(true);
  };

  const handleDecreaseQuantity = (menuId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setMenuQuantities(prev => {
      const currentQty = prev[menuId] || 0;
      const newQty = Math.max(0, currentQty - 1);
      
      return {
        ...prev,
        [menuId]: newQty
      };
    });
  };

  const handleIncreaseQuantity = (menuId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setMenuQuantities(prev => {
      const currentQty = prev[menuId] || 0;
      return {
        ...prev,
        [menuId]: currentQty + 1
      };
    });
  };

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setBuyerInfo({
            ...buyerInfo,
            lokasi: {
              lat: position.coords.latitude,
              lon: position.coords.longitude
            }
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Gagal mendapatkan lokasi. Pastikan Anda mengizinkan akses lokasi.');
        }
      );
    } else {
      alert('Browser Anda tidak mendukung geolokasi.');
    }
  };

  const handleSendOrder = () => {
    // Validasi input
    if (!buyerInfo.nama.trim() || buyerInfo.nama === '.') {
      alert('Silakan masukkan nama Anda');
      return;
    }
    
    if ((!buyerInfo.alamat.trim() || buyerInfo.alamat === '.') && !buyerInfo.lokasi) {
      alert('Silakan masukkan alamat atau bagikan lokasi Anda');
      return;
    }

    // Validasi pesanan using availableMenus
    const totalItems = availableMenus.reduce((sum, menu) => sum + (menuQuantities[menu.id] || 0), 0);
    if (totalItems === 0) {
      alert(`Silakan pilih minimal satu ${getMenuTypeText()}`);
      return;
    }
    
    // Hitung total harga (gunakan calculatedTotal)
    const totalHarga = calculatedTotal;
    
    // Format pesan WhatsApp
    const orderTypeText = getOrderTypeText();
    let message = `*Pesanan Baru ${orderTypeText} - ${kedai.nama_kedai}*\n-----------------------------------\n`;
    message += `*Detail Pesanan:*\n`;
    
    // Tambahkan detail menu yang dipesan from availableMenus
    availableMenus.forEach(menu => {
      const quantity = menuQuantities[menu.id] || 0;
      if (quantity > 0) {
        message += `- ${menu.nama_makanan} (${quantity}x): Rp ${(menu.harga * quantity).toLocaleString('id-ID')}\n`;
      }
    });
    
    message += `\n*Total Harga:* Rp ${totalHarga.toLocaleString('id-ID')}\n`;
    message += `*Ongkir:* Rp ${kedai.ongkir_tetap.toLocaleString('id-ID')}\n`;
    message += `*Total Pembayaran:* Rp ${(totalHarga + kedai.ongkir_tetap).toLocaleString('id-ID')}\n\n`;
    message += `*Nama Pembeli:* ${buyerInfo.nama}\n`;
    message += `*Alamat:* ${buyerInfo.alamat === "." ? "." : buyerInfo.alamat}\n`; // Handle default value
    if (buyerInfo.catatan) {
      message += `*Catatan Tambahan:* ${buyerInfo.catatan}\n`;
    }
    
    // Tambahkan link Google Maps jika ada lokasi
    if (buyerInfo.lokasi) {
      const mapsLink = `https://www.google.com/maps?q=${buyerInfo.lokasi.lat},${buyerInfo.lokasi.lon}`;
      message += `*Lokasi:* ${mapsLink}\n`;
    }
    
    message += `-----------------------------------\nMohon segera diproses. Terima kasih!`;
    
    // Encode pesan untuk URL WhatsApp
    const encodedMessage = encodeURIComponent(message);
    
    // Nomor WhatsApp admin (gunakan nomor dari database jika tersedia)
    const adminPhoneNumber = '6283844736762'; // Ganti dengan nomor admin yang sebenarnya
    
    // Buat URL WhatsApp
    const whatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${encodedMessage}`;
    
    // Buka WhatsApp di tab baru
    window.open(whatsappUrl, '_blank');
    
    // Tutup modal setelah mengirim pesanan
    setShowOrderModal(false);
  }; 
  
  // Helper functions to get text based on filterType
  const getMenuTypeText = () => {
    switch(filterType) {
      case 'minuman':
        return 'minuman';
      case 'cemilan':
        return 'cemilan';
      case 'makanan':
      default:
        return 'menu';
    }
  };

  const getOrderTypeText = () => {
    switch(filterType) {
      case 'minuman':
        return 'Minuman';
      case 'cemilan':
        return 'Cemilan';
      case 'makanan':
      default:
        return 'Makanan';
    }
  };

  const menuTitle = `Pilih ${getOrderTypeText()}`;
  const orderButtonText = `Pesan ${getOrderTypeText()}`;

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-gray-900 font-sans">
      <main className="space-y-4 max-w-4xl mx-auto relative z-20 px-3">
        {/* Large Food Image with Overlay Back Button */}
        <section className="bg-white rounded-t-xl shadow-sm overflow-hidden">
          <div className="w-full h-64 relative">
            {/* Modern Back Button Overlay */}
            <button 
              onClick={onBack}
              className="absolute top-4 left-4 z-30 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50"
              aria-label="Kembali"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            {selectedMenu ? (
              <img 
                src={selectedMenu.foto_makanan_url} 
                alt={selectedMenu.nama_makanan}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/assets/icons_new/default_kedai.jpeg';
                }}
              />
            ) : (
              // Show kedai image if no menu is selected or available
              <img 
                src={kedai.foto_url} 
                alt={kedai.nama_kedai}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/assets/icons_new/default_kedai.jpeg';
                }}
              />
            )}
          </div>          
          {/* Menu Description */}
          <div className="p-4">
            <h2 className="text-lg font-medium text-gray-900">
              {selectedMenu ? selectedMenu.nama_makanan : kedai.nama_kedai}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {selectedMenu ? selectedMenu.deskripsi_makanan : kedai.deskripsi_singkat}
            </p>
            {selectedMenu && (
              <div className="mt-2 text-lg font-bold text-orange-600">
                Rp {selectedMenu.harga.toLocaleString('id-ID')}
              </div>
            )}
          </div>
          
          {/* Horizontal Menu Selector - Uses availableMenus */}
          {availableMenus.length > 0 ? (
            <div className="border-t border-gray-100 pt-3 pb-4 px-2">
              <h3 className="text-sm font-medium text-gray-700 mb-2 px-2">{menuTitle}:</h3>
              <div className="overflow-x-auto pb-2">
                <div className="flex space-x-2 px-2 min-w-max">
                  {availableMenus.map((menu) => (
                    <div 
                      key={menu.id} 
                      className={`flex-shrink-0 w-28 border rounded-md overflow-hidden cursor-pointer transition-all ${
                        selectedMenu?.id === menu.id ? 'border-orange-500 shadow-sm' : 'border-gray-200'
                      }`}
                      onClick={() => handleMenuSelect(menu)}
                    >
                      <div className="h-20 w-full">
                        <img 
                          src={menu.foto_makanan_url} 
                          alt={menu.nama_makanan}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/assets/icons_new/default_kedai.jpeg';
                          }}
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-medium text-gray-900 line-clamp-1">{menu.nama_makanan}</p>
                        <p className="text-xs text-orange-600 mt-1">Rp {menu.harga.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="border-t border-gray-100 p-4 text-center text-gray-500">
              Tidak ada {getMenuTypeText()} yang tersedia di kedai ini.
            </div>
          )}
          
          {/* Kedai Name, Address and Order Button */}
          <div className="border-t border-gray-100 p-4">
            <div className="mb-4"> 
              <h2 className="text-lg font-semibold text-gray-800 mb-1">{kedai.nama_kedai}</h2>
              <h3 className="text-sm font-medium text-gray-700">Alamat Kedai:</h3>
              <p className="text-sm text-gray-600 mt-1">{kedai.alamat || "Alamat tidak tersedia"}</p>
            </div>
            {/* Disable button if no menus are available */} 
            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleOpenOrderModal}
              disabled={availableMenus.length === 0}
            >
              {orderButtonText}
            </Button>
          </div>
        </section>
      </main>

      {/* Order Modal - Uses availableMenus */}
      <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center">
              Pemesanan {getOrderTypeText()} - {kedai.nama_kedai}
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-2">
            {/* Menu List with Quantity Controls */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">{menuTitle}:</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {availableMenus.map((menu) => (
                  <div key={menu.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 flex-shrink-0">
                        <img 
                          src={menu.foto_makanan_url} 
                          alt={menu.nama_makanan}
                          className="w-full h-full object-cover rounded-md"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/assets/icons_new/default_kedai.jpeg';
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-gray-800">{menu.nama_makanan}</p>
                        <p className="text-sm font-medium text-orange-600">Rp {menu.harga.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button 
                        type="button"
                        className="bg-red-500 hover:bg-red-600 text-white rounded-l-lg p-2 transition-all duration-200 ease-in-out shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={(e) => handleDecreaseQuantity(menu.id, e)}
                        disabled={!(menuQuantities[menu.id] > 0)}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <div className="w-12 text-center py-1.5 border-t border-b border-gray-300 font-semibold text-gray-900 bg-white">
                        {menuQuantities[menu.id] > 0 ? menuQuantities[menu.id] : "-"}
                      </div>
                      <button 
                        type="button"
                        className="bg-green-500 hover:bg-green-600 text-white rounded-r-lg p-2 transition-all duration-200 ease-in-out shadow-sm"
                        onClick={(e) => handleIncreaseQuantity(menu.id, e)}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Total Price */}
            <div className="mb-6 mt-4 bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg shadow-inner">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Ringkasan Pesanan</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Total Harga:</span>
                  <span className="font-medium text-gray-800">Rp {calculatedTotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Ongkir:</span>
                  <span className="font-medium text-gray-800">Rp {kedai.ongkir_tetap.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200 text-gray-800 font-semibold">
                  <span>Total Pembayaran:</span>
                  <span className="text-orange-600">Rp {(calculatedTotal + kedai.ongkir_tetap).toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>
            
            {/* Buyer Information Form */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700">Informasi Pembeli:</h4>
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">Nama</label>
                <Input 
                  id="name"
                  type="text"
                  placeholder="Masukkan nama Anda"
                  value={buyerInfo.nama === '.' ? '' : buyerInfo.nama}
                  onChange={(e) => setBuyerInfo({...buyerInfo, nama: e.target.value})}
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-xs font-medium text-gray-700 mb-1">Alamat</label>
                        <Textarea
                id="address"
                placeholder="Masukkan alamat pengiriman"
                value={buyerInfo.alamat === "." ? "" : buyerInfo.alamat}
                onChange={(e) => setBuyerInfo({...buyerInfo, alamat: e.target.value})}
                className="w-full"
                rows={3}
              />
            </div>

            <div>
              <Button 
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                onClick={handleShareLocation}
              >
                  <MapPin className="h-4 w-4" />
                  <span>Bagikan Lokasi</span>
                </Button>
                {buyerInfo.lokasi && (
                  <p className="text-xs text-green-600 mt-1">
                    Lokasi berhasil dibagikan! ({buyerInfo.lokasi.lat.toFixed(6)}, {buyerInfo.lokasi.lon.toFixed(6)})
                  </p>
                )}
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="mt-6">
              <Button 
                type="button"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 flex items-center justify-center gap-2"
                onClick={handleSendOrder}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Pesan</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KedaiMenuPage;
