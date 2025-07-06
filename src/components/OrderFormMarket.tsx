import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faTimes, faShoppingBasket } from '@fortawesome/free-solid-svg-icons';

interface OrderFormMarketProps {
  serviceName: string; // Should be "Belanja ke Pasar"
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

const OrderFormMarket: React.FC<OrderFormMarketProps> = ({ serviceName, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [shoppingList, setShoppingList] = useState('');
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isSharingLocation, setIsSharingLocation] = useState(false);

  const handleShareLocation = () => {
    setLocationError(null);
    setIsSharingLocation(true);
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setIsSharingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
        setIsSharingLocation(false);
      },
      (error) => {
        setLocationError(`Unable to retrieve location: ${error.message}`);
        setIsSharingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      serviceName,
      name,
      address,
      shoppingList,
      location,
      formType: 'market'
    };
    onSubmit(formData);
    setName('');
    setAddress('');
    setShoppingList('');
    setLocation(null);
    setLocationError(null);
  };

  const locationLink = location
    ? `https://www.google.com/maps?q=${location.lat},${location.lon}`
    : '';

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
           <FontAwesomeIcon icon={faShoppingBasket} className="mr-2" />
           {serviceName}
        </h3>
        <p className="text-gray-600 mb-6">Tuliskan daftar belanjaan dan detail pemesanan Anda.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Pemesan</label>
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
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Alamat Pengantaran</label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={3}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="shoppingList" className="block text-sm font-medium text-gray-700 mb-1">Barang yang ingin dibeli</label>
            <textarea
              id="shoppingList"
              value={shoppingList}
              onChange={(e) => setShoppingList(e.target.value)}
              required
              rows={4}
              placeholder="Contoh:&#10;1. Bawang Merah 1/4 kg&#10;2. Cabai Rawit Merah 1 ons&#10;3. Tempe 2 papan"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleShareLocation}
              disabled={isSharingLocation}
              className={`px-4 py-2 rounded-md text-white transition-colors flex items-center justify-center space-x-2 ${isSharingLocation ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <span>{isSharingLocation ? 'Mencari Lokasi...' : (location ? 'Lokasi Dibagikan' : 'Share Lokasi')}</span>
            </button>
            {location && <span className="text-blue-600 text-sm">Lokasi berhasil dibagikan!</span>}
          </div>
          {locationError && <p className="text-red-600 text-sm mt-1">{locationError}</p>}
          {locationLink && (
             <p className="text-xs text-gray-500 mt-1">Link Lokasi: <a href={locationLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{locationLink}</a></p>
          )}

          <button
            type="submit"
            className="w-full mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            <span>Pesan</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderFormMarket;

