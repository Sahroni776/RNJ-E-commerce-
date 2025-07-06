# Papan Iklan (Advertisement Banner) - Dokumentasi

## Deskripsi
Papan iklan yang menarik dengan slider otomatis untuk menampilkan promo produk dari database Supabase. Menggantikan gambar anime di atas tulisan "Food & Beverage" dengan desain yang mirip dengan aplikasi e-commerce seperti Shopee dan Alibaba.

## Fitur Utama
- ✅ Auto-slide setiap 2-3 detik
- ✅ Navigasi dengan dots indicator
- ✅ Hover untuk pause auto-slide
- ✅ Responsive design (mobile & desktop)
- ✅ Gradient overlay untuk readability
- ✅ Integrasi dengan database Supabase
- ✅ Fallback display jika tidak ada iklan

## File yang Dibuat

### 1. Komponen Utama
- `src/components/AdvertisementBanner.tsx` - Komponen papan iklan lengkap
- `src/components/AdvertisementBannerSimple.tsx` - Versi sederhana tanpa navigasi arrow
- `src/components/AdvertisementDemo.tsx` - Demo dengan data statis untuk testing

### 2. Hook dan Utilities
- `src/hooks/useAdvertisements.ts` - Hook untuk mengambil data iklan dari Supabase
- `src/types/advertisement.ts` - Type definitions untuk advertisement

### 3. Integrasi
- `src/App.tsx` - Sudah diintegrasikan dengan AdvertisementBanner

## Struktur Database Supabase

Tabel `advertisements` sudah disiapkan dengan struktur:
```sql
CREATE TABLE public.advertisements (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  image_url text NULL,
  promo_text text NULL,
  start_date date NULL,
  end_date date NULL,
  is_active boolean NOT NULL DEFAULT true,
  CONSTRAINT advertisements_pkey PRIMARY KEY (id)
);
```

## Cara Penggunaan

### 1. Menggunakan dengan Data dari Supabase
```tsx
import AdvertisementBanner from './components/AdvertisementBanner';
import { useAdvertisements } from './hooks/useAdvertisements';

function App() {
  const { advertisements, loading, error } = useAdvertisements();
  
  return (
    <AdvertisementBanner 
      advertisements={advertisements}
      autoSlideInterval={3000}
      className="mb-3"
    />
  );
}
```

### 2. Menggunakan dengan Data Statis (Demo)
```tsx
import AdvertisementDemo from './components/AdvertisementDemo';

function App() {
  return (
    <AdvertisementDemo className="mb-3" />
  );
}
```

## Konfigurasi

### Props AdvertisementBanner
- `advertisements`: Array data iklan dari Supabase
- `autoSlideInterval`: Interval auto-slide dalam milidetik (default: 3000)
- `className`: CSS class tambahan

### Contoh Data Iklan
```javascript
const advertisements = [
  {
    id: '1',
    image_url: 'https://example.com/promo1.jpg',
    promo_text: 'Diskon 50% Makanan Favorit!',
    start_date: '2025-07-01',
    end_date: '2025-07-31',
    is_active: true
  }
];
```

## Styling
Menggunakan Tailwind CSS dengan:
- Responsive breakpoints (md:)
- Gradient overlays untuk readability
- Smooth transitions dan animations
- Shadow effects untuk depth

## Troubleshooting

### Error di KedaiMenuPage.tsx
Jika ada error syntax di file KedaiMenuPage.tsx, perbaiki dengan:
1. Cek tag JSX yang tidak tertutup
2. Pastikan semua Button component memiliki penutup yang benar
3. Periksa syntax error di sekitar baris yang dilaporkan

### Tidak Ada Data Iklan
Jika tidak ada data iklan dari Supabase:
1. Periksa koneksi ke database
2. Pastikan tabel `advertisements` sudah dibuat
3. Tambahkan data sample ke tabel
4. Periksa RLS policies

## Deployment
Untuk deployment, pastikan:
1. Environment variables Supabase sudah dikonfigurasi
2. Build aplikasi dengan `npm run build`
3. Deploy ke platform pilihan (Vercel, Netlify, dll)

## Contoh Data Sample untuk Testing
```sql
INSERT INTO public.advertisements (image_url, promo_text, start_date, end_date, is_active) VALUES
('https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=400&fit=crop', 'Diskon 50% Makanan Favorit!', '2025-07-01', '2025-07-31', true),
('https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=400&fit=crop', 'Promo Spesial Pizza Keju', '2025-07-01', '2025-08-15', true),
('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=400&fit=crop', 'Menu Baru Tersedia!', '2025-07-01', '2025-07-25', true);
```

## Catatan
- Komponen sudah responsive dan mobile-friendly
- Auto-slide akan pause saat user hover (pada versi lengkap)
- Fallback display tersedia jika tidak ada iklan
- Semua gambar menggunakan lazy loading dan optimized sizing

