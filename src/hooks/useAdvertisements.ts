import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Advertisement } from '../types/advertisement';

export const useAdvertisements = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Ref untuk tracking mounted state
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const getPublicUrl = (imagePath: string): string => {
    console.log(`[getPublicUrl] Processing imagePath: ${imagePath}`);
    // Jika sudah berupa URL lengkap, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      console.log(`[getPublicUrl] Image path is already a full URL: ${imagePath}`);
      return imagePath;
    }
    
    // Jika berupa path dari Supabase Storage, buat URL publik
    const { data } = supabase.storage
      .from("new_advertisement_images")
      .getPublicUrl(imagePath);
    
    console.log(`[getPublicUrl] Generated public URL for ${imagePath}: ${data.publicUrl}`);
    return data.publicUrl;
  };

  const fetchAdvertisements = async () => {
    // Abort previous request jika ada
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Buat AbortController baru
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      // Hanya update state jika component masih mounted
      if (!isMountedRef.current) return;
      
      setLoading(true);
      setError(null);

      console.log('[fetchAdvertisements] Starting fetch from Supabase...');
      const today = new Date().toISOString().split('T')[0];
      console.log('[fetchAdvertisements] Today date for filtering:', today);

      // Check jika request sudah di-abort
      if (signal.aborted) return;

      // PERTAMA: Ambil SEMUA data tanpa filter untuk debugging
      console.log('[fetchAdvertisements] === DEBUGGING: Fetching ALL data without filters ===');
      const { data: allData, error: allDataError } = await supabase
        .from('advertisements')
        .select('*')
        .order('created_at', { ascending: false });

      // Check abort lagi setelah async operation
      if (signal.aborted || !isMountedRef.current) return;

      if (allDataError) {
        console.error('[fetchAdvertisements] Error fetching all data:', allDataError);
      } else {
        console.log('[fetchAdvertisements] ALL DATA from database (no filters):', allData);
        console.log('[fetchAdvertisements] Total records in database:', allData?.length || 0);
        
        // Analisis setiap record
        (allData || []).forEach((record, index) => {
          console.log(`[fetchAdvertisements] Record ${index + 1}:`, {
            id: record.id,
            promo_text: record.promo_text,
            image_url: record.image_url,
            start_date: record.start_date,
            end_date: record.end_date,
            is_active: record.is_active,
            created_at: record.created_at
          });
          
          // Analisis filter untuk setiap record
          const startDateValid = record.start_date ? record.start_date <= today : false;
          const endDateValid = record.end_date ? record.end_date >= today : false;
          const isActiveValid = record.is_active === true;
          const hasImageUrl = record.image_url && record.image_url.trim() !== '';
          const hasPromoText = record.promo_text && record.promo_text.trim() !== '';
          
          console.log(`[fetchAdvertisements] Record ${index + 1} filter analysis:`, {
            start_date_valid: startDateValid,
            end_date_valid: endDateValid,
            is_active_valid: isActiveValid,
            has_image_url: hasImageUrl,
            has_promo_text: hasPromoText,
            would_pass_all_filters: startDateValid && endDateValid && isActiveValid && hasImageUrl && hasPromoText
          });
        });
      }

      // Check abort sebelum melanjutkan
      if (signal.aborted || !isMountedRef.current) return;

      // KEDUA: Ambil data dengan filter seperti biasa
      console.log('[fetchAdvertisements] === Now fetching with filters ===');
      const { data, error: supabaseError } = await supabase
        .from('advertisements')
        .select('*')
        .eq('is_active', true)
        .gte('end_date', today) // Iklan belum expired (end_date >= today)
        .lte('start_date', today) // Iklan sudah dimulai (start_date <= today)
        .order('created_at', { ascending: false });

      // Check abort setelah async operation
      if (signal.aborted || !isMountedRef.current) return;

      if (supabaseError) {
        console.error('[fetchAdvertisements] Supabase query error:', supabaseError);
        throw supabaseError;
      }

      console.log('[fetchAdvertisements] Filtered data received from Supabase:', data);
      console.log('[fetchAdvertisements] Number of filtered records found:', data?.length || 0);

      // Filter out ads with null or empty image_url and promo_text
      const validAds = (data || []).filter(ad => {
        const isValid = ad.image_url && 
          ad.image_url.trim() !== '' && 
          ad.promo_text && 
          ad.promo_text.trim() !== '';
        
        if (!isValid) {
          console.log('[fetchAdvertisements] Invalid ad filtered out (missing image_url or promo_text):', ad);
        }
        
        return isValid;
      });

      console.log('[fetchAdvertisements] Valid ads after initial filtering:', validAds);
      console.log('[fetchAdvertisements] Number of valid ads after initial filtering:', validAds.length);

      // Check abort sebelum processing URLs
      if (signal.aborted || !isMountedRef.current) return;

      // Process image URLs to ensure they're publicly accessible
      const processedAds = validAds.map(ad => {
        console.log(`[fetchAdvertisements] Processing ad ID: ${ad.id}, raw image_url: ${ad.image_url}`);
        const publicImageUrl = ad.image_url ? getPublicUrl(ad.image_url) : '';
        if (!publicImageUrl) {
          console.log('[fetchAdvertisements] Ad filtered out (failed to get public URL or image_url was empty):', ad);
          return null; // Filter out ads that fail to get a public URL
        }
        console.log(`[fetchAdvertisements] Final public URL for ad ID ${ad.id}: ${publicImageUrl}`);
        return {
          ...ad,
          image_url: publicImageUrl
        };
      }).filter(ad => ad !== null) as Advertisement[]; // Remove nulls

      console.log('[fetchAdvertisements] Processed ads with public URLs (final list):', processedAds);
      console.log('[fetchAdvertisements] Number of final processed ads:', processedAds.length);

      // Final check sebelum update state
      if (signal.aborted || !isMountedRef.current) return;

      setAdvertisements(processedAds);
    } catch (err) {
      // Jangan set error jika request di-abort
      if (signal.aborted || !isMountedRef.current) return;
      
      console.error('[fetchAdvertisements] Error fetching advertisements:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch advertisements');
    } finally {
      // Hanya update loading state jika component masih mounted
      if (isMountedRef.current) {
        setLoading(false);
        console.log('[fetchAdvertisements] Fetch process completed.');
      }
    }
  };

  useEffect(() => {
    console.log('[useAdvertisements] useEffect triggered. Calling fetchAdvertisements().');
    fetchAdvertisements();

    // Cleanup function
    return () => {
      console.log('[useAdvertisements] useEffect cleanup triggered.');
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []); // Empty dependency array untuk hanya run sekali

  // Cleanup saat unmount
  useEffect(() => {
    return () => {
      console.log('[useAdvertisements] Component unmounting. Cleaning up...');
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const refreshAdvertisements = () => {
    console.log('[useAdvertisements] refreshAdvertisements called. Calling fetchAdvertisements().');
    if (isMountedRef.current) {
      fetchAdvertisements();
    }
  };

  return {
    advertisements,
    loading,
    error,
    refreshAdvertisements
  };
};

