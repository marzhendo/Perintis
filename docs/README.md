# Perintis

> Platform Validasi Ide Bisnis & Simulasi Finansial UMKM

Perintis membantu calon pelaku UMKM mengevaluasi ide bisnis mereka melalui analisis berbasis AI serta simulasi finansial sederhana sebelum memulai usaha.

---

## ✨ Features

- 🤖 AI Business Validator
  - Analisis kelayakan ide bisnis
  - Evaluasi Market, Competitor, Trend, Risk, dan Potential
  - Skor kelayakan berbentuk rating

- 📊 Financial Calculator
  - Simulasi modal usaha
  - Perhitungan HPP
  - Break-Even Point (BEP)
  - Estimasi Return on Investment (ROI)

- 🛒 Commodity Price Dashboard
  - Referensi harga bahan pokok
  - Digunakan sebagai dasar simulasi biaya usaha

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS

### Backend

- Python
- FastAPI
- Pydantic
- Google Generative AI SDK

### Deployment

- Firebase Hosting
- Render / Koyeb

---

## Repository Structure

```text
perintis/
│
├── frontend/
├── backend/
├── docs/
├── assets/
├── scripts/
└── .antigravity/
```

---

## Documentation

Semua dokumentasi proyek berada pada folder `docs`.

| Document | Description |
|----------|-------------|
| PRD.md | Product Requirement Document |
| SKPL.md | Software Requirement Specification |
| DPPL.md | Software Design Description |

---

## AI Development

Project ini dikembangkan menggunakan pendekatan **Spec-Driven Development (SDD)**.

Seluruh implementasi harus mengacu pada spesifikasi proyek dan aturan yang terdapat pada folder `.antigravity`.

```
.antigravity/

AGENTS.md
SKILLS.md
PROJECT.md
ARCHITECTURE.md
API.md
CONVENTIONS.md
CHECKLIST.md
```

---

## Development Workflow

```text
PRD
    ↓
SKPL
    ↓
DPPL
    ↓
Planning
    ↓
Implementation
    ↓
Review
```

Setiap implementasi harus dapat ditelusuri kembali ke spesifikasi.

---

## Current Scope (MVP)

- Dashboard Harga Pangan
- AI Business Validator
- Financial Calculator

---

## Out of Scope

Fitur berikut **belum** menjadi bagian dari MVP.

- Authentication
- User Management
- Database
- Payment System
- Business History
- Admin Dashboard

---

## Contributing

1. Baca dokumentasi pada folder `docs/`
2. Ikuti aturan pada folder `.antigravity/`
3. Pastikan implementasi sesuai dengan spesifikasi
4. Buat Pull Request

---

## License

This project is developed for educational purposes and software development competitions.