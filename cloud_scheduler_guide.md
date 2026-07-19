# Panduan Konfigurasi Google Cloud Scheduler (Cron Job Serverless)

Untuk memperbarui data harga pangan harian secara otomatis tanpa membuat server terus berjalan, kita telah memindahkan fungsi pembaruan dari *background thread* internal ke endpoint API yang aman di:
`https://perintis-backend-575732170734.asia-southeast2.run.app/api/cron/update-prices`

Sekarang, Anda perlu menjadwalkan pemicu (trigger) endpoint ini menggunakan **Google Cloud Scheduler** di GCP Console.

---

## Langkah demi Langkah Konfigurasi Cloud Scheduler

1. **Buka Konsol Cloud Scheduler**:
   Buka halaman **[GCP Console Cloud Scheduler](https://console.cloud.google.com/cloudscheduler?project=perintis-umkm)**.
   *(Jika diminta mengaktifkan Cloud Scheduler API, klik **Enable**).*

2. **Buat Job Baru**:
   Klik tombol **`CREATE JOB`** di bagian atas halaman.

3. **Isi Detail Penjadwalan (Langkah 1)**:
   * **Name**: `update-prices-daily`
   * **Region**: `asia-southeast2` (Jakarta)
   * **Description**: `Pemicu harian pembaruan data harga pangan nasional (PIHPS) Perintis`
   * **Frequency**: `0 7 * * *` 
     *(Ini adalah format cron yang artinya: berjalan setiap hari pukul 07:00 pagi).*
   * **Timezone**: Pilih **`Jakarta (WIB)`** atau ketik `Asia/Jakarta`.
   * Klik **Continue**.

4. **Isi Detail Eksekusi (Langkah 2)**:
   * **Target type**: `HTTP`
   * **URL**: `https://perintis-backend-575732170734.asia-southeast2.run.app/api/cron/update-prices`
   * **HTTP method**: `POST`
   * **HTTP Headers**:
     Klik **Add a header**, lalu masukkan:
     * **Name**: `X-Cron-Key`
     * **Value**: `perintis-cron-secret-2026`
   * Klik **Continue**.

5. **Pengaturan Retry (Langkah 3)**:
   * Biarkan pengaturan default (atau sesuaikan jika diinginkan).
   * Klik **Create**.

---

## Cara Menguji Job Secara Instan

Setelah Job berhasil dibuat di daftar Cloud Scheduler:

1. Klik tombol titik tiga **`...`** di samping kanan nama job `update-prices-daily` (atau centang kotaknya).
2. Pilih/klik **`Force run`** (Jalankan paksa).
3. Tunggu beberapa detik, lalu periksa kolom **Last execution status**.
   * Jika menampilkan status **`Success`** (atau hijau centang), selamat! Endpoint telah berhasil dipicu dan database harga pangan Anda telah sukses diperbarui di cloud secara otomatis.
