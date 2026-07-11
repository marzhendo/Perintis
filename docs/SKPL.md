# Software Requirements Specification (SKPL)

# Perintis

> Platform Validasi Ide Bisnis & Simulasi Finansial UMKM

---

# Document Information

| Field | Value |
|--------|-------|
| Document | Software Requirements Specification |
| Project | Perintis |
| Version | 3.0 |
| Status | Draft |
| Last Updated | 11 July 2026 |

---

# 1. Introduction

## 1.1 Purpose

Dokumen ini mendefinisikan kebutuhan fungsional dan non-fungsional perangkat lunak Perintis.

Dokumen ini menjadi acuan implementasi sistem dan merupakan turunan langsung dari Product Requirements Document (PRD).

Seluruh implementasi harus dapat ditelusuri kembali ke requirement yang terdapat pada dokumen ini.

---

## 1.2 Scope

Perintis merupakan aplikasi web yang membantu calon pelaku UMKM mengevaluasi ide bisnis dan melakukan simulasi finansial.

Sistem menyediakan tiga kemampuan utama:

- Menampilkan referensi harga bahan pokok.
- Melakukan validasi ide bisnis.
- Melakukan simulasi finansial.

---

## 1.3 Intended Users

Pengguna utama adalah calon pelaku UMKM yang ingin mengevaluasi ide bisnis sebelum memulai usaha.

---

# 2. Functional Requirements

## FR-01 Commodity Price Dashboard

### Description

Sistem harus menyediakan daftar referensi harga bahan pokok yang dapat digunakan sebagai dasar simulasi biaya usaha.

### Acceptance Criteria

- Harga bahan pokok dapat ditampilkan kepada pengguna.
- Daftar harga dapat diperbarui tanpa mengubah antarmuka pengguna.
- Jika data tidak tersedia, sistem menampilkan pesan yang sesuai.

---

## FR-02 Business Validator

### Description

Sistem harus memungkinkan pengguna mengirimkan ide bisnis untuk dianalisis.

### Input

- Nama usaha
- Deskripsi ide
- Target pasar

### Output

- Skor kelayakan
- Analisis Market
- Analisis Competitor
- Analisis Trend
- Analisis Risk
- Analisis Potential

### Validation

Semua field wajib diisi.

---

## FR-03 Financial Calculator

### Description

Sistem harus menghitung estimasi finansial berdasarkan data yang diberikan pengguna.

### Input

- Modal awal
- Biaya operasional
- Harga jual
- Biaya bahan baku

### Output

- HPP
- Margin
- Break-Even Point
- Estimasi ROI

### Validation

Seluruh nilai numerik harus bernilai nol atau lebih besar.

---

## FR-04 Error Handling

Sistem harus memberikan pesan kesalahan yang informatif apabila:

- Input tidak valid.
- Data tidak ditemukan.
- Analisis tidak dapat diproses.

---

# 3. Non Functional Requirements

## NFR-01 Performance

- Kalkulasi finansial harus memberikan hasil dalam waktu yang wajar.
- Sistem tetap dapat digunakan ketika proses analisis membutuhkan waktu lebih lama.

---

## NFR-02 Reliability

- Sistem harus menangani kegagalan proses tanpa menyebabkan aplikasi berhenti bekerja.

---

## NFR-03 Security

- Data pengguna tidak boleh diekspos kepada pihak lain.
- Informasi sensitif harus diproses secara aman.

---

## NFR-04 Usability

- Antarmuka harus mudah dipahami oleh pengguna awam.
- Sistem dapat digunakan pada desktop maupun perangkat mobile.

---

## NFR-05 Maintainability

Requirement harus dapat dikembangkan tanpa memengaruhi fitur yang tidak berkaitan.

---

# 4. Business Rules

## BR-01

Simulasi finansial menggunakan referensi harga bahan pokok yang tersedia pada sistem.

---

## BR-02

Hasil validasi AI bersifat rekomendasi, bukan keputusan bisnis final.

---

## BR-03

Perhitungan finansial harus selalu menggunakan rumus yang konsisten.

---

# 5. External Interfaces

## User Interface

Sistem menyediakan:

- Dashboard Harga Pangan
- Business Validator
- Financial Calculator

---

## System Interface

Sistem harus menyediakan antarmuka komunikasi antara frontend dan backend.

Seluruh komunikasi menggunakan format data yang konsisten.

---

# 6. Traceability

| Requirement | Related PRD |
|-------------|-------------|
| FR-01 | Commodity Dashboard |
| FR-02 | AI Business Validator |
| FR-03 | Financial Calculator |
| FR-04 | System Reliability |

---

# 7. Out of Scope

Berikut bukan bagian dari MVP.

- Authentication
- User Profile
- Dashboard Admin
- Marketplace
- POS
- Payment
- User History

---

# Changelog

| Version | Description |
|----------|-------------|
| 3.0 | Refactored into Markdown and aligned with Spec-Driven Development |