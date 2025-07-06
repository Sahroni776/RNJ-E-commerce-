// Supabase client configuration
import { createClient } from '@supabase/supabase-js';
import { ProdukKueTumpeng, KateringItem, SablonItem } from '../types'; // Added KateringItem and SablonItem import

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Fungsi untuk mengambil semua produk kue/tumpeng
export async function getAllProdukKueTumpeng(): Promise<ProdukKueTumpeng[]> {
  const { data, error } = await supabase
    .from('produk_kue_tumpeng')
    .select('*');
  
  if (error) {
    console.error('Error fetching produk kue/tumpeng:', error);
    return [];
  }
  
  return data || [];
}

// Fungsi untuk mengambil produk kue/tumpeng berdasarkan kategori
export async function getProdukKueTumpengByKategori(kategori: 'Kue Tar' | 'Tumpeng' | 'Kue Lain'): Promise<ProdukKueTumpeng[]> {
  const { data, error } = await supabase
    .from('produk_kue_tumpeng')
    .select('*')
    .eq('kategori', kategori);
  
  if (error) {
    console.error(`Error fetching produk kue/tumpeng with kategori ${kategori}:`, error);
    return [];
  }
  
  return data || [];
}

// Fungsi untuk mengambil produk kue/tumpeng berdasarkan ID
export async function getProdukKueTumpengById(id: string): Promise<ProdukKueTumpeng | null> {
  const { data, error } = await supabase
    .from('produk_kue_tumpeng')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching produk kue/tumpeng with id ${id}:`, error);
    return null;
  }
  
  return data || null;
}



// Fungsi untuk mengambil semua item katering
export async function getAllKateringItems(): Promise<KateringItem[]> {
  console.log("Attempting to fetch katering items..."); // Log attempt
  const { data, error } = await supabase
    .from("katering") // Use the correct table name
    .select("*");

  if (error) {
    console.error("Error fetching katering items:", error); // Log error
    return [];
  }

  console.log("Successfully fetched katering items:", data); // Log success and data
  return data || [];
}



// Fungsi untuk mengambil semua item sablon
export async function getAllSablonItems(): Promise<SablonItem[]> {
  console.log("Attempting to fetch sablon items...");
  const { data, error } = await supabase
    .from("sablon")
    .select("*");

  if (error) {
    console.error("Error fetching sablon items:", error);
    // Check for specific errors like invalid path/table
    if (error.message.includes("relation \"sablon\" does not exist")) {
      throw new Error("Tabel 'sablon' tidak ditemukan di database.");
    }
    return [];
  }

  console.log("Successfully fetched sablon items:", data);
  return data || [];
}

// Fungsi untuk mengambil kategori sablon unik
export async function getSablonCategories(): Promise<string[]> {
  console.log("Attempting to fetch sablon categories...");
  const { data, error } = await supabase
    .from('sablon')
    .select("kategori");

  if (error) {
    console.error('Error fetching sablon categories:', error);
     if (error.message.includes("relation \"sablon\" does not exist")) {
      throw new Error("Tabel 'sablon' tidak ditemukan di database.");
    }
     if (error.message.includes('column "kategori_sablon" does not exist')) {
       throw new Error("Kolom 'kategori_sablon' tidak ditemukan di tabel 'sablon'.");
     }
    return [];
  }

  // Extract unique categories
  const categories = data ? [...new Set(data.map(item => item.kategori).filter(Boolean))] : [];
  console.log("Successfully fetched unique sablon categories:", categories);
  return categories;
}

// Fungsi untuk mengambil item sablon berdasarkan kategori
export async function getSablonItemsByCategory(kategori: string): Promise<SablonItem[]> {
  console.log(`Attempting to fetch sablon items for category: ${kategori}`);
  const { data, error } = await supabase
    .from('sablon')
    .select('*')
    .eq("kategori", kategori);

  if (error) {
    console.error(`Error fetching sablon items for category ${kategori}:`, error);
     if (error.message.includes("relation \"sablon\" does not exist")) {
      throw new Error("Tabel 'sablon' tidak ditemukan di database.");
    }
    return [];
  }

  console.log(`Successfully fetched sablon items for category ${kategori}:`, data);
  return data || [];
}

