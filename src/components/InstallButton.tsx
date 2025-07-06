import React, { useState } from 'react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

interface InstallButtonProps {
  className?: string;
  showManualInstructions?: boolean;
}

const InstallButton: React.FC<InstallButtonProps> = ({ 
  className = '',
  showManualInstructions = true 
}) => {
  const { 
    isInstallable, 
    isInstalled, 
    isInstalling, 
    installError, 
    installApp, 
    browserInfo 
  } = useInstallPrompt();

  const [showInstructions, setShowInstructions] = useState(false);

  const handleInstallClick = async () => {
    if (browserInfo.supportsInstallPrompt) {
      // Browser mendukung install prompt otomatis
      const success = await installApp();
      if (!success && installError) {
        console.log('Install failed:', installError);
      }
    } else {
      // Browser memerlukan instalasi manual
      setShowInstructions(true);
    }
  };

  // Jangan tampilkan tombol jika sudah terinstal
  if (isInstalled) {
    return null;
  }

  // Jangan tampilkan jika browser tidak mendukung PWA sama sekali
  if (!browserInfo.supportsInstallPrompt && !browserInfo.requiresManualInstall) {
    return null;
  }

  // Jangan tampilkan jika tidak installable dan browser mendukung prompt
  if (browserInfo.supportsInstallPrompt && !isInstallable) {
    return null;
  }

  return (
    <>
      {/* Tombol Install */}
      <button
        onClick={handleInstallClick}
        disabled={isInstalling}
        className={`
          inline-flex items-center justify-center px-4 py-2 
          bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
          text-white font-medium text-sm rounded-lg
          transition-all duration-200 ease-in-out
          shadow-md hover:shadow-lg
          ${isInstalling ? 'cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
        aria-label="Install aplikasi"
      >
        {isInstalling ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Menginstal...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {browserInfo.supportsInstallPrompt ? 'Install App' : 'Cara Install'}
          </>
        )}
      </button>

      {/* Error Message */}
      {installError && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
          {installError}
        </div>
      )}

      {/* Modal Instruksi Manual untuk iOS/Safari */}
      {showInstructions && browserInfo.requiresManualInstall && showManualInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowInstructions(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Tutup"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Cara Install Aplikasi
              </h3>

              {browserInfo.isIOS ? (
                <div className="text-left space-y-3 text-sm text-gray-600">
                  <p className="font-medium text-gray-800">Untuk iPhone/iPad (Safari):</p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Tap tombol <strong>Share</strong> (ikon kotak dengan panah ke atas) di bagian bawah Safari</li>
                    <li>Scroll ke bawah dan pilih <strong>"Add to Home Screen"</strong></li>
                    <li>Tap <strong>"Add"</strong> di pojok kanan atas</li>
                    <li>Aplikasi akan muncul di home screen Anda</li>
                  </ol>
                </div>
              ) : (
                <div className="text-left space-y-3 text-sm text-gray-600">
                  <p className="font-medium text-gray-800">Untuk browser ini:</p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Buka menu browser (⋮ atau ⋯)</li>
                    <li>Cari opsi <strong>"Add to Home Screen"</strong> atau <strong>"Install App"</strong></li>
                    <li>Ikuti instruksi yang muncul</li>
                  </ol>
                </div>
              )}

              <div className="mt-6">
                <button
                  onClick={() => setShowInstructions(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Mengerti
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallButton;

