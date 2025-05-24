# Movie Search (MOVSEARCH) Frontend

Repositori ini berisi _frontend_ untuk **Movie Search Engine** yang dibangun menggunakan Next.js dengan TypeScript. Aplikasi ini menyediakan antarmuka pengguna untuk mencari film dengan berbagai metode pencarian termasuk semantik, kata kunci, dan hybrid.

Contributor :
 - Akmal Ramadhan - 2206081534
 - Muh.Kemal Lathif Galih Putra - 2206081225
 - Tsabit Coda Rafisukmawan - 2206081414

Repositori ini dibuat sebagai bagian dari proyek akhir mata kuliah Temu Balik Informasi di Universitas Indonesia.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/tsabit-codas-projects/v0-movie-search-engine)

## Fitur Utama

| Fitur                      | Deskripsi                                                                                                  |
|----------------------------|-------------------------------------------------------------------------------------------------------------|
| **Pencarian Multi-Mode**   | Opsi pencarian semantik, kata kunci (BM25), atau hybrid dengan toggle yang mudah digunakan                  |
| **Filter Hasil**           | Filter berdasarkan tahun, rating, genre, dan parameter lainnya                                             |
| **UI Responsif**           | Antarmuka yang berfungsi dengan baik di perangkat desktop maupun mobile                                    |
| **Detail Film**            | Halaman detail film dengan informasi lengkap, poster, dan data cast                                         |
| **Ringkasan AI**           | Ringkasan otomatis hasil pencarian menggunakan model bahasa                                                |
| **Caching Hasil**          | Penyimpanan hasil pencarian di session storage untuk mengurangi API calls berulang                         |

---

## Arsitektur & Cara Kerja Frontend

### Komponen Utama
- **Next.js**: Framework React yang digunakan untuk SSR (Server-Side Rendering) dan pembuatan rute
- **TypeScript**: Menambahkan type safety untuk pengembangan yang lebih robust
- **Shadcn UI**: Komponen UI yang dapat disesuaikan untuk antarmuka yang konsisten dan modern
- **React Hooks**: Manajemen state dan efek samping di seluruh aplikasi

### Struktur Aplikasi
1. **Halaman Utama**:
   - Komponen pencarian sederhana dengan logo
   - Toggle untuk memilih mode pencarian (semantik/kata kunci/hybrid)
   - Filter yang dapat diperluas untuk pengaturan pencarian lanjutan

2. **Halaman Hasil Pencarian**:
   - Grid responsif yang menampilkan hasil film
   - Filter dan pengurutan tambahan
   - Ringkasan AI dari hasil pencarian
   - Indikator pemuatan saat mengambil hasil

3. **Halaman Detail Film**:
   - Tampilan lengkap metadata film
   - Poster film dengan UI yang dioptimalkan
   - Daftar pemain dan kru utama
   - Navigasi kembali ke hasil pencarian

### Alur Kerja Pencarian
1. Pengguna memasukkan query di halaman utama
2. Frontend mengirimkan permintaan ke backend sesuai dengan mode pencarian yang dipilih:
   - Pencarian Semantik: `/api/v1/movies/semantic-search` (POST)
   - Pencarian Kata Kunci: `/api/v1/movies/keyword-search` (POST)
   - Pencarian Hybrid: `/api/v1/movies/hybrid-search` (POST)
3. Hasil diterima dan ditampilkan dalam grid yang dapat diklik
4. Permintaan ringkasan dikirim ke endpoint `/api/v1/search/summarize` (opsional)
5. Hasil pencarian di-cache di session storage untuk penggunaan kembali

---

## Teknologi

- **Next.js 14+**
- **TypeScript**
- **React 18+**
- **Axios** (HTTP client)
- **Shadcn UI Components** 
- **Tailwind CSS** (styling)
- **Lucide Icons**
- **React Markdown** (untuk rendering ringkasan)

---

## Prasyarat

1. **Node.js 18+** terinstal
2. **npm** atau **pnpm** sebagai package manager
3. Backend API yang sudah berjalan dan dapat diakses

---

## Instalasi & Setup

```bash
# 1. Klon repositori
git clone https://github.com/penyuram-tbi/movsearch-fe.git && cd movsearch-fe

# 2. Install dependencies
npm install
# ATAU
pnpm install

# 3. Buat file .env.local
touch .env.local
```

## Konfigurasi Environment

Buat file `.env.local` dengan konten:

```bash
# URL backend API
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Menjalankan Aplikasi

```bash
# Development mode
npm run dev
# ATAU
pnpm dev

# Produksi - build terlebih dahulu
npm run build
npm run start
# ATAU
pnpm build
pnpm start
```

Server development akan berjalan di http://localhost:3000

## Mode Pencarian

| Mode          | Deskripsi                                                              | Endpoint Backend                    |
|---------------|------------------------------------------------------------------------|-------------------------------------|
| **Semantik**  | Pencarian berdasarkan kemiripan makna dengan model sentence-transformers | `/api/v1/movies/semantic-search`   |
| **Kata Kunci**| Pencarian tradisional berbasis BM25 dengan dukungan fuzzy               | `/api/v1/movies/keyword-search`    |
| **Hybrid**    | Kombinasi semantik dan kata kunci dengan bobot yang dapat disesuaikan   | `/api/v1/movies/hybrid-search`     |

## Fitur UI Tambahan

- **Mode Gelap**: Antarmuka dengan tema gelap untuk pengalaman visual yang optimal
- **Paginasi**: Navigasi halaman hasil yang efisien untuk kumpulan hasil yang besar
- **Animasi Loading**: Indikator visual saat melakukan pencarian atau memuat konten
- **Responsif**: Dioptimalkan untuk berbagai ukuran layar dari mobile hingga desktop

---

## Deployment

Aplikasi ini di-deploy menggunakan Vercel. Setiap push ke branch utama akan secara otomatis di-deploy.

## Penghubung Dengan Backend

Frontend berkomunikasi dengan backend menggunakan REST API. Pastikan backend sedang berjalan di URL yang ditentukan dalam `.env.local`.