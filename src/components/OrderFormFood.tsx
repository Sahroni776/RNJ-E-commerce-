import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faTimes, faUtensils, faGlassWhiskey, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

interface OrderFormFoodProps {
  serviceName: string;
  menuItems: string[];
  formType: 'food' | 'drink';
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

// Harga default untuk demo
const MENU_PRICES: Record<string, number> = {
  'Nasi Goreng': 15000,
  'Mie Goreng': 12000,
  'Ayam Goreng': 18000,
  'Soto Ayam': 14000,
  'Es Teh': 5000,
  'Es Jeruk': 6000,
  'Kopi': 8000,
  'Air Mineral': 3000,
};

const OrderFormFood: React.FC<OrderFormFoodProps> = ({ serviceName, menuItems, formType, onClose, onSubmit }) => {
  const [selectedItem, setSelectedItem] = useState('');
  const [itemDetail, setItemDetail] = useState('');
  const [notes, setNotes] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [ongkir] = useState(5000); // Ongkir tetap

  // Memastikan total price diupdate saat komponen dimount
  useEffect(() => {
    if (menuItems.length > 0) {
      const defaultItem = menuItems[0];
      setSelectedItem(defaultItem);
      const price = MENU_PRICES[defaultItem] || 10000;
      setTotalPrice(price); // Set total price awal
      console.log('Initial total price set to:', price);
    }
  }, [menuItems]);

  // Update total price setiap kali quantity atau selectedItem berubah
  useEffect(() => {
    if (selectedItem) {
      const price = MENU_PRICES[selectedItem] || 10000;
      const newTotal = price * quantity;
      setTotalPrice(newTotal);
      console.log('Total price updated to:', newTotal, 'for item:', selectedItem, 'quantity:', quantity);
    }
  }, [selectedItem, quantity]);

  const handleSelectedItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItem = e.target.value;
    setSelectedItem(newItem);
    setItemDetail('');
    const price = MENU_PRICES[newItem] || 10000;
    const newTotal = price * quantity;
    setTotalPrice(newTotal);
    console.log('Selected new item:', newItem, 'with price:', price, 'new total:', newTotal);
  };

  const increaseQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    const price = MENU_PRICES[selectedItem] || 10000;
    const newTotal = price * newQuantity;
    setTotalPrice(newTotal);
    console.log('Increased quantity to:', newQuantity, 'new total:', newTotal);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      const price = MENU_PRICES[selectedItem] || 10000;
      const newTotal = price * newQuantity;
      setTotalPrice(newTotal);
      console.log('Decreased quantity to:', newQuantity, 'new total:', newTotal);
    }
  };

  const handleShareLocation = () => {
    setLocationError(null);
    setLocation(null);
    setIsSharingLocation(true);

    if (!navigator.geolocation) {
      setLocationError('Fitur geolokasi tidak didukung oleh browser Anda. Mohon ketik alamat secara manual.');
      setIsSharingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
        setLocationError(null);
        setIsSharingLocation(false);
      },
      (error) => {
        let userMessage = 'Tidak dapat mengambil lokasi. Mohon coba lagi atau ketik alamat secara manual. Pastikan GPS dan izin lokasi aktif.';
        if (error.code === error.PERMISSION_DENIED) {
          userMessage = 'Anda telah menolak izin akses lokasi. Mohon aktifkan izin lokasi di pengaturan browser Anda atau ketik alamat secara manual.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          userMessage = 'Informasi lokasi tidak tersedia saat ini. Mohon coba lagi nanti atau ketik alamat secara manual. Pastikan GPS aktif.';
        } else if (error.code === error.TIMEOUT) {
          userMessage = 'Waktu permintaan lokasi habis. Mohon coba lagi, pastikan GPS dan izin lokasi aktif, atau ketik alamat secara manual.';
        }
        setLocationError(userMessage);
        setIsSharingLocation(false);
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 60000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location && !address) {
        setLocationError('Mohon bagikan lokasi Anda atau isi alamat pengantaran.');
        return;
    }
    
    // Membuat pesan untuk WhatsApp
    const itemPrice = MENU_PRICES[selectedItem] || 10000;
    const formattedPrice = formatPrice(itemPrice);
    const formattedTotal = formatPrice(totalPrice);
    const formattedOngkir = formatPrice(ongkir);
    const formattedGrandTotal = formatPrice(totalPrice + ongkir);
    
    let message = `*Pesanan Baru dari ${name}*\n\n`;
    message += `*Menu:* ${selectedItem}\n`;
    message += `*Harga:* ${formattedPrice}\n`;
    message += `*Jumlah:* ${quantity}\n`;
    message += `*Total Harga:* ${formattedTotal}\n`;
    message += `*Ongkir:* ${formattedOngkir}\n`;
    message += `*Total Pembayaran:* ${formattedGrandTotal}\n`;
    
    if (itemDetail) {
      message += `*Detail:* ${itemDetail}\n`;
    }
    
    if (notes) {
      message += `*Catatan:* ${notes}\n`;
    }
    
    if (address) {
      message += `*Alamat:* ${address}\n`;
    }
    
    if (location) {
      message += `*Lokasi:* https://www.google.com/maps?q=${location.lat},${location.lon}\n`;
    }
    
    // Encode pesan untuk URL WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/083844736762?text=${encodedMessage}`;
    
    // Buka WhatsApp di tab baru
    window.open(whatsappUrl, '_blank');
    
    const formData = {
      serviceName,
      selectedItem,
      itemDetail,
      quantity,
      totalPrice,
      ongkir,
      grandTotal: totalPrice + ongkir,
      notes,
      name,
      address,
      location,
      formType
    };
    
    onSubmit(formData);
    setSelectedItem(menuItems.length > 0 ? menuItems[0] : '');
    setItemDetail('');
    setNotes('');
    setName('');
    setAddress('');
    setLocation(null);
    setLocationError(null);
    setQuantity(1);
    setTotalPrice(0);
  };

  const locationLink = location
    ? `https://www.google.com/maps?q=${location.lat},${location.lon}`
    : '';

  const formIcon = formType === 'food' ? faUtensils : faGlassWhiskey;

  // Format price to Indonesian Rupiah
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Menghitung grand total (harga total + ongkir)
  const grandTotal = totalPrice + ongkir;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Close form"
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>
        <h3 className="text-2xl font-semibold mb-4 text-blue-600 flex items-center">
          <FontAwesomeIcon icon={formIcon} className="mr-2" />
          {serviceName}
        </h3>
        <p className="text-gray-800 mb-6 font-medium">Pilih menu dan isi detail pemesanan Anda.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="menuItem" className="block text-sm font-bold text-gray-800 mb-1">Pilih Menu</label>
            <select
              id="menuItem"
              value={selectedItem}
              onChange={handleSelectedItemChange}
              required
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {menuItems.length === 0 && <option value="" disabled>Tidak ada menu</option>}
              {menuItems.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          {selectedItem && (
            <>
              <div>
                <label htmlFor="itemDetail" className="block text-sm font-bold text-gray-800 mb-1">
                  Detail untuk {selectedItem} (misal: jenis, varian, dll.)
                </label>
                <input
                  type="text"
                  id="itemDetail"
                  value={itemDetail}
                  onChange={(e) => setItemDetail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`${selectedItem} yang mau dibeli dan lokasinya di mana?`}
                />
              </div>

              <div className="border-2 border-gray-400 rounded-lg p-4 bg-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-800">{selectedItem}</span>
                  <span className="font-bold text-gray-800">{formatPrice(MENU_PRICES[selectedItem] || 10000)}</span>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border-2 border-gray-400 rounded-md overflow-hidden">
                    <button 
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className={`px-3 py-1 ${quantity <= 1 ? 'bg-gray-300 text-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <span className="px-4 py-1 bg-white text-center min-w-[40px] font-bold">{quantity}</span>
                    <button 
                      type="button"
                      onClick={increaseQuantity}
                      className="px-3 py-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                  <div className="font-bold text-blue-700 text-lg">
                    {formatPrice(totalPrice)}
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <label htmlFor="notes" className="block text-xs font-medium text-gray-700 mb-1">Catatan Tambahan (Opsional)</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={1}
              className="w-full px-2 py-1 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-gray-800 mb-1">Nama Pemesan</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-bold text-gray-800 mb-1">Alamat Pengantaran (jika tidak share lokasi)</label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Isi alamat jika Anda tidak menggunakan fitur Share Lokasi"
            />
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleShareLocation}
              disabled={isSharingLocation}
              className={`px-4 py-2 rounded-md transition-colors flex items-center justify-center space-x-2 ${isSharingLocation ? 'bg-gray-400 cursor-not-allowed' : (location ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700')}`}
            >
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-white" />
              <span className="text-white font-bold">
                {isSharingLocation ? 'Mencari Lokasi...' : (location ? 'Lokasi Dibagikan!' : 'Share Lokasi (Recommended)')}
              </span>
            </button>
            {location && <span className="text-green-600 text-sm font-bold">Lokasi berhasil dibagikan!</span>}
          </div>
          {locationError && <p className="text-red-600 text-sm mt-1 font-bold">{locationError}</p>}
          {locationLink && (
             <p className="text-xs text-gray-700 mt-1 font-medium">Link Lokasi: <a href={locationLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{locationLink}</a></p>
          )}

          {/* Ringkasan Pembayaran dengan warna kontras tinggi */}
          <div className="border-2 border-gray-500 pt-4 mt-4 bg-gray-800 p-4 rounded-lg text-white">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-white text-base">Total Harga:</span>
              <span className="text-lg font-bold text-white">{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-white text-base">Ongkir:</span>
              <span className="text-lg font-bold text-white">{formatPrice(ongkir)}</span>
            </div>
            <div className="border-t border-gray-500 pt-2 mt-2"></div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-white text-lg">Total Pembayaran:</span>
              <span className="text-xl font-bold text-yellow-300">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold transition-colors flex items-center justify-center space-x-2 text-lg"
          >
            <span>Pesan Sekarang</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderFormFood;
