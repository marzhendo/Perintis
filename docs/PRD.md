# Product Requirements Document (PRD)

# Perintis

> Platform Validasi Ide Bisnis & Simulasi Finansial UMKM

---

## Document Information

| Field | Value |
|--------|-------|
| Document | Product Requirements Document |
| Project | Perintis |
| Version | 1.0 |
| Status | Draft |
| Last Updated | 11 July 2026 |

---

# 1. Product Overview

Perintis adalah platform berbasis web yang membantu calon pelaku UMKM mengevaluasi kelayakan ide bisnis sebelum memulai usaha.

Platform ini menggabungkan analisis berbasis Artificial Intelligence (AI) dengan simulasi finansial sederhana sehingga pengguna dapat memperoleh gambaran mengenai potensi bisnis dan estimasi kebutuhan modal sejak tahap perencanaan.

Perintis berfokus pada proses validasi awal (pre-business validation), bukan pada operasional bisnis setelah usaha berjalan.

---

# 2. Problem Statement

Banyak calon pelaku UMKM memulai usaha berdasarkan asumsi tanpa melakukan validasi pasar maupun simulasi finansial.

Akibatnya:

- Ide bisnis tidak sesuai kebutuhan pasar.
- Perhitungan modal dilakukan secara manual.
- Sulit memperkirakan titik impas (Break-Even Point).
- Tidak memiliki gambaran kapan modal dapat kembali.
- Tidak memiliki referensi harga bahan pokok yang relevan saat melakukan estimasi biaya.

Proses validasi yang tersedia saat ini umumnya membutuhkan konsultasi dengan mentor bisnis atau menggunakan berbagai aplikasi yang terpisah.

Perintis bertujuan menyederhanakan proses tersebut menjadi satu platform yang mudah digunakan.

---

# 3. Goals

Perintis dikembangkan untuk membantu calon pelaku UMKM membuat keputusan bisnis yang lebih terinformasi.

Tujuan utama produk:

- Membantu pengguna mengevaluasi kelayakan ide bisnis.
- Membantu pengguna menghitung estimasi modal usaha.
- Membantu pengguna memahami HPP, BEP, dan ROI.
- Menyediakan referensi harga bahan pokok sebagai dasar simulasi biaya.
- Menyederhanakan proses validasi bisnis menjadi satu aplikasi berbasis web.

---

# 4. Target Users

## Primary User

Calon pelaku UMKM.

Karakteristik:

- Baru akan memulai usaha.
- Tidak memiliki latar belakang bisnis yang kuat.
- Membutuhkan panduan sederhana.
- Membutuhkan estimasi finansial secara cepat.

---

# 5. Product Scope

MVP Perintis terdiri dari tiga fitur utama.

## 1. Commodity Price Dashboard

Menampilkan referensi harga bahan pokok yang digunakan sebagai dasar simulasi biaya usaha.

---

## 2. AI Business Validator

Pengguna mengisi:

- Nama usaha
- Deskripsi ide
- Target pasar

Sistem memberikan:

- Skor kelayakan
- Analisis Market
- Analisis Competitor
- Analisis Trend
- Analisis Risiko
- Analisis Potensi

---

## 3. Financial Calculator

Pengguna memasukkan informasi biaya usaha.

Sistem menghitung:

- Harga Pokok Penjualan (HPP)
- Margin
- Break-Even Point (BEP)
- Estimasi Return on Investment (ROI)

---

# 6. Out of Scope

Fitur berikut tidak termasuk dalam MVP.

- Authentication
- User account
- Dashboard admin
- Penyimpanan histori pengguna
- Database relasional
- Payment gateway
- Marketplace
- Point of Sale (POS)
- Sistem transaksi

---

# 7. Success Metrics

Produk dianggap berhasil apabila:

- Pengguna dapat melakukan validasi ide bisnis tanpa bantuan pihak lain.
- Pengguna dapat memperoleh simulasi finansial dalam beberapa detik.
- Antarmuka mudah dipahami oleh pengguna non-teknis.
- Seluruh fitur MVP dapat digunakan melalui browser desktop maupun mobile.

---

# 8. Product Principles

Perintis dikembangkan berdasarkan prinsip berikut.

### Simplicity

Pengguna tidak perlu memahami istilah bisnis yang kompleks.

---

### Fast Feedback

Analisis dan simulasi diberikan secepat mungkin.

---

### Practical

Seluruh hasil yang diberikan harus dapat langsung digunakan sebagai dasar pengambilan keputusan.

---

### Accessible

Aplikasi dapat digunakan tanpa instalasi tambahan melalui browser modern.

---

# 9. Constraints

Untuk tahap MVP:

- Frontend menggunakan React (Vite).
- Backend menggunakan FastAPI.
- Data harga bahan pokok masih menggunakan JSON lokal.
- Deployment menggunakan layanan free tier.
- Tidak menggunakan database.

---

# 10. Assumptions

Produk mengasumsikan bahwa:

- Pengguna memiliki akses internet.
- AI Provider tersedia.
- Data harga bahan pokok diperbarui secara berkala.
- Browser mendukung teknologi web modern.

---

# 11. High-Level User Flow

```text
Open Website
        │
        ▼
Choose Feature
        │
        ├──────────────┐
        ▼              ▼
AI Validator    Financial Calculator
        │              │
        ▼              ▼
Submit Data     Submit Data
        │              │
        ▼              ▼
Receive Result
        │
        ▼
Review Business Decision
```

---

# 12. Traceability

| Document | Purpose |
|----------|---------|
| PRD | Menjelaskan tujuan produk dan ruang lingkup bisnis |
| SKPL | Mendefinisikan kebutuhan perangkat lunak |
| DPPL | Mendefinisikan rancangan implementasi |

---

# Changelog

| Version | Date | Description |
|----------|------|-------------|
| 1.0 | 11 July 2026 | Initial Product Requirements Document |