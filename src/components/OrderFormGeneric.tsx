import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faTimes, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

interface OrderFormGenericProps {
  serviceName: string;
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

const OrderFormGeneric: React.FC<OrderFormGenericProps> = ({ serviceName, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isSharingLocation, setIsSharingLocation] = useState(false);

  const handleShareLocation = async () => {
    setLocationError(null);
    setLocation(null); // Reset location before attempting to get a new one
    setIsSharingLocation(true);

    if (!navigator.geolocation) {
      setLocationError("Fitur geolokasi tidak didukung oleh browser Anda. Mohon ketik alamat secara manual.");
      setIsSharingLocation(false);
      return;
    }

    try {
      // Attempt to get current position. This call itself will trigger the browser's permission prompt.
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
          setLocationError(null); // Clear any previous error
          setIsSharingLocation(false);
        },
        async (error) => {
          let userMessage = "Gagal mendapatkan lokasi. Mohon coba lagi atau ketik alamat secara manual.";
          if (error.code === error.PERMISSION_DENIED) {
            userMessage = "Akses lokasi ditolak. Mohon izinkan akses lokasi untuk situs ini di pengaturan browser Anda (misalnya, 'Izinkan saat menggunakan aplikasi' atau 'Izinkan sekali ini').";
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            userMessage = "Informasi lokasi tidak tersedia. Pastikan GPS (Layanan Lokasi) di perangkat Anda aktif dan coba lagi.";
          } else if (error.code === error.TIMEOUT) {
            userMessage = "Waktu permintaan lokasi habis. Pastikan GPS (Layanan Lokasi) di perangkat Anda aktif dan sinyal stabil, lalu coba lagi.";
          }
          setLocationError(userMessage);
          setIsSharingLocation(false);

          // Provide more specific guidance based on permission state after the error
          try {
            const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
            if (permissionStatus.state === 'denied') {
              alert("Akses lokasi ditolak secara permanen. Untuk menggunakan fitur ini, Anda perlu mengaktifkan izin lokasi untuk situs ini secara manual di pengaturan browser atau perangkat Anda.");
            } else if (permissionStatus.state === 'prompt') {
              alert("Permintaan izin lokasi telah muncul. Mohon berikan izin agar aplikasi dapat mengakses lokasi Anda.");
            }
          } catch (permError) {
            console.error("Error querying geolocation permission after initial error:", permError);
          }
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 } // Request high accuracy, no cached position
      );
    } catch (error) {
      console.error("Error initiating geolocation request:", error);
      setLocationError("Terjadi kesalahan saat memulai permintaan lokasi. Mohon coba lagi.");
      setIsSharingLocation(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location && !address) { // Check if either location or address is provided
        setLocationError("Mohon bagikan lokasi Anda atau isi alamat lengkap.");
        return;
    }
    const formData: any = {
      serviceName,
      name,
      address,
      notes,
      location,
      formType: "generic"
    };
    if (serviceName === "Sablon Baju") {
      formData.quantity = quantity;
    }
    onSubmit(formData);
    setName("");
    setAddress("");
    setNotes("");
    setQuantity(1);
    setLocation(null);
    setLocationError(null);
  };

  const locationLink = location
    ? `https://www.google.com/maps?q=${location.lat},${location.lon}`
    : "";

  let notesLabel = "Catatan Tambahan (Opsional)";
  if (["Sablon Baju", "Mebel", "Katering", "Kue Tar / Tumpeng", "Rias Pengantin", "Dekorasi Pernikahan", "Tenda Acara", "Sound Sistem"].includes(serviceName)) {
    notesLabel = "Deskripsikan Pesanan / Request Pelanggan";
  } else if (serviceName === "Servis Kompor") {
    notesLabel = "Deskripsi Kerusakan";
  } else if (serviceName === "Beli Jamu") {
    notesLabel = "Rasa sakit yang di alami";
  }

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

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
        <h3 className="text-2xl font-semibold mb-4 text-blue-600">Pesan Jasa: {serviceName}</h3>
        <p className="text-gray-600 mb-6">Silakan isi detail pemesanan Anda di bawah ini.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
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
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap (jika tidak share lokasi)</label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Isi alamat jika Anda tidak menggunakan fitur Share Lokasi"
            />
          </div>

          {serviceName === "Sablon Baju" && (
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Jumlah Kaos</label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800"
                  aria-label="Kurangi jumlah"
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="w-16 px-3 py-1 text-center bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800"
                  aria-label="Tambah jumlah"
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="notes" className="block text-xs font-medium text-gray-700 mb-1">{notesLabel}</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={1}
              placeholder={serviceName === "Beli Jamu" ? "Contoh: Sakit kepala, pegal-pegal, masuk angin" : "Contoh: Request khusus, detail acara, dll."}
              className="w-full px-2 py-1 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              required={[
                "Sablon Baju",
                "Mebel",
                "Katering",
                "Kue Tar / Tumpeng",
                "Servis Kompor",
                "Beli Jamu",
                "Rias Pengantin", 
                "Dekorasi Pernikahan", 
                "Tenda Acara", 
                "Sound Sistem"
              ].includes(serviceName)}
            />
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleShareLocation}
              disabled={isSharingLocation}
              className={`px-4 py-2 rounded-md text-white transition-colors flex items-center justify-center space-x-2 ${isSharingLocation ? "bg-gray-400 cursor-not-allowed" : (location ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700")}`}
            >
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <span>{isSharingLocation ? "Mencari Lokasi..." : (location ? "Lokasi Dibagikan!" : "Share Lokasi (Recommended)")}</span>
            </button>
            {location && <span className="text-green-600 text-sm">Lokasi berhasil dibagikan!</span>}
          </div>
          {locationError && <p className="text-red-600 text-sm mt-1 font-medium">{locationError}</p>}
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

export default OrderFormGeneric;

