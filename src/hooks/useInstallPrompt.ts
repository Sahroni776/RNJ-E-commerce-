import { useState, useEffect, useRef } from 'react';

// Define the interface for the BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const useInstallPrompt = () => {
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installError, setInstallError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      // Check if running in standalone mode (installed PWA)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      // Check if running in PWA mode on iOS
      const isIOSPWA = (window.navigator as any).standalone === true;
      
      setIsInstalled(isStandalone || isIOSPWA);
    };

    checkIfInstalled();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('[useInstallPrompt] beforeinstallprompt event fired');
      
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      
      // Save the event so it can be triggered later
      const installEvent = e as BeforeInstallPromptEvent;
      
      if (isMountedRef.current) {
        setInstallPromptEvent(installEvent);
        setIsInstallable(true);
        setInstallError(null);
      }
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      console.log('[useInstallPrompt] PWA was installed');
      
      if (isMountedRef.current) {
        setIsInstalled(true);
        setIsInstallable(false);
        setInstallPromptEvent(null);
        setIsInstalling(false);
      }
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Cleanup function
    return () => {
      console.log('[useInstallPrompt] Cleaning up event listeners');
      isMountedRef.current = false;
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!installPromptEvent) {
      console.log('[useInstallPrompt] No install prompt event available');
      setInstallError('Instalasi tidak tersedia saat ini');
      return false;
    }

    try {
      setIsInstalling(true);
      setInstallError(null);
      
      console.log('[useInstallPrompt] Showing install prompt');
      
      // Show the install prompt
      await installPromptEvent.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await installPromptEvent.userChoice;
      
      console.log('[useInstallPrompt] User choice:', outcome);
      
      if (outcome === 'accepted') {
        console.log('[useInstallPrompt] User accepted the install prompt');
        // The appinstalled event will handle the state update
        return true;
      } else {
        console.log('[useInstallPrompt] User dismissed the install prompt');
        if (isMountedRef.current) {
          setIsInstalling(false);
        }
        return false;
      }
    } catch (error) {
      console.error('[useInstallPrompt] Error during installation:', error);
      
      if (isMountedRef.current) {
        setIsInstalling(false);
        setInstallError('Terjadi kesalahan saat instalasi');
      }
      
      return false;
    }
  };

  const resetInstallPrompt = () => {
    if (isMountedRef.current) {
      setInstallPromptEvent(null);
      setIsInstallable(false);
      setInstallError(null);
      setIsInstalling(false);
    }
  };

  // Detect browser and platform
  const getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    const isChrome = /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor);
    const isFirefox = /Firefox/.test(userAgent);
    const isEdge = /Edg/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    
    return {
      isChrome,
      isFirefox,
      isEdge,
      isSafari,
      isAndroid,
      isIOS,
      supportsInstallPrompt: isChrome || isFirefox || isEdge,
      requiresManualInstall: isSafari || isIOS
    };
  };

  return {
    isInstallable,
    isInstalled,
    isInstalling,
    installError,
    installApp,
    resetInstallPrompt,
    browserInfo: getBrowserInfo()
  };
};

