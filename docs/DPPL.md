# Software Design Description (DPPL)

# Perintis

> Platform Validasi Ide Bisnis & Simulasi Finansial UMKM

---

# Document Information

| Field | Value |
|--------|-------|
| Document | Software Design Description |
| Project | Perintis |
| Version | 3.0 |
| Status | Draft |
| Last Updated | 11 July 2026 |

---

# 1. Introduction

## Purpose

Dokumen ini menjelaskan rancangan implementasi perangkat lunak Perintis berdasarkan kebutuhan yang telah didefinisikan pada SKPL.

Dokumen ini menjadi acuan implementasi teknis bagi seluruh anggota tim pengembang.

---

# 2. Architecture Overview

Perintis menggunakan arsitektur **Decoupled Monorepo**, di mana frontend dan backend dikembangkan secara independen namun berada dalam satu repository.

```text
Browser
    │
    ▼
React (Frontend)
    │
REST API
    │
    ▼
FastAPI (Backend)
    │
 ┌──┴────────────┐
 ▼               ▼
Financial     AI Validator
Service         Service
        │
        ▼
Commodity Service
        │
        ▼
commodity_prices.json
```

---

# 3. Technology Stack

## Frontend

- React
- Vite
- TailwindCSS

---

## Backend

- Python
- FastAPI
- Pydantic
- Google Generative AI SDK

---

## Deployment

Frontend

- Firebase Hosting

Backend

- Render / Koyeb

---

# 4. Repository Structure

```text
perintis/

├── frontend/
├── backend/
├── docs/
├── assets/
├── scripts/
└── .antigravity/
```

---

# 5. Frontend Design

Frontend menggunakan **Feature-Based Architecture**.

```text
frontend/

src/

assets/

components/

features/

validator/

calculator/

commodity/

hooks/

layouts/

pages/

router/

services/

utils/

contexts/

App.jsx
```

## Rules

- Component tidak boleh memanggil API secara langsung.
- Semua komunikasi backend melalui service.
- Business logic tidak boleh berada di React Component.
- Feature memiliki isolasi folder masing-masing.

---

# 6. Backend Design

Backend menggunakan **Layered Architecture**.

```text
backend/

app/

api/

routes/

validator.py

calculator.py

commodity.py

core/

config.py

schemas/

validator.py

calculator.py

commodity.py

services/

validator_service.py

financial_service.py

commodity_service.py

data/

commodity_prices.json

main.py
```

---

## Layer Responsibility

### Route

Bertanggung jawab untuk:

- menerima request
- validasi request
- mengembalikan response

Route tidak boleh:

- menghitung ROI
- membaca JSON
- memanggil AI Provider

---

### Service

Bertanggung jawab untuk:

- business logic
- financial calculation
- AI orchestration

Service tidak mengetahui HTTP maupun FastAPI.

---

### Data Source

Menyediakan data harga bahan pokok.

Implementasi MVP menggunakan:

```
commodity_prices.json
```

Implementasi di masa depan dapat diganti database tanpa mengubah Route maupun Service.

---

# 7. API Contract

## GET /api/commodities

Mengambil daftar harga bahan pokok.

### Response

```json
{
  "commodities": [
    {
      "id": "beras",
      "name": "Beras Medium",
      "unit": "kg",
      "price": 14500,
      "updated_at": "2026-07-11"
    }
  ]
}
```

---

## POST /api/validate

Mengirim ide bisnis untuk dianalisis AI.

### Request

```json
{
  "nama_usaha": "",
  "deskripsi_ide": "",
  "target_pasar": ""
}
```

### Response

```json
{
  "score": 4.8,
  "analysis": {
    "market": "",
    "competitor": "",
    "trend": "",
    "risk": "",
    "potential": ""
  }
}
```

---

## POST /api/calculate

Menghitung simulasi finansial.

### Request

```json
{
  "modal_awal": 0,
  "biaya_operasional": 0,
  "harga_jual": 0,
  "biaya_bahan": 0
}
```

### Response

```json
{
  "hpp": 0,
  "margin": 0,
  "bep": 0,
  "roi": 0
}
```

---

## Error Response

Seluruh endpoint menggunakan format error yang sama. Tidak ada raw exception yang diekspos ke klien.

```json
{
    "message": "Validation error at 'body.modal_awal': Field required",
    "code": "VALIDATION_ERROR"
}
```

Daftar error `code` yang digunakan:
- `VALIDATION_ERROR` (HTTP 400 & 422): Input dari klien tidak valid.
- `NOT_FOUND` (HTTP 404): URL endpoint atau resource tidak ditemukan.
- `INTERNAL_ERROR` (HTTP 500): Kesalahan server yang tidak terduga. Detail exception (stack trace) tidak diekspos ke klien, melainkan dicatat di log server.

---

# 8. State Management

Frontend menggunakan state lokal React.

```
Page

↓

API Service

↓

useState

↓

UI
```

Tidak menggunakan global state management pada MVP.

---

# 9. Security

- API Key disimpan pada Environment Variable.
- Secret tidak boleh berada di repository.
- Frontend tidak mengetahui API Key.
- Backend melakukan validasi seluruh input.
- CORS hanya mengizinkan domain frontend resmi.

---

# 10. Deployment

## Frontend

Firebase Hosting

```
npm run build

↓

firebase deploy
```

---

## Backend

Render / Koyeb

```
git push

↓

Automatic Deploy

↓

FastAPI
```

---

# 11. Future Evolution

Untuk MVP:

```
CommodityService

↓

commodity_prices.json
```

Rencana berikutnya:

```
CommodityService

↓

CommodityRepository

↓

PostgreSQL
```

Perubahan ini tidak memengaruhi frontend maupun API.

---

# 12. Design Decisions

- Menggunakan Monorepo untuk mempermudah kolaborasi tiga developer.
- Menggunakan Feature-Based Architecture pada frontend.
- Menggunakan Layered Architecture pada backend.
- Menggunakan JSON lokal sebagai data source MVP.
- Menyediakan abstraksi Service agar migrasi ke database tidak memengaruhi API.
- Menambahkan endpoint `GET /api/commodities` untuk mendukung Dashboard Harga Pangan sesuai kebutuhan pada SKPL.

---

# 13. Traceability

| SKPL Requirement | Implementation |
|------------------|----------------|
| FR-01 | GET /api/commodities |
| FR-02 | POST /api/validate |
| FR-03 | POST /api/calculate |
| FR-04 | Error Response Convention |

---

# Changelog

| Version | Description |
|----------|-------------|
| 3.0 | Refactored to Markdown, migrated to Monorepo architecture, introduced layered backend, feature-based frontend, standardized API contracts, added commodity endpoint, and aligned with Spec-Driven Development. |