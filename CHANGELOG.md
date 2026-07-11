# Changelog

Semua perubahan penting pada project Perintis dicatat di sini.
Format mengikuti [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased] — feat/fase2-forum-profile

### Added
- **Database Schemas (Fase 2)**
  - `ForumThread`, `ForumComment`, `ForumLike` untuk fitur komunitas.
  - `Notification` untuk notifikasi balasan dan like forum.
  - `UserActivity` untuk mencatat aktivitas validasi, simulasi, dan forum secara riil.
  - Penambahan kolom `phone` dan `bio` pada tabel `User`.
- **Public & Protected Endpoints**
  - `GET /api/forum/threads` (Public) - list thread + author badge dinamis.
  - `POST /api/forum/threads` (Protected).
  - `POST /api/forum/threads/{id}/comments` (Protected) - otomatis memicu `Notification` ke pemilik thread.
  - `POST /api/forum/threads/{id}/like` (Protected) - toggle like.
  - `GET /api/notifications` & `PATCH /api/notifications/{id}/read` (Protected).
  - `GET /api/profile/stats` (Protected) - return akumulasi `UserActivity` aktual.
  - `PATCH /api/profile` (Protected) - update profil tanpa mengubah email.
- **Activity Triggering**
  - Dependency baru `get_current_user_optional()` untuk mendeteksi user login pada endpoint public.
  - `/api/validate` dan `/api/calculate` sekarang menyimpan log `UserActivity` (tipe validasi/simulasi) HANYA jika pengguna sedang login. Fitur dasar tetap public.

### Changed
- File eksperimen `backend/test_*.py` sekarang dimasukkan ke `.gitignore` untuk mencegah script testing naik ke repo.

---

## [0.4.0] — feat/auth-system

### Added
- **Database Foundation (SQLite + SQLAlchemy)**
  - `backend/app/database.py`: SQLAlchemy engine, `SessionLocal`, `Base`, dan `get_db()` dependency
  - `backend/app/models/user.py`: Model `User` dengan kolom `id`, `email` (unique), `password_hash`, `name`, `created_at`
  - Database file (`perintis.db`) di-exclude dari Git via `.gitignore`

- **Sistem Autentikasi Email + Password**
  - `POST /api/auth/register`: Register akun baru, auto-login setelah berhasil, return `user + token`
  - `POST /api/auth/login`: Login dengan email & password, return `user + token`
  - `GET /api/auth/me`: Endpoint terproteksi, return data user yang sedang login
  - Password di-hash menggunakan **bcrypt** (bukan plain text, bukan MD5/SHA)
  - Token menggunakan **JWT** dengan expiry 24 jam

- **Route Protection Infrastructure**
  - `backend/app/dependencies/auth.py`: `get_current_user()` FastAPI dependency siap dipakai di Fase 2+ (Forum, Profil, Notifikasi)

- **Error Code Baru**
  - `UNAUTHORIZED` (HTTP 401) ditambahkan ke global exception handler

- **Pydantic Schemas Baru**
  - `UserRegister`, `UserLogin`, `UserResponse`, `Token`, `AuthResponse`
  - `UserResponse` tidak pernah mengekspos `password_hash` ke client

- **Config**
  - `JWT_SECRET_KEY`, `JWT_ALGORITHM`, `JWT_EXPIRE_HOURS` ditambahkan ke `core/config.py`
  - `JWT_SECRET_KEY` wajib diisi via environment variable (tidak di-hardcode)

### Changed
- **`backend/requirements.txt`**: Tambah `sqlalchemy`, `bcrypt`, `python-jose[cryptography]`, `python-multipart`, `email-validator`
- **`backend/.env.example`**: Tambah `JWT_SECRET_KEY`
- **`frontend/.env.example`**: Fix nama variabel dari `VITE_API_URL` → `VITE_API_BASE_URL` (sinkron dengan yang dipakai di kode)
- **`backend/app/main.py`**: Daftarkan auth router, inisialisasi `Base.metadata.create_all()` saat startup
- **`backend/app/schemas/schemas.py`**: Tambah auth schemas, gunakan `EmailStr` untuk validasi format email
- **`backend/app/core/config.py`**: Tambah JWT configuration
- **`.gitignore`**: Tambah `*.db` untuk mengecualikan file database SQLite
- **`README.md`**: Tulis ulang untuk submission lomba — instruksi setup lengkap, env variable table, API documentation reference
- **`docs/DPPL.md`**: Update error response contract (tambah `VALIDATION_ERROR`, `NOT_FOUND`, `INTERNAL_ERROR`, `UNAUTHORIZED`)
- **`.antigravity/API.md`**: Lengkapi placeholder dengan actual request/response schema

### Security
- Password tidak pernah disimpan dalam bentuk plain text
- `password_hash` tidak pernah dikembalikan ke client dalam response apapun
- JWT secret key wajib dari environment variable
- Database file tidak masuk version control

### Not Changed (Regression Safe)
- `GET /api/commodities` — tetap public, tidak terpengaruh
- `POST /api/calculate` — tetap public, tidak terpengaruh
- `POST /api/validate` — tetap public, tidak terpengaruh

---

## [0.3.0] — feat/gemini-validator-integration

### Added
- Integrasi Google Gemini AI (`gemini-3.1-flash-lite`) untuk endpoint `/api/validate`
- Sistem fallback keyword-matching otomatis jika AI tidak tersedia
- Retry logic dengan timeout 25 detik
- Global exception handler terpusat di `main.py` (`VALIDATION_ERROR`, `NOT_FOUND`, `INTERNAL_ERROR`)
- Standarisasi format error response `{"message": "...", "code": "..."}` di seluruh endpoint

### Changed
- Model AI dioptimasi dari `gemini-3.5-flash` ke `gemini-3.1-flash-lite` (response time: 6.83s → 1.79s rata-rata)
- `thinking_level="minimal"` di-set eksplisit agar behavior tidak bergantung pada default Google
- Hapus manual `try-except` di route layer — error handling dipindah ke global handler

### Fixed
- FE timeout handler: tambah `AbortController` 25s di `validatorApi.js`
- Sinkronisasi mapping `verdict` antara FE dan BE

---

## [0.2.0] — feat/frontend-polishing

### Added
- UI Polish keseluruhan frontend (React + Vite + TailwindCSS)
- Halaman: Dashboard Harga Pangan, AI Validator, Kalkulator Finansial, Forum Terbuka, Lokasi Pasar, Profil, Notifikasi
- Komponen: `AuthModal`, `Header`, `BottomNav`, `Toast`, `ErrorBoundary`, skeleton loading
- Peta interaktif (Leaflet) untuk fitur Lokasi Pasar
- Grafik proyeksi ROI menggunakan Recharts

---

## [0.1.0] — Initial Setup

### Added
- Monorepo setup: `frontend/` (React + Vite) dan `backend/` (FastAPI)
- Endpoint awal: `GET /api/commodities`, `POST /api/calculate`, `POST /api/validate`
- Data komoditas dari `commodity_prices.json`
- Dokumentasi: `PRD.md`, `SKPL.md`, `DPPL.md`, `API.md`
