import { useState } from 'react';
import './index.css';
import HomeServiceItem from './components/HomeServiceItem';
import AdvertisementBanner from './components/AdvertisementBannerSlide';
import ErrorBoundary from './components/ErrorBoundary';
import InstallButton from './components/InstallButton';
import { useAdvertisements } from './hooks/useAdvertisements';
import OrderFormGeneric from './components/OrderFormGeneric';
import OrderFormFood from './components/OrderFormFood';
import OrderFormMarket from './components/OrderFormMarket';
import KedaiListPage from './pages/KedaiListPage';
import KedaiMenuPage from './pages/KedaiMenuPage';
import DekorasiPernikahanPage from './pages/DekorasiPernikahanPage';
import MebelPage from './pages/MebelPage';
import KueMenuPage from './pages/KueMenuPage';
import TendaPage from './pages/TendaPage';
import KateringPage from './pages/KateringPage';
import SablonPage from './pages/SablonPage'; // Import SablonPage
import { Kedai } from './types';
import { KedaiFilterType } from './components/KedaiCardGrid';
import { faUtensils, faTshirt, faChair, faConciergeBell,
  faBirthdayCake, faShoppingBasket, faGlassWhiskey,
  faCookie, faFire, faHeart, faTent
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

// Define the interface for the BeforeInstallPromptEvent


const services: { [category: string]: { name: string; icon: IconDefinition | string; formType: string }[] } = {
  'Food & Beverage': [
    { name: 'Belanja Yuuk.', icon: faShoppingBasket, formType: 'market' },
    { name: 'Pesan Makan', icon: faUtensils, formType: 'food' },
    { name: 'Pesan Minum', icon: faGlassWhiskey, formType: 'drink' },
    { name: 'Pesan Cemilan', icon: faCookie, formType: 'food' },
  ],
  'Other Services': [
    { name: 'Servis Kompor', icon: faFire, formType: 'generic' },
    { name: 'Sablon Baju', icon: faTshirt, formType: 'sablon' },
    { name: 'Mebel Property', icon: faChair, formType: 'mebel' },
    { name: 'Pesan Katering', icon: faConciergeBell, formType: 'katering' },
    { name: 'Kue Tar / Tumpeng', icon: faBirthdayCake, formType: 'kue_menu' },
    { name: 'Dekorasi Pernikahan', icon: faHeart, formType: 'dekorasi_pernikahan' },
    { name: 'Tenda Acara', icon: faTent, formType: 'tenda' },
  ],
};

const foodMenuItems = [
  'Bakso', 'Nasi Goreng', 'Mie Ayam', 'Seblak', 'Angsle', 'Gorengan', 'Cihu', 'Martabak Manis', 'Martabak Telur', 'Roti Bakar', 'Somay', 'Tela Tela', 'Pentol', 'Cilok', 'Ayam Geprek', 'Ayam Bakar', 'Lalapan Ikan', 'Batagor', 'Campur', 'Rujak', 'Pecel', 'Nasi Kuning', 'Sate Ayam', 'Sate Kambing', 'Sate Sapi', 'Tahu Walik', 'Ayam Krispi', 'Ketan', 'Tape', 'Rawon', 'Soto', 'Nasi Belut', 'Tahu Sumedang', 'Pisang Kipas', 'Nasi Jagung', 'Nasi Campur', 'Nasi Rames', 'Gurame', 'Ikan Kakap', 'Ikan Lele', 'Kepiting', 'Ikan Nila', 'Rujak Cingur', 'Gule'
];
const drinkMenuItems = [
  'Es Teh', 'Es Jeruk', 'Kopi Hitam', 'Kopi Susu', 'Jus Alpukat', 'Jus Mangga', 'Air Mineral', 'Es Buah', 'Es Cincau', 'Es Dawet', 'Es Goder', 'Es Kelapa Muda', 'Tea', 'Susu', 'Jus Buah', 'Wedang Jahe', 'Es Milo', 'Capucino', 'Lemon Tea', 'Jasmine Tea', 'Minuman Mixue'
];
const snackMenuItems = [
  'Gorengan', 'Cireng', 'Cilok', 'Tahu Crispy', 'Pisang Goreng', 'Kentang Goreng', 'Tempe Mendoan', 'Bakwan', 'Risoles', 'Tahu Bakso', 'Siomay', 'Batagor', 'Pempek', 'Martabak Mini', 'Kue Cubit', 'Donat', 'Kripik Singkong', 'Kripik Pisang', 'Kripik Tempe', 'Seblak', 'Pentol', 'Tela-Tela', 'Tahu Walik', 'Tahu Petis', 'Onde-Onde', 'Klepon', 'Lupis', 'Putu Ayu', 'Kue Lumpur', 'Kue Lapis'
];

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentService, setCurrentService] = useState<{ name: string; formType: string } | null>(null);
  const [showKedaiList, setShowKedaiList] = useState(false);
  const [showKedaiMenu, setShowKedaiMenu] = useState(false);
  const [selectedKedai, setSelectedKedai] = useState<Kedai | null>(null);
  const [currentFilterType, setCurrentFilterType] = useState<KedaiFilterType>('makanan');
  const [showDekorasiPernikahan, setShowDekorasiPernikahan] = useState(false);
  const [showMebel, setShowMebel] = useState(false);
  const [showKueMenu, setShowKueMenu] = useState(false);
  const [showTenda, setShowTenda] = useState(false);
  const [showKatering, setShowKatering] = useState(false);
  const [showSablon, setShowSablon] = useState(false); // Add state for Sablon page

  const { advertisements } = useAdvertisements();
  const handleCardClick = (serviceName: string, formType: string) => {
    // Reset all page views first
    setShowKedaiList(false);
    setShowKedaiMenu(false);
    setShowDekorasiPernikahan(false);
    setShowSablon(false);
    setIsFormOpen(false);
    setCurrentService(null);

    // Handle specific page navigations
    if (serviceName === 'Pesan Makan') {
      setCurrentFilterType('makanan');
      setShowKedaiList(true);
      return;
    }
    if (serviceName === 'Pesan Minum') {
      setCurrentFilterType('minuman');
      setShowKedaiList(true);
      return;
    }
    if (serviceName === 'Pesan Cemilan') {
      setCurrentFilterType('cemilan');
      setShowKedaiList(true);
      return;
    }
    if (formType === 'dekorasi_pernikahan') {
      setShowDekorasiPernikahan(true);
      return;
    }
    if (formType === 'mebel') {
      setShowMebel(true);
      return;
    }
    if (formType === 'kue_menu') {
      setShowKueMenu(true);
      return;
    }
    if (formType === 'tenda') {
      setShowTenda(true);
      return;
    }
    if (formType === 'katering') {
      setShowKatering(true);
      return;
    }
    if (formType === 'sablon') { // Add condition for Sablon
      setShowSablon(true);
      return;
    }

    // Handle generic forms
    setCurrentService({ name: serviceName, formType });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentService(null);
  };

  const handleBackFromKedaiList = () => {
    setShowKedaiList(false);
  };

  const handleKedaiSelect = (kedai: Kedai) => {
    setSelectedKedai(kedai);
    setShowKedaiMenu(true);
  };

  const handleBackFromKedaiMenu = () => {
    setShowKedaiMenu(false);
    setSelectedKedai(null);
  };

  const handleBackFromDekorasiPernikahan = () => {
    setShowDekorasiPernikahan(false);
  };

  const handleBackFromMebel = () => {
    setShowMebel(false);
  };

  const handleBackFromKueMenu = () => {
    setShowKueMenu(false);
  };

  const handleBackFromTenda = () => {
    setShowTenda(false);
  };

  const handleBackFromKatering = () => {
    setShowKatering(false);
  };

  const handleBackFromSablon = () => { // Add back handler for Sablon
    setShowSablon(false);
  };

  const handleFormSubmit = (formData: any) => {
    const adminPhoneNumber = '6283844736762';
    let message = `*Pemesanan Baru - ${formData.serviceName}*\n-----------------------------------\n`;
    message += `Nama: ${formData.name}\n`;
    message += `Alamat: ${formData.address}\n`;
    const formType = formData.formType || currentService?.formType;
    if (formType === 'food' || formType === 'drink') {
      message += `Menu: ${formData.selectedItem}\n`;
    }
    if (formType === 'market') {
      message += `Daftar Belanja:\n${formData.shoppingList}\n`;
    }
    if (formData.notes) {
      message += `Catatan/Request: ${formData.notes}\n`;
    }
    // Note: Quantity for Sablon is handled within SablonDetailModal, not here.
    if (formData.location) {
      const mapsLink = `https://www.google.com/maps?q=${formData.location.lat},${formData.location.lon}`;
      message += `Lokasi: ${mapsLink}\n`;
    }
    message += `-----------------------------------\nMohon segera diproses. Terima kasih!`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    handleCloseForm();
  };

  const renderForm = () => {
    if (!isFormOpen || !currentService) return null;
    const { name, formType } = currentService;
    switch (formType) {
      case 'generic':
        return <OrderFormGeneric serviceName={name} onClose={handleCloseForm} onSubmit={handleFormSubmit} />;
      case 'food':
        if (name === 'Pesan Cemilan') {
          return <OrderFormFood serviceName={name} menuItems={snackMenuItems} formType="food" onClose={handleCloseForm} onSubmit={handleFormSubmit} />;
        }
        return <OrderFormFood serviceName={name} menuItems={foodMenuItems} formType="food" onClose={handleCloseForm} onSubmit={handleFormSubmit} />;
      case 'drink':
        return <OrderFormFood serviceName={name} menuItems={drinkMenuItems} formType="drink" onClose={handleCloseForm} onSubmit={handleFormSubmit} />;
      case 'market':
        return <OrderFormMarket serviceName={name} onClose={handleCloseForm} onSubmit={handleFormSubmit} />;
      default:
        return null;
    }
  };

  // --- Page Rendering Logic ---
  if (showSablon) {
    return <SablonPage onBack={handleBackFromSablon} />;
  }
  if (showKatering) {
    return <KateringPage onBack={handleBackFromKatering} />;
  }
  if (showTenda) {
    return <TendaPage onBack={handleBackFromTenda} />;
  }
  if (showKueMenu) {
    return <KueMenuPage onBack={handleBackFromKueMenu} />;
  }
  if (showMebel) {
    return <MebelPage onBack={handleBackFromMebel} />;
  }
  if (showDekorasiPernikahan) {
    return <DekorasiPernikahanPage onBack={handleBackFromDekorasiPernikahan} />;
  }
  if (showKedaiMenu && selectedKedai) {
    return <KedaiMenuPage kedai={selectedKedai} onBack={handleBackFromKedaiMenu} filterType={currentFilterType} />;
  }
  if (showKedaiList) {
    return <KedaiListPage onBack={handleBackFromKedaiList} onKedaiSelect={handleKedaiSelect} filterType={currentFilterType} />;
  }

  // --- Default Home Page Render ---
  return (
      <div className="min-h-screen bg-[#F5F5F5] text-gray-900 pb-4 px-4 md:pb-8 md:px-8 font-sans relative">
      {/* Install Button - Positioned at top right */}
      <div className="fixed top-4 right-4 z-50">
        <InstallButton className="shadow-lg" />
      </div>

      <header className="mb-6 md:mb-10 relative rounded-b-3xl overflow-hidden pb-10 md:pb-16" style={{ backgroundImage: 'url(/assets/new_background.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="relative z-10 p-6 pt-10 md:p-8 md:pt-12 text-center min-h-[100px]">
          {/* Header content if any */}
        </div>
      </header>

      <main className="space-y-6 max-w-4xl mx-auto -mt-32 md:-mt-36 relative z-20 px-4">
        {/* Food & Beverage Section */}        <section className="mb-6">
          <div className={`bg-white shadow-md rounded-xl p-3 md:p-4 transition-shadow duration-300 ease-in-out hover:shadow-lg`}>
            {/* Advertisement Banner menggantikan gambar anime */}
            <ErrorBoundary>
              <AdvertisementBanner 
                advertisements={advertisements}
                autoSlideInterval={3000}
                className="mb-3"
              />
            </ErrorBoundary>
            <h2 className="font-semibold mb-3 text-left text-base text-gray-800">Food & Beverage</h2>
            <div className="grid grid-cols-4 gap-2 md:gap-3">
              {services['Food & Beverage'].map((service, index) => {
                const colors = ['bg-orange-500', 'bg-orange-600', 'bg-orange-700', 'bg-orange-800'];
                return (
                  <HomeServiceItem
                    key={`Food & Beverage-${service.name}`}
                    icon={service.icon}
                    title={service.name}
                    onClick={() => handleCardClick(service.name, service.formType)}
                    color={colors[index % colors.length]}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* Other Service Sections */}
        {Object.entries(services)
          .filter(([category]) => category === 'Other Services')
          .map(([category, items]) => {
            const gridClasses = "grid grid-cols-4 gap-2 md:gap-3";
            const colors = ["bg-blue-500", "bg-blue-600", "bg-blue-700", "bg-blue-800"];

            return (
              <section key={category} className="mb-6">
                <div className={`bg-white shadow-md rounded-xl p-3 md:p-4 transition-shadow duration-300 ease-in-out hover:shadow-lg`}>
                  <h2 className="font-semibold mb-3 text-left text-base text-gray-800">Layanan Lainnya</h2>
                  <div className={gridClasses}>
                    {items.map((service, index) => (
                      <HomeServiceItem
                        key={`${category}-${service.name}`}
                        icon={service.icon}
                        title={service.name}
                        onClick={() => handleCardClick(service.name, service.formType)}
                        color={colors[index % colors.length]}
                      />
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
      </main>

      {renderForm()}
    </div>
  );
}

export default App;



