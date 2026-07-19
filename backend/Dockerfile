# Gunakan official Python runtime sebagai base image (versi lightweight)
FROM python:3.11-slim

# Tentukan working directory di dalam container
WORKDIR /app

# Atur environment variable agar python output langsung ditampilkan di logs (tanpa buffering)
ENV PYTHONUNBUFFERED=1

# Install dependency sistem yang dibutuhkan untuk kompilasi psycopg2 (jika diperlukan)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Salin file requirements.txt ke dalam container
COPY requirements.txt .

# Install python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Salin seluruh source code backend ke dalam container
COPY . .

# Cloud Run mendengarkan port secara dinamis melalui env variable $PORT (biasanya default 8080)
EXPOSE 8080

# Jalankan Uvicorn server saat container dimulai
# Menggunakan 'exec' agar uvicorn menerima signal terminasi (SIGTERM) langsung dari Cloud Run untuk graceful shutdown
CMD exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}
