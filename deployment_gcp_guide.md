# Panduan Migrasi & Deployment Proyek Perintis ke Google Cloud Platform (GCP)

Dokumen ini berisi panduan langkah-demi-langkah untuk mendeploy backend FastAPI ke Google Cloud Run, menyambungkannya dengan Cloud SQL (PostgreSQL), dan mendeploy frontend ke Firebase Hosting.

---

## Prasyarat Sebelum Memulai

1. **Akun GCP & Firebase**: Pastikan Anda memiliki akun Google Cloud Platform yang aktif dengan metode pembayaran terpasang (billing enabled).
2. **Google Cloud CLI (gcloud)**: Pasang `gcloud` di mesin lokal Anda. Ikuti panduan resmi [Google Cloud CLI Install](https://cloud.google.com/sdk/docs/install).
3. **Login & Set Project**:
   Jalankan perintah berikut di terminal lokal Anda untuk login dan mengatur proyek aktif:
   ```bash
   gcloud auth login
   gcloud config set project perintis-umkm
   ```
   *(Ganti `perintis-umkm` dengan Project ID GCP Anda yang sebenarnya jika berbeda).*

---

## Langkah 1: Aktifkan API GCP yang Dibutuhkan

Aktifkan layanan yang diperlukan untuk build dan deploy container di GCP:
```bash
gcloud services enable \
    artifactregistry.googleapis.com \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    sqladmin.googleapis.com \
    secretmanager.googleapis.com
```

---

## Langkah 2: Buat Database Cloud SQL (PostgreSQL)

Karena database lokal SQLite bersifat *stateless* (data akan hilang setiap kali kontainer Cloud Run restart), Anda perlu menggunakan database persisten seperti Cloud SQL PostgreSQL.

1. **Buat Instance Cloud SQL**:
   ```bash
   gcloud sql instances create perintis-db-instance \
       --database-version=POSTGRES_15 \
       --tier=db-f1-micro \
       --region=asia-southeast2 \
       --root-password="GANTI_PASSWORD_ROOT_ANDA"
   ```
   *(Catatan: Wilayah `asia-southeast2` berada di Jakarta, Indonesia, untuk latency terbaik).*

2. **Buat Database Baru**:
   ```bash
   gcloud sql databases create perintis_prod --instance=perintis-db-instance
   ```

3. **Buat User Baru untuk Aplikasi**:
   ```bash
   gcloud sql users create perintis_app --instance=perintis-db-instance --password="GANTI_PASSWORD_USER_ANDA"
   ```

---

## Langkah 3: Siapkan Artifact Registry & Build Backend Container

1. **Buat Repositori Docker di Artifact Registry**:
   ```bash
   gcloud artifacts repositories create perintis-repo \
       --repository-format=docker \
       --location=asia-southeast2 \
       --description="Docker repository untuk aplikasi Perintis"
   ```

2. **Build & Submit Container Image menggunakan Cloud Build**:
   Masuk ke folder proyek Anda (di mana `backend/Dockerfile` berada), lalu jalankan perintah ini untuk melakukan build jarak jauh secara otomatis di cloud:
   ```bash
   gcloud builds submit --tag asia-southeast2-docker.pkg.dev/perintis-umkm/perintis-repo/perintis-backend:latest ./backend
   ```
   *(Sesuaikan `perintis-umkm` dengan Project ID GCP Anda).*

---

## Langkah 4: Deploy Backend ke Google Cloud Run

Gunakan perintah di bawah ini untuk mendeploy backend Anda ke Cloud Run. 

### Opsi A: Menyambungkan Cloud SQL Menggunakan Koneksi Unix Socket (Sangat Direkomendasikan & Aman)
Cloud Run dapat terhubung secara aman ke Cloud SQL tanpa membuka IP publik database ke internet menggunakan Cloud SQL Connection.

Format `DATABASE_URL` yang digunakan oleh SQLAlchemy untuk driver `pg8000`:
`postgresql+pg8000://<USER>:<PASSWORD>@/<DB_NAME>?unix_sock=/cloudsql/<PROJECT_ID>:<REGION>:<INSTANCE_NAME>/.s.PGSQL.5432`

Jalankan perintah deploy berikut:
```bash
gcloud run deploy perintis-backend \
    --image=asia-southeast2-docker.pkg.dev/perintis-umkm/perintis-repo/perintis-backend:latest \
    --region=asia-southeast2 \
    --platform=managed \
    --allow-unauthenticated \
    --add-cloudsql-instances=perintis-umkm:asia-southeast2:perintis-db-instance \
    --set-env-vars="DATABASE_URL=postgresql+pg8000://perintis_app:GANTI_PASSWORD_USER_ANDA@/perintis_prod?unix_sock=/cloudsql/perintis-umkm:asia-southeast2:perintis-db-instance/.s.PGSQL.5432" \
    --set-env-vars="GEMINI_API_KEY=GANTI_DENGAN_GEMINI_API_KEY_ANDA" \
    --set-env-vars="JWT_SECRET_KEY=62a8a332dc70ffc6d49d55f8338cb0d25d5dc3d70ae3eb237597368ad106559e" \
    --set-env-vars="FIREBASE_PROJECT_ID=perintis-umkm"
```

> [!TIP]
> Catat URL Cloud Run yang dihasilkan setelah perintah di atas selesai (misalnya: `https://perintis-backend-xxxxxx-as.a.run.app`). Anda akan membutuhkannya untuk mengonfigurasi Frontend.

---

## Langkah 5: Konfigurasi & Deploy Frontend ke Firebase Hosting

1. **Perbarui URL API di Frontend**:
   Buka file `frontend/.env` atau buat file `frontend/.env.production` dan sesuaikan parameter berikut dengan URL Cloud Run Anda:
   ```env
   VITE_API_BASE_URL=https://perintis-backend-xxxxxx-as.a.run.app
   ```

2. **Update CORS Allowed Origin di Cloud Run (Opsional tapi Penting)**:
   Secara default, backend FastAPI membatasi CORS. Anda perlu menyertakan domain Firebase Hosting Anda (misalnya `https://perintis-umkm.web.app`) ke dalam daftar allowed origins.
   Caranya, atur env variable `FRONTEND_URL` di Cloud Run:
   ```bash
   gcloud run services update perintis-backend \
       --region=asia-southeast2 \
       --set-env-vars="FRONTEND_URL=https://perintis-umkm.web.app"
   ```

3. **Build Frontend**:
   Jalankan proses kompilasi frontend React + Vite Anda:
   ```bash
   cd frontend
   npm install
   npm run build
   cd ..
   ```

4. **Deploy ke Firebase Hosting**:
   Gunakan Firebase CLI untuk mengunggah asset frontend yang sudah dibuild di folder `frontend/dist`:
   ```bash
   # Login ke Firebase jika belum
   npx firebase login
   
   # Deploy hanya bagian hosting
   npx firebase deploy --only hosting
   ```

---

## Langkah 6: Pemeliharaan (Maintenance) & Migrasi Skema Database
Di `backend/app/main.py`, sudah terdapat kode inisialisasi otomatis:
```python
Base.metadata.create_all(bind=engine)
```
Saat kontainer baru pertama kali dijalankan di Cloud Run, tabel database PostgreSQL di Cloud SQL Anda akan dibuat secara otomatis.

Jika Anda melakukan perubahan skema di kemudian hari, disarankan untuk menggunakan alat migrasi seperti **Alembic** untuk melakukan migrasi skema database yang aman di Cloud SQL.
