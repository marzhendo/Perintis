# Perintis 🚀

> **Platform Validasi Ide Bisnis & Simulasi Finansial UMKM**

Perintis adalah platform berbasis web yang dirancang untuk membantu calon pelaku UMKM di Indonesia memvalidasi ide bisnis mereka dan melakukan simulasi kelayakan finansial secara instan. Menggabungkan teknologi kecerdasan buatan (AI) untuk analisis kualitatif dan algoritma kalkulasi finansial kuantitatif, Perintis memberikan laporan komprehensif yang tajam, actionable, dan mudah dipahami agar pengusaha bisa mengambil keputusan dengan percaya diri.

---

## 🛠️ Tech Stack

**Frontend**
- **Framework:** React 19 + Vite 8
- **Styling:** TailwindCSS 4
- **Komponen/Icon:** Lucide React, Recharts (Visualisasi), Leaflet (Peta)

**Backend**
- **Framework:** FastAPI (Python)
- **Data Validation:** Pydantic
- **AI Integration:** Google Generative AI SDK (`google-genai`)
- **Arsitektur:** Layered Architecture (Decoupled Monorepo)

---

## ✨ Fitur Utama

- **🧠 AI Business Validator (Unggulan):** Menganalisa kelayakan ide bisnis menggunakan model *Gemini 3.1-Flash-Lite*. Sistem membedah ide berdasarkan 5 dimensi: potensi pasar, lanskap kompetitor, tren, risiko, dan potensi pertumbuhan.
- **🛡️ AI Fallback System:** Sistem *highly resilient*. Jika layanan AI mengalami *timeout* atau API Key limit/invalid, backend akan otomatis fallback ke metode penilaian *keyword-matching* secara instan (0 downtime).
- **📈 Kalkulator Finansial UMKM:** Menghitung HPP (Harga Pokok Penjualan), Margin Keuntungan, BEP (Break Even Point), dan estimasi ROI (Return of Investment) secara otomatis.
- **🌾 Dashboard Harga Pangan:** Menampilkan data komoditas bahan pokok lokal yang relevan dengan UMKM.

---

## 📋 Prerequisites

Sebelum memulai, pastikan perangkat Anda memiliki:
- **Node.js** (v18.0 atau lebih baru)
- **Python** (v3.10 atau lebih baru)
- **Git**

---

## 🚀 Setup & Installation (Jalankan secara lokal)

Ikuti langkah-langkah di bawah ini secara berurutan untuk menjalankan proyek dari nol.

### 1. Clone Repository
```bash
git clone https://github.com/[ISI MANUAL: USERNAME]/perintis.git
cd perintis
```

### 2. Setup Backend (FastAPI)
Buka terminal baru dan masuk ke folder `backend`:
```bash
cd backend

# Buat virtual environment
python -m venv venv

# Aktivasi virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# Install dependensi
pip install -r requirements.txt

# Buat file environment (.env)
cp .env.example .env
```

### 3. Konfigurasi API Key (Gemini AI)
Fitur unggulan AI Validator membutuhkan API Key dari Google:
1. Buka [Google AI Studio (https://aistudio.google.com/apikey)](https://aistudio.google.com/apikey).
2. Buat API Key baru secara gratis.
3. Buka file `backend/.env` dan paste key Anda:
   ```env
   GEMINI_API_KEY=AIzaSy_masukkan_key_anda_di_sini
   ```
*(Catatan Juri: Jika Anda tidak memasukkan API Key atau membiarkannya kosong, aplikasi **tetap dapat berjalan normal** menggunakan algoritma Fallback statis kami. Namun, untuk melihat kemampuan penuh aplikasi, sangat disarankan memasukkan GEMINI_API_KEY).*

### 4. Jalankan Backend Server
Di dalam terminal folder `backend` yang sama (pastikan virtual environment masih aktif), jalankan:
```bash
python -m uvicorn app.main:app --reload --port 8000
```
Backend akan berjalan di `http://localhost:8000`.

### 5. Setup & Jalankan Frontend (React + Vite)
Buka terminal baru (biarkan terminal backend tetap berjalan), masuk ke folder `frontend`:
```bash
cd frontend

# Install semua package npm
npm install

# Buat file environment (.env)
cp .env.example .env

# Jalankan Frontend Server
npm run dev
```

### 6. Akses Aplikasi
Frontend biasanya akan otomatis terbuka. Jika tidak, buka browser dan kunjungi:
👉 **`http://localhost:5173`** (atau port lain yang tertera di terminal frontend).

---

## ⚙️ Environment Variables

Berikut adalah environment variables yang digunakan di aplikasi ini:

| Variable | Lokasi File | Sifat | Keterangan |
|---|---|---|---|
| `GEMINI_API_KEY` | `backend/.env` | Optional* | Token API Google GenAI untuk fitur Validator. *Jika kosong, aplikasi pindah ke mode Fallback.* |
| `VITE_API_BASE_URL` | `frontend/.env` | Wajib | URL akses API Backend. Default: `http://localhost:8000`. |

---

## 📖 API Documentation

Backend menyediakan antarmuka REST API yang tervalidasi secara ketat dan konsisten menggunakan format Response Standard. 

Detail lengkap *request body*, *response schema*, dan daftar Error Code (`VALIDATION_ERROR`, `NOT_FOUND`, `INTERNAL_ERROR`) dapat dibaca di dokumen:
👉 **[API Contract (.antigravity/API.md)](.antigravity/API.md)**.

*Ringkasan Endpoint:*
- `GET /api/commodities` : Mengambil data komoditas pangan.
- `POST /api/calculate` : Kalkulasi HPP, Margin, BEP, dan ROI.
- `POST /api/validate` : Mengirim parameter ide bisnis untuk dianalisis oleh AI.

---

## 👥 Tim & Kontribusi

*   **[ISI MANUAL: Nama Anggota 1]** - Project Manager
*   **[ISI MANUAL: Nama Anggota 2]** - Frontend Developer
*   **[ISI MANUAL: Nama Anggota 3]** - Backend Developer
