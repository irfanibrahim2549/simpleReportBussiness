# Software Requirements Specification (SRS) / Requirements Document

**Project Name:** Sales & Capital Cycle Tracker (Martabak Mantab)  
**Target Platform:** Mobile-First Web Application (PWA Ready)  
**Design System:** Dark Bento Grid with Neon Lime Accent (`#D4F634`)  
**Architecture:** Single Page Application / Next.js SPA with Client-Side State or Serverless Sync

---

## 1. Project Overview & Objectives

Aplikasi web mobile dirancang khusus untuk memonitor titik impas belanja bahan modal (*cycle-based break-even point*) dan mencatat omzet harian multi-channel (ShopeeFood, GrabFood, GoFood, Offline) dengan antarmuka cepat, minim gesekan (*low cognitive friction*), dan fokus pada insight bisnis esensial tanpa perlu OCR nota.

---

## 2. Functional Requirements (FR)

### FR-01: Lifecycle Siklus Modal Otomatis (Automated Capital Cycle)
* **FR-01.1 Initiation:** Sistem wajib otomatis membuat entri siklus baru (`active`) saat user menginput belanja pertama kali atau saat ada input belanja setelah siklus sebelumnya telah lunas.
* **FR-01.2 Aggregation:** Jika siklus aktif belum lunas dan terdapat input belanja baru, nilai belanja ditambahkan ke target modal berjalan siklus aktif tersebut.
* **FR-01.3 Auto-Closure / Settlement:** Begitu $\sum \text{Pendapatan Bersih Siklus} \ge \sum \text{Total Belanja Siklus}$, sistem wajib secara otomatis menandai status siklus menjadi `Lunas` (`closed_profit`) dan mencatat `settled_at` timestamp.
* **FR-01.4 Overflow Profit:** Setiap pendapatan yang dicatat setelah titik impas tercapai tetap diasosiasikan ke siklus tersebut sebagai laba bersih (*net profit*).
* **FR-01.5 Cycle Turnover Metric:** Menghitung durasi rata-rata siklus lunas:
  $$\text{Turnover (Hari)} = \frac{\text{Timestamp Settled} - \text{Timestamp Belanja Pertama}}{86400 \text{ detik}}$$

---

### FR-02: Halaman Indeks / Beranda (`/`)
* **FR-02.1 Top Navigation Bar:** Menampilkan nama gerai/brand di kiri dan tombol Hamburger Menu (`☰`) di kanan.
* **FR-02.2 Hero Bento Card (Lime Neon `#D4F634`):**
  * Persentase pencapaian modal siklus berjalan:
    $$\text{Progress} = \min\left(100, \left(\frac{\text{Pendapatan Siklus}}{\text{Belanja Siklus}}\right) \times 100\right)\%$$
  * Dual-tone progress bar (hitam pekat untuk realisasi + bar bermotif garis miring *striped* untuk sisa target).
  * Status Dinamis:
    * Defisit: `Kurang Rp[Sisa] lagi untuk balik modal`.
    * Surplus: `Untung Bersih +Rp[Nominal]`.
  * Badge info turnover: `⚡ Rata-rata Balik Modal: [X] Hari`.
* **FR-02.3 Dual Bento Card (Kondisi Hari Ini):**
  * Kartu Belanja Hari Ini: Menampilkan total belanja khusus tanggal berjalan.
  * Kartu Pendapatan Masuk: Menampilkan total omzet bersih khusus tanggal berjalan.
* **FR-02.4 Sumber Pendapatan Hari Ini:** Visual progress bar distribusi omzet hari ini untuk 4 channel: `ShopeeFood`, `GrabFood`, `GoFood`, dan `Offline / QRIS`.
* **FR-02.5 Aktivitas Terakhir:** Menampilkan 5 transaksi input paling mutakhir (badge channel, waktu, nominal, dan tipe transaksi).
* **FR-02.6 Floating Action Dock (Hanya di Halaman Indeks):**
  * Tombol 1: `[+ Belanja]` (Style: Gelap/Subtle).
  * Tombol 2: `[+ Pendapatan]` (Style: Neon Lime `#D4F634` / Kontras Tinggi).

---

### FR-03: Quick Input Modals (Bottom Sheets)
* **FR-03.1 Modal Tambah Belanja:**
  * Field: Nominal (Input angka besar/raksasa dengan prefix `Rp`).
  * Field: Keterangan / Bahan (Input teks singkat opsional).
  * Field: Tanggal & Waktu (Default: waktu lokal perangkat saat ini).
  * Action: Simpan Belanja (menutup modal dan memicu revalidasi kalkulasi siklus).
* **FR-03.2 Modal Tambah Pendapatan:**
  * Field: Pilihan Channel Segmented/Chips: `Shopee`, `Grab`, `Gojek`, `Offline`.
  * Field: Nominal Dana Bersih Masuk (Rp).
  * Field: Tanggal & Waktu (Default: saat ini).
  * Action: Catat Pendapatan.

---

### FR-04: Halaman Laporan Bulanan (`/reports/monthly`)
* **FR-04.1 Filter Periode:** Dropdown pemilihan bulan & tahun.
* **FR-04.2 Ringkasan P&L Bulanan:**
  * Total Omzet Bersih.
  * Total Belanja Bahan.
  * Keuntungan Bersih (`Omzet - Belanja`) dan Margin Persentase.
  * Indikator tanggal tercapainya BEP bulanan (misal: *Target bulanan BEP tercapai pada 18 Okt*).
* **FR-04.3 Heatmap Kalender Harian:** Grid tanggal bulanan dengan highlight lingkaran hijau neon pada hari-hari yang mencetak laba bersih harian.
* **FR-04.4 Bento Kontribusi Penjualan:** Visualisasi proporsi persentase pendapatan per channel selama 1 bulan penuh.
* **FR-04.5 Navigasi Bersih:** Tidak ada tombol mengambang di bawah; navigasi menggunakan header menu.

---

### FR-05: Halaman Riwayat Siklus Modal (`/reports/cycles`)
* **FR-05.1 Header Statistik:** Menampilkan rata-rata durasi balik modal agregat dan total akumulasi profit bersih semua siklus.
* **FR-05.2 List Kartu Siklus:**
  * Header kartu: Identitas siklus (misal `Siklus #12 (8 Okt - 10 Okt)`).
  * Status badge: `Lunas (X hari)` berwarna hijau atau `Masih Berjalan` berwarna kuning.
  * Breakdown: Total Belanja, Total Pendapatan, Keterangan Bahan Terbanyak.
  * Highlight Untung Bersih: `+Rp[Nominal]`.
* **FR-05.3 Drill-Down Detail:** Mengklik kartu siklus menampilkan log item belanja dan log penjualan spesifik pada siklus tersebut.

---

## 3. Non-Functional Requirements (NFR)

* **NFR-01 Performance:** Waktu pemuatan halaman awal (*First Contentful Paint*) $< 1.2$ detik pada koneksi mobile 4G.
* **NFR-02 Responsiveness:** Layout strictly mobile-first (optimal pada viewport lebar 360px – 430px), tetap proporsional dan terpusat (*centered container*) pada layar desktop.
* **NFR-03 Offline Capability:** Mampu menyimpan input secara lokal (*LocalStorage / IndexedDB*) sebelum disinkronkan ke cloud jika jaringan tidak stabil.
* **NFR-04 Data Integrity:** Perhitungan matematis persentase, sisa modal, dan turnover durasi wajib menggunakan pembulatan presisi desimal tanpa floating point drift.

---

## 4. Skema Data (Data Model)

```typescript
export type PlatformChannel = 'shopee' | 'grab' | 'gojek' | 'offline';
export type CycleStatus = 'active' | 'closed_profit';

export interface CapitalCycle {
  id: string;
  cycleNumber: number;
  startDate: string; // ISO 8601
  settledDate: string | null; // ISO 8601
  status: CycleStatus;
  totalExpense: number;
  totalIncome: number;
  netProfit: number;
}

export interface ExpenseItem {
  id: string;
  cycleId: string;
  amount: number;
  notes: string;
  createdAt: string; // ISO 8601
}

export interface IncomeItem {
  id: string;
  cycleId: string;
  channel: PlatformChannel;
  amount: number;
  createdAt: string; // ISO 8601
}
```

---

## 5. Design & Token Specifications

| Token | Nilai | Penggunaan |
| :--- | :--- | :--- |
| **Canvas Background** | `#0D0D0D` | Background halaman gelap pekat |
| **Card Surface** | `#1A1A1C` | Latar kartu bento reguler |
| **Card Surface Muted** | `#242426` | Latar badge, chip, dan input container |
| **Accent Primary** | `#D4F634` | Hero card, active progress bar, CTA utama |
| **Accent Contrast Text** | `#0D0D0D` | Teks di atas warna Lime Accent |
| **Text Primary** | `#FFFFFF` | Angka besar dan teks utama |
| **Text Muted** | `#8E8E93` | Label, tanggal, dan metadata kecil |
| **Border Radius Card** | `28px` – `32px` (`rounded-3xl`) | Bentuk sudut membulat tebal (*squircle*) |
| **Border Radius Pill** | `9999px` (`rounded-full`) | Tombol aksi cepat dan badge status |