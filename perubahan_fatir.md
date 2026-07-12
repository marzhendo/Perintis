# 📝 Catatan Perubahan — Fatir (feature/forum-profile)

> Branch: `feature/forum-profile`
> Periode: 12 Juli 2026

---

## 🎨 1. Modernisasi Tema & Tampilan Global

### `frontend/src/App.jsx`
- Mengubah wrapper utama dari tema gelap ke **tema terang** (`bg-[#FAF6EE] text-[#171C38]`) agar teks di seluruh halaman mudah dibaca.

### `frontend/src/index.css`
- Menambahkan animasi **iOS-style smooth spring** dengan `cubic-bezier(0.16, 1, 0.3, 1)` selama 0.5 detik untuk semua input, tombol, dan kartu.
- Menambahkan efek `press`, `press-sm`, `focus-ring`, `glass-card`, `card-lift`, `btn-primary`, `text-glow-orange`.
- Memperlambat dan menghaluskan semua animasi gestur agar terasa premium.

---

## 🧭 2. Modernisasi Navbar

### `frontend/src/components/Header.jsx`
- Navbar diubah menjadi **putih dengan border navy** tebal 2px.
- Menggabungkan 5 menu alat berat ke dalam satu **dropdown "Alat Bisnis"** agar navbar tidak berantakan.
- Animasi dropdown halus dengan efek fade-in.

---

## 🧮 3. Fitur Baru di Kalkulator Finansial

### `frontend/src/views/Calculator.jsx`
- Tab **"HPP Resep"**: Kalkulator Harga Pokok Penjualan per resep kuliner, terhubung ke harga pangan Bank Indonesia.
- Tab **"Target Profit"**: Simulator pencapaian target profit & omzet bulanan.

### `frontend/src/components/ProfitGoalForm.jsx` *(File Baru)*
- Komponen simulasi target laba dan omzet bulanan.

### `frontend/src/components/RecipeCostForm.jsx` *(File Baru)*
- Komponen form input bahan baku resep dengan kalkulasi otomatis HPP per porsi.

### `frontend/src/components/PromoCalcForm.jsx` *(File Baru)*
- Kalkulator simulasi diskon dan efek promo terhadap margin keuntungan.

### `frontend/src/components/TaxZakatForm.jsx` *(File Baru)*
- Kalkulator estimasi pajak UMKM (PPh Final 0.5%) dan zakat perdagangan.

---

## 🔍 4. Fitur Baru di AI Business Validator

### `frontend/src/views/Validator.jsx`
- Panel **"Detektor Tren Bisnis Viral (AI)"**: 4 kartu ide bisnis trending dengan tombol preset 1-klik.
- Integrasi input pemilihan wilayah (Provinsi → Kab/Kota → Kecamatan).

---

## 📊 5. Detektor Kesehatan Finansial UMKM

### `frontend/src/views/ROIProjections.jsx`
- Kuis diagnosa mandiri 5 pertanyaan yang menghasilkan skor dan rekomendasi kesehatan bisnis.

---

## 💳 6. AI Card Designer (Kartu Nama 3D)

### `frontend/src/views/AICopywriter.jsx`
- Tab **"Kartu Nama 3D"**: Generator kartu nama digital dengan efek **3D flip card** CSS premium.

---

## 🏦 7. Kalkulator KUR (Kredit Usaha Rakyat)

### `frontend/src/views/SertifikasiEkspor.jsx`
- Simulator KUR dengan bunga subsidi 6%, menghitung angsuran bulanan, total bunga, dan rekomendasi plafon.

---

## 🗺️ 8. Modernisasi Peta Lokasi Pasar

### `frontend/src/views/LokasiPasar.jsx`
- Tile peta diubah ke **CartoDB Positron** (minimalis, kontras tinggi).
- Border navy tebal pada container peta.
- **Simulator Kelayakan Lokasi** di sidebar: skor strategis + rekomendasi taktis.
- Sidebar mode "Daftar Wilayah" & "Pilih Manual".

---

## 🌾 9. Kalender Musiman Harga Pangan

### `frontend/src/views/HargaPangan.jsx`
- Grid 12 bulan risiko harga untuk 4 komoditas utama (Cabai Rawit, Bawang Merah, Daging Ayam, Beras Premium).
- Saran taktis mitigasi risiko bahan baku.
- Dropdown 34 provinsi (Bank Indonesia PIHPS).

---

## 🏠 10. Perbaikan Landing Page

### `frontend/src/views/LandingPage.jsx`
- Perbaikan kontras teks lencana dan tombol yang tertimpa latar terang.

---

## 👤 11. Perbaikan Profil & Pengaturan Akun

### `frontend/src/views/ProfilSaya.jsx`
- Integrasi UI modal **Ubah Password**.
- Penyesuaian hover style tombol pengaturan.
- Tombol "Preferensi Notifikasi" dinonaktifkan dengan label *"Segera hadir"*.

---

## 🐍 12. Perbaikan Kompatibilitas Backend Python 3.9

Ditambahkan `from __future__ import annotations` pada file berikut agar kompatibel dengan Python 3.9 (sintaks `X | Y` baru didukung native di Python 3.10+):

| File |
|---|
| `backend/app/services/pihps_service.py` |
| `backend/app/api/routes.py` |
| `backend/app/api/forum_routes.py` |
| `backend/app/core/config.py` |
| `backend/app/dependencies/auth.py` |
| `backend/app/schemas/fase2_schemas.py` |
| `backend/app/services/commodity_service.py` |

Ditambahkan `os.makedirs(..., exist_ok=True)` di `pihps_service.py` agar folder `data/` otomatis dibuat saat scraper pertama kali dijalankan.

---

## 🔄 13. Sinkronisasi Git & Merge

- Merge branch `main` (scraper BI, location flow, security audit fixes) ke `feature/forum-profile`.
- Semua konflik diselesaikan dan di-push ke `origin/feature/forum-profile`.
- **22/22 unit test frontend** lulus (0 kegagalan).
- **Build produksi** berhasil dikompilasi.

---

## 📁 Ringkasan File

### File Baru:
- `frontend/src/components/ProfitGoalForm.jsx`
- `frontend/src/components/RecipeCostForm.jsx`
- `frontend/src/components/PromoCalcForm.jsx`
- `frontend/src/components/TaxZakatForm.jsx`

### File yang Dimodifikasi (Frontend):
- `frontend/src/App.jsx`
- `frontend/src/index.css`
- `frontend/src/components/Header.jsx`
- `frontend/src/views/Calculator.jsx`
- `frontend/src/views/Validator.jsx`
- `frontend/src/views/ROIProjections.jsx`
- `frontend/src/views/AICopywriter.jsx`
- `frontend/src/views/SertifikasiEkspor.jsx`
- `frontend/src/views/LokasiPasar.jsx`
- `frontend/src/views/HargaPangan.jsx`
- `frontend/src/views/LandingPage.jsx`
- `frontend/src/views/ProfilSaya.jsx`

### File yang Dimodifikasi (Backend):
- `backend/app/services/pihps_service.py`
- `backend/app/api/routes.py`
- `backend/app/api/forum_routes.py`
- `backend/app/core/config.py`
- `backend/app/dependencies/auth.py`
- `backend/app/schemas/fase2_schemas.py`
- `backend/app/services/commodity_service.py`
