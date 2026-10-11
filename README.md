# Martabak Mantab - Sales & Capital Cycle Tracker

Aplikasi web mobile-first (PWA Ready) dirancang khusus untuk memonitor titik impas belanja modal (*cycle-based break-even point*) dan mencatat omzet harian multi-channel (*ShopeeFood, GrabFood, GoFood, Offline/QRIS*) dengan tema **Dark Bento Grid & Neon Lime (`#D4F634`)**.

---

## 🚀 Pemisahan Lingkungan: Staging & Live (Production)

Proyek ini telah dikonfigurasi dengan pemisahan lingkungan (*environment isolation*) yang jelas, baik dari segi Git Branching, konfigurasi environment variable, hingga penyimpanan database lokal.

### 1. Struktur Git Branch

| Branch | Lingkungan | Tujuan & URL |
| :--- | :--- | :--- |
| **`main`** | **Live / Production** | Kode stabil siap produksi yang diakses oleh pengguna akhir / owner. |
| **`staging`** | **Staging (UAT / Preview)** | Tempat uji coba fitur baru sebelum rilis ke `main`. |

#### Workflow Git:
1. Kembangkan fitur atau bugfix di branch `staging` (atau fitur branch yang di-merge ke `staging`).
2. Uji alur transaksi dan perhitungan di lingkungan Staging.
3. Setelah diverifikasi dan siap live, buat Pull Request / Merge dari `staging` ke `main`.

---

### 2. Konfigurasi Environment Variables

File environment disediakan untuk setiap target:

* **`.env.example`** : Contoh/template variabel lingkungan.
* **`.env.staging`** : Konfigurasi untuk Staging:
  ```env
  NEXT_PUBLIC_APP_ENV=staging
  NEXT_PUBLIC_APP_URL=https://staging.martabakmantab.com
  NEXT_PUBLIC_API_URL=https://staging-api.martabakmantab.com
  ```
* **`.env.production`** : Konfigurasi untuk Live/Production:
  ```env
  NEXT_PUBLIC_APP_ENV=production
  NEXT_PUBLIC_APP_URL=https://martabakmantab.com
  NEXT_PUBLIC_API_URL=https://api.martabakmantab.com
  ```

---

### 3. Isolasi Database Lokal (Offline-First)

Untuk mencegah data pengujian di Staging tercampur dengan data Live:
* **Staging:** Menggunakan prefix `martabak_staging_*` pada LocalStorage. Badge visual khusus **`STAGING`** berwarna amber akan muncul di bilah navigasi atas (*Navbar*).
* **Live:** Menggunakan prefix `martabak_live_*` pada LocalStorage.

---

### 4. CI/CD Pipeline (GitHub Actions)

Terdapat 2 file workflow otomatis:
* **`.github/workflows/staging.yml`** : Berjalan saat push/PR ke branch `staging`. Menjalankan linter dan build dengan `NEXT_PUBLIC_APP_ENV=staging`.
* **`.github/workflows/production.yml`** : Berjalan saat push/PR ke branch `main`. Menjalankan linter dan build dengan `NEXT_PUBLIC_APP_ENV=production`.

---

## 🛠️ Cara Menjalankan Proyek

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Menjalankan di Development
```bash
# Development reguler
npm run dev

# Development simulasi staging
npm run dev:staging
```
Buka browser di: **http://localhost:3000**

### 3. Build Proyek
```bash
# Build untuk Staging
npm run build:staging

# Build untuk Live / Production
npm run build:live
```

---

## 📁 Struktur Halaman
* `/` : Halaman Beranda (Hero Bento Card, Dual Bento Hari Ini, Distribusi 4 Channel, Aktivitas Terakhir, Floating Dock).
* `/reports/monthly` : Laporan Bulanan (Filter Bulan/Tahun, P&L, Heatmap Kalender Laba Harian, Kontribusi Channel).
* `/reports/cycles` : Riwayat Siklus Modal (Filter 1 Minggu / Bulan / Range Kustom, Statistik Agregat, Drill-Down Log Item Modal & Penjualan).
