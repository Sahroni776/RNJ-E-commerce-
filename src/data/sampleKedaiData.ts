// Contoh data kedai untuk pengujian
export const sampleKedaiData = [
  {
    id: "1",
    nama_kedai: "Warung Makan Barokah",
    foto_url: "/assets/icons_new/warung_barokah.jpeg",
    jam_buka: "08:00 - 21:00",
    deskripsi_singkat: "Menyajikan aneka masakan rumahan dengan cita rasa otentik",
    alamat: "Jl. Pahlawan No. 123, Kota",
    alamat_kedai: "Jl. Pahlawan No. 123, Kota",
    ongkir_tetap: 5000,
    aktif: true,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    menu_makanan: [
      {
        id: "1-1",
        kedai_id: "1",
        nama_makanan: "Nasi Goreng Spesial",
        deskripsi_makanan: "Nasi goreng dengan telur, ayam, dan sayuran segar",
        harga: 15000,
        foto_makanan_url: "/assets/icons_new/nasi_goreng.jpeg",
        kategori_menu: "makanan",
        tersedia: true
      },
      {
        id: "1-2",
        kedai_id: "1",
        nama_makanan: "Ayam Goreng",
        deskripsi_makanan: "Ayam goreng renyah dengan bumbu rahasia",
        harga: 18000,
        foto_makanan_url: "/assets/icons_new/ayam_goreng.jpeg",
        kategori_menu: "makanan",
        tersedia: true
      },
      {
        id: "1-3",
        kedai_id: "1",
        nama_makanan: "Es Teh Manis",
        deskripsi_makanan: "Teh manis dingin yang menyegarkan",
        harga: 5000,
        foto_makanan_url: "/assets/icons_new/es_teh.jpeg",
        kategori_menu: "minuman",
        tersedia: true
      },
      {
        id: "1-4",
        kedai_id: "1",
        nama_makanan: "Pisang Goreng",
        deskripsi_makanan: "Pisang goreng renyah dengan tepung crispy",
        harga: 8000,
        foto_makanan_url: "/assets/icons_new/pisang_goreng.jpeg",
        kategori_menu: "cemilan",
        tersedia: true
      },
      {
        id: "1-5",
        kedai_id: "1",
        nama_makanan: "Tempe Mendoan",
        deskripsi_makanan: "Tempe tipis dibalut tepung dengan bumbu khas",
        harga: 7000,
        foto_makanan_url: "/assets/icons_new/tempe_mendoan.jpeg",
        kategori_menu: "cemilan",
        tersedia: true
      }
    ]
  },
  {
    id: "2",
    nama_kedai: "Kedai Ayam Geprek",
    foto_url: "/assets/icons_new/ayam_geprek.jpeg",
    jam_buka: "10:00 - 22:00",
    deskripsi_singkat: "Spesialis ayam geprek dengan berbagai level kepedasan",
    alamat: "Jl. Merdeka No. 45, Kota",
    alamat_kedai: "Jl. Merdeka No. 45, Kota",
    ongkir_tetap: 7000,
    aktif: true,
    created_at: "2023-01-02T00:00:00Z",
    updated_at: "2023-01-02T00:00:00Z",
    menu_makanan: [
      {
        id: "2-1",
        kedai_id: "2",
        nama_makanan: "Ayam Geprek Original",
        deskripsi_makanan: "Ayam geprek dengan sambal level 1",
        harga: 15000,
        foto_makanan_url: "/assets/icons_new/ayam_geprek.jpeg",
        kategori_menu: "makanan",
        tersedia: true
      },
      {
        id: "2-2",
        kedai_id: "2",
        nama_makanan: "Ayam Geprek Mozzarella",
        deskripsi_makanan: "Ayam geprek dengan topping keju mozzarella",
        harga: 25000,
        foto_makanan_url: "/assets/icons_new/ayam_geprek_keju.jpeg",
        kategori_menu: "makanan",
        tersedia: true
      },
      {
        id: "2-3",
        kedai_id: "2",
        nama_makanan: "Es Jeruk",
        deskripsi_makanan: "Jeruk peras segar dengan es",
        harga: 7000,
        foto_makanan_url: "/assets/icons_new/es_jeruk.jpeg",
        kategori_menu: "minuman",
        tersedia: true
      },
      {
        id: "2-4",
        kedai_id: "2",
        nama_makanan: "Tahu Crispy",
        deskripsi_makanan: "Tahu dibalut tepung crispy dengan bumbu rahasia",
        harga: 10000,
        foto_makanan_url: "/assets/icons_new/tahu_crispy.jpeg",
        kategori_menu: "cemilan",
        tersedia: true
      }
    ]
  },
  {
    id: "3",
    nama_kedai: "Bakso Pak Jono",
    foto_url: "/assets/icons_new/bakso_jono.jpeg",
    jam_buka: "09:00 - 20:00",
    deskripsi_singkat: "Bakso daging sapi asli dengan kuah gurih",
    alamat: "Jl. Veteran No. 78, Kota",
    alamat_kedai: "Jl. Veteran No. 78, Kota",
    ongkir_tetap: 6000,
    aktif: true,
    created_at: "2023-01-03T00:00:00Z",
    updated_at: "2023-01-03T00:00:00Z",
    menu_makanan: [
      {
        id: "3-1",
        kedai_id: "3",
        nama_makanan: "Bakso Biasa",
        deskripsi_makanan: "Bakso dengan 5 butir bakso ukuran sedang",
        harga: 12000,
        foto_makanan_url: "/assets/icons_new/bakso_biasa.jpeg",
        kategori_menu: "makanan",
        tersedia: true
      },
      {
        id: "3-2",
        kedai_id: "3",
        nama_makanan: "Bakso Jumbo",
        deskripsi_makanan: "Bakso dengan 1 butir bakso ukuran jumbo dan 3 bakso kecil",
        harga: 18000,
        foto_makanan_url: "/assets/icons_new/bakso_jumbo.jpeg",
        kategori_menu: "makanan",
        tersedia: true
      },
      {
        id: "3-3",
        kedai_id: "3",
        nama_makanan: "Es Cincau",
        deskripsi_makanan: "Minuman segar dengan cincau hitam",
        harga: 6000,
        foto_makanan_url: "/assets/icons_new/es_cincau.jpeg",
        kategori_menu: "minuman",
        tersedia: true
      },
      {
        id: "3-4",
        kedai_id: "3",
        nama_makanan: "Siomay",
        deskripsi_makanan: "Siomay ikan dengan bumbu kacang",
        harga: 10000,
        foto_makanan_url: "/assets/icons_new/siomay.jpeg",
        kategori_menu: "cemilan",
        tersedia: true
      },
      {
        id: "3-5",
        kedai_id: "3",
        nama_makanan: "Batagor",
        deskripsi_makanan: "Batagor dengan isian daging ikan tenggiri",
        harga: 12000,
        foto_makanan_url: "/assets/icons_new/batagor.jpeg",
        kategori_menu: "cemilan",
        tersedia: true
      }
    ]
  },
  {
    id: "4",
    nama_kedai: "Soto Ayam Bu Siti",
    foto_url: "/assets/icons_new/soto_siti.jpeg",
    jam_buka: "07:00 - 15:00",
    deskripsi_singkat: "Soto ayam kampung dengan bumbu rempah pilihan",
    alamat: "Jl. Diponegoro No. 56, Kota",
    alamat_kedai: "Jl. Diponegoro No. 56, Kota",
    ongkir_tetap: 5000,
    aktif: true,
    created_at: "2023-01-04T00:00:00Z",
    updated_at: "2023-01-04T00:00:00Z",
    menu_makanan: [
      {
        id: "4-1",
        kedai_id: "4",
        nama_makanan: "Soto Ayam",
        deskripsi_makanan: "Soto ayam dengan kuah bening dan ayam suwir",
        harga: 14000,
        foto_makanan_url: "/assets/icons_new/soto_ayam.jpeg",
        kategori_menu: "makanan",
        tersedia: true
      },
      {
        id: "4-2",
        kedai_id: "4",
        nama_makanan: "Soto Mie",
        deskripsi_makanan: "Soto dengan tambahan mie kuning",
        harga: 16000,
        foto_makanan_url: "/assets/icons_new/soto_mie.jpeg",
        kategori_menu: "makanan",
        tersedia: true
      },
      {
        id: "4-3",
        kedai_id: "4",
        nama_makanan: "Es Kelapa Muda",
        deskripsi_makanan: "Air kelapa muda segar dengan potongan daging kelapa",
        harga: 8000,
        foto_makanan_url: "/assets/icons_new/es_kelapa.jpeg",
        kategori_menu: "minuman",
        tersedia: true
      },
      {
        id: "4-4",
        kedai_id: "4",
        nama_makanan: "Gorengan Assorted",
        deskripsi_makanan: "Aneka gorengan: bakwan, tempe, tahu isi",
        harga: 1500,
        foto_makanan_url: "/assets/icons_new/gorengan.jpeg",
        kategori_menu: "cemilan",
        tersedia: true
      }
    ]
  },
  {
    id: "5",
    nama_kedai: "Kedai Kopi Aroma",
    foto_url: "/assets/icons_new/kedai_kopi.jpeg",
    jam_buka: "08:00 - 22:00",
    deskripsi_singkat: "Kopi premium dengan biji pilihan dari seluruh Indonesia",
    alamat: "Jl. Sudirman No. 88, Kota",
    alamat_kedai: "Jl. Sudirman No. 88, Kota",
    ongkir_tetap: 8000,
    aktif: true,
    created_at: "2023-01-05T00:00:00Z",
    updated_at: "2023-01-05T00:00:00Z",
    menu_makanan: [
      {
        id: "5-1",
        kedai_id: "5",
        nama_makanan: "Kopi Hitam",
        deskripsi_makanan: "Kopi hitam dengan biji arabika pilihan",
        harga: 10000,
        foto_makanan_url: "/assets/icons_new/kopi_hitam.jpeg",
        kategori_menu: "minuman",
        tersedia: true
      },
      {
        id: "5-2",
        kedai_id: "5",
        nama_makanan: "Cappuccino",
        deskripsi_makanan: "Kopi dengan campuran susu dan foam susu",
        harga: 18000,
        foto_makanan_url: "/assets/icons_new/cappuccino.jpeg",
        kategori_menu: "minuman",
        tersedia: true
      },
      {
        id: "5-3",
        kedai_id: "5",
        nama_makanan: "Matcha Latte",
        deskripsi_makanan: "Minuman matcha dengan susu",
        harga: 20000,
        foto_makanan_url: "/assets/icons_new/matcha.jpeg",
        kategori_menu: "minuman",
        tersedia: true
      },
      {
        id: "5-4",
        kedai_id: "5",
        nama_makanan: "Donat Gula",
        deskripsi_makanan: "Donat lembut dengan taburan gula",
        harga: 5000,
        foto_makanan_url: "/assets/icons_new/donat.jpeg",
        kategori_menu: "cemilan",
        tersedia: true
      },
      {
        id: "5-5",
        kedai_id: "5",
        nama_makanan: "Kue Lapis",
        deskripsi_makanan: "Kue lapis legit dengan rasa pandan",
        harga: 7000,
        foto_makanan_url: "/assets/icons_new/kue_lapis.jpeg",
        kategori_menu: "cemilan",
        tersedia: true
      }
    ]
  },
  {
    id: "6",
    nama_kedai: "Jus Buah Segar",
    foto_url: "/assets/icons_new/jus_buah.jpeg",
    jam_buka: "09:00 - 21:00",
    deskripsi_singkat: "Aneka jus buah segar tanpa pengawet",
    alamat: "Jl. Gatot Subroto No. 123, Kota",
    alamat_kedai: "Jl. Gatot Subroto No. 123, Kota",
    ongkir_tetap: 6000,
    aktif: true,
    created_at: "2023-01-06T00:00:00Z",
    updated_at: "2023-01-06T00:00:00Z",
    menu_makanan: [
      {
        id: "6-1",
        kedai_id: "6",
        nama_makanan: "Jus Alpukat",
        deskripsi_makanan: "Jus alpukat kental dengan susu",
        harga: 15000,
        foto_makanan_url: "/assets/icons_new/jus_alpukat.jpeg",
        kategori_menu: "minuman",
        tersedia: true
      },
      {
        id: "6-2",
        kedai_id: "6",
        nama_makanan: "Jus Mangga",
        deskripsi_makanan: "Jus mangga manis dari mangga harum manis",
        harga: 12000,
        foto_makanan_url: "/assets/icons_new/jus_mangga.jpeg",
        kategori_menu: "minuman",
        tersedia: true
      },
      {
        id: "6-3",
        kedai_id: "6",
        nama_makanan: "Mix Fruit Juice",
        deskripsi_makanan: "Campuran berbagai buah segar dalam satu gelas",
        harga: 18000,
        foto_makanan_url: "/assets/icons_new/mix_juice.jpeg",
        kategori_menu: "minuman",
        tersedia: true
      },
      {
        id: "6-4",
        kedai_id: "6",
        nama_makanan: "Kentang Goreng",
        deskripsi_makanan: "Kentang goreng renyah dengan bumbu tabur",
        harga: 10000,
        foto_makanan_url: "/assets/icons_new/kentang_goreng.jpeg",
        kategori_menu: "cemilan",
        tersedia: true
      }
    ]
  },
  {
    id: "7",
    nama_kedai: "Warung Cemilan Enak",
    foto_url: "/assets/icons_new/warung_cemilan.jpeg",
    jam_buka: "10:00 - 22:00",
    deskripsi_singkat: "Spesialis aneka cemilan tradisional dan modern",
    alamat: "Jl. Pemuda No. 45, Kota",
    alamat_kedai: "Jl. Pemuda No. 45, Kota",
    ongkir_tetap: 5000,
    aktif: true,
    created_at: "2023-01-07T00:00:00Z",
    updated_at: "2023-01-07T00:00:00Z",
    menu_makanan: [
      {
        id: "7-1",
        kedai_id: "7",
        nama_makanan: "Cireng",
        deskripsi_makanan: "Cireng renyah dengan bumbu rujak",
        harga: 8000,
        foto_makanan_url: "/assets/icons_new/cireng.jpeg",
        kategori_menu: "cemilan",
        tersedia: true
      },
      {
        id: "7-2",
        kedai_id: "7",
        nama_makanan: "Cilok",
        deskripsi_makanan: "Cilok kenyal dengan saus kacang pedas",
        harga: 10000,
        foto_makanan_url: "/assets/icons_new/cilok.jpeg",
        kategori_menu: "cemilan",
        tersedia: true
      },
      {
        id: "7-3",
        kedai_id: "7",
        nama_makanan: "Risoles",
        deskripsi_makanan: "Risoles dengan isian ragout ayam dan sayuran",
        harga: 7000,
        foto_makanan_url: "/assets/icons_new/risoles.jpeg",
        kategori_menu: "cemilan",
        tersedia: true
      },
      {
        id: "7-4",
        kedai_id: "7",
        nama_makanan: "Tahu Petis",
        deskripsi_makanan: "Tahu goreng dengan saus petis khas",
        harga: 8000,
        foto_makanan_url: "/assets/icons_new/tahu_petis.jpeg",
        kategori_menu: "cemilan",
        tersedia: true
      },
      {
        id: "7-5",
        kedai_id: "7",
        nama_makanan: "Es Teh",
        deskripsi_makanan: "Es teh manis segar",
        harga: 4000,
        foto_makanan_url: "/assets/icons_new/es_teh.jpeg",
        kategori_menu: "minuman",
        tersedia: true
      }
    ]
  }
];
