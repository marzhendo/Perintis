# Panduan Integrasi SMTP Gmail untuk Pengiriman Email OTP

Untuk memastikan email OTP terkirim secara nyata ke kotak masuk pengguna (bukan sekadar tercetak di log / mode dev), Anda perlu mengonfigurasi parameter SMTP pada environment variables aplikasi Anda di **Google Cloud Run**.

Di bawah ini adalah langkah-langkah lengkap menggunakan **Gmail** sebagai server SMTP pengirim gratis.

---

## Langkah 1: Aktifkan Verifikasi 2 Langkah di Akun Google Pengirim

Google mewajibkan akun pengirim menggunakan **App Password** (Sandi Aplikasi) alih-alih password Gmail utama Anda karena alasan keamanan.

1. Buka halaman pengaturan Google Akun Anda: [myaccount.google.com](https://myaccount.google.com/).
2. Masuk ke tab **Security** (Keamanan) di sebelah kiri.
3. Di bawah bagian *"How you sign in to Google"*, pastikan **2-Step Verification** (Verifikasi 2 Langkah) berstatus **ON** (Aktif).

---

## Langkah 2: Buat Sandi Aplikasi (App Password)

1. Di kolom pencarian bagian atas halaman Google Akun Anda, ketik **"App passwords"** (atau "Sandi aplikasi"), lalu klik hasil pencariannya.
2. Masukkan password Google utama Anda jika diminta konfirmasi.
3. Di kolom *"App name"*, masukkan nama aplikasi Anda (misal: `Perintis UMKM`).
4. Klik **Create** (Buat).
5. Salin kode sandi aplikasi 16-karakter yang muncul di dalam kotak kuning (misalnya: `abcd efgh ijkl mnop`). 
   *Penting: Kode ini hanya muncul sekali. Catat atau simpan sementara tanpa spasi: `abcdefghijklmnop`.*

---

## Langkah 3: Konfigurasi Environment Variables di GCP Cloud Run

Agar aplikasi backend FastAPI Anda yang berjalan di GCP Cloud Run dapat membaca konfigurasi ini, Anda harus memasukkan sandi tersebut ke variabel lingkungan:

1. Buka **[GCP Console Cloud Run](https://console.cloud.google.com/run?project=perintis-umkm)**.
2. Klik nama layanan backend Anda: **`perintis-backend`**.
3. Di bagian atas, klik tombol **EDIT & Deploy New Revision**.
4. Scroll ke bawah ke bagian **Variables & Secrets** (atau tab *Variables*).
5. Tambahkan variabel-variabel lingkungan berikut:

| Nama Variabel (Key) | Nilai (Value) | Keterangan |
| :--- | :--- | :--- |
| **`SMTP_HOST`** | `smtp.gmail.com` | Host SMTP Gmail |
| **`SMTP_PORT`** | `587` | Port default STARTTLS |
| **`SMTP_USER`** | `email_anda@gmail.com` | Email Gmail Anda yang bertindak sebagai pengirim |
| **`SMTP_PASSWORD`** | `abcdefghijklmnop` | **Sandi aplikasi 16-karakter** yang dibuat di Langkah 2 (tanpa spasi) |
| **`SMTP_FROM_NAME`** | `Perintis UMKM` | Nama pengirim yang tampil di email pengguna |

6. Klik tombol **Deploy** di bagian paling bawah. Cloud Run akan membuat revisi baru dan menerapkan konfigurasi tersebut secara aman.

---

## Cara Alternatif: Mengatur Secara Lokal (`.env`)

Untuk pengujian lokal di laptop Anda, Anda cukup membuat file `backend/.env` dan menambahkan baris berikut:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=email_anda@gmail.com
SMTP_PASSWORD=abcdefghijklmnop
SMTP_FROM_NAME="Perintis UMKM"
```
Jalankan server backend lokal Anda kembali, dan email OTP nyata akan langsung meluncur ke email pengguna saat mereka memicu fitur "Lupa Password"!
