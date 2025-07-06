// Definisi tipe data untuk kedai
export interface Kedai {
  id: string;
  nama_kedai: string;
  foto_url: string;
  jam_buka: string;
  deskripsi_singkat: string;
  alamat?: string;
  ongkir_tetap: number;
  menu_makanan?: MenuMakanan[];
}

// Definisi tipe data untuk menu makanan
export interface MenuMakanan {
  id: string;
  kedai_id: string;
  nama_makanan: string;
  deskripsi_makanan: string;
  harga: number;
  foto_makanan_url: string;
  kategori_menu?: string;
  tersedia: boolean;
  created_at?: string;
  updated_at?: string;
}

// Definisi tipe data untuk informasi pembeli
export interface BuyerInfo {
  nama: string;
  alamat: string;
  catatan?: string; // Kolom catatan opsional
  lokasi?: {
    lat: number;
    lon: number;
  };
}

// Definisi tipe data untuk produk kue/tumpeng
export interface ProdukKueTumpeng {
  id: string;
  nama_produk: string;
  harga: number;
  deskripsi: string;
  url_foto: string;
  kategori: 'Kue Tar' | 'Tumpeng' | 'Kue Lain';
  created_at?: string;
  updated_at?: string;
}

// Definisi tipe data untuk informasi pemesan kue/tumpeng
export interface KuePemesanInfo {
  nama: string;
  alamat: string;
  catatan?: string; // Kolom catatan opsional
  lokasi?: {
    lat: number;
    lon: number;
  };
}



// Definisi tipe data untuk item katering
export interface KateringItem {
  id: string; // Assuming ID is a string, adjust if needed
  nama: string;
  foto: string; // Path/filename in Supabase storage
  harga: string;
  deskripsi: string;
  created_at?: string;
  updated_at?: string;
}



// Definisi tipe data untuk item sablon
export interface SablonItem {
  id: string; // Assuming ID is a string
  nama: string;
  foto: string; // Path/filename in Supabase storage
  deskripsi: string;
  kategori: string; // Category for sablon items, using ENUM type in DB
  created_at?: string;
  updated_at?: string;
}

