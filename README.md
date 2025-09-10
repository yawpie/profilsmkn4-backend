

# Backend Aplikasi Profil SMKN 4 Mataram

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge\&logo=node.js\&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge\&logo=express\&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge\&logo=postgresql\&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge\&logo=prisma\&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge\&logo=firebase\&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge\&logo=docker\&logoColor=white)

---

## 📝 Deskripsi Proyek

Proyek ini adalah layanan **REST API (Backend)** untuk aplikasi profil sekolah **SMKN 4 Mataram**. Aplikasi ini mengelola semua data dinamis yang ditampilkan di frontend, seperti artikel, pengumuman, data guru, fasilitas, dan banyak lagi.

Dibangun dengan **TypeScript**, menggunakan **Express.js** sebagai framework, **Prisma** sebagai ORM, dan **PostgreSQL** sebagai database. Untuk penyimpanan file gambar, proyek ini terintegrasi dengan **Firebase Cloud Storage**.

---

## ✨ Fitur Utama

* **Autentikasi & Otorisasi**: Sistem login berbasis JWT untuk admin.
* **Manajemen Konten (CRUD)**:

  * Artikel (dengan kategori dan paginasi)
  * Pengumuman
  * Jurusan
  * Fasilitas
  * Ekstrakurikuler
  * Data guru
* **Unggah File**: Upload gambar ke Firebase Cloud Storage.
* **Validasi Input**: Menggunakan Zod untuk validasi yang kuat.
* **Docker Ready**: Tersedia konfigurasi Docker & Compose.

---

## 🛠️ Teknologi yang Digunakan

* **Runtime**: Node.js
* **Framework**: Express.js
* **Bahasa**: TypeScript
* **Database**: PostgreSQL
* **ORM**: Prisma
* **Penyimpanan File**: Firebase Cloud Storage
* **Autentikasi**: JSON Web Token (JWT)
* **Validasi**: Zod
* **Testing**: Jest & Supertest
* **Kontainerisasi**: Docker

---

## 🚀 Instalasi & Setup

### 1. Prasyarat

* [Node.js](https://nodejs.org/) (v18+)
* [Docker & Docker Compose](https://docs.docker.com/compose/)
* [Git](https://git-scm.com/)

### 2. Clone Repositori

```bash
git clone <URL_REPOSITORI_ANDA>
cd profilsmkn4-backend
```

### 3. Instal Dependensi

```bash
npm install
```

### 4. Konfigurasi Lingkungan

Salin file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Isi variabel berikut di `.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase?schema=public"

# Server
PORT=3000

# JWT Secret
JWT_SECRET="ganti-dengan-kunci-rahasia-yang-sangat-kuat"

# Firebase
FIREBASE_CREDENTIALS_BASE64="BASE64_ENCODED_SERVICE_ACCOUNT_JSON"
FIREBASE_STORAGE_BUCKET="gs://nama-bucket-anda.appspot.com"
```

> 💡 Untuk mendapatkan `FIREBASE_CREDENTIALS_BASE64`, encode file JSON service account Firebase Anda menjadi string base64.

### 5. Jalankan Database

```bash
docker-compose up -d
```

### 6. Migrasi Database

```bash
npx prisma migrate dev
```

---

## ▶️ Menjalankan Aplikasi

### Mode Pengembangan

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`.

### Mode Produksi

```bash
npm run build
npm start
```

---

## 🧪 Testing

Jalankan semua test menggunakan Jest:

```bash
npm test
```

---

## 📖 Dokumentasi API

### Dokumentasi Lengkap

Tersedia di file terpisah: **[Dokumentasi Lengkap REST API](./DOCS_API.md)**

### Ringkasan Endpoint

| Metode | Endpoint             | Deskripsi                     | Autentikasi |
| ------ | -------------------- | ----------------------------- | ----------- |
| POST   | `/api/auth/register` | Mendaftarkan admin baru       | ❌           |
| POST   | `/api/auth/login`    | Login & mendapatkan token JWT | ❌           |
| GET    | `/api/articles`      | Mendapatkan semua artikel     | ❌           |
| POST   | `/api/articles`      | Menambahkan artikel           | ✅           |
| PUT    | `/api/articles/:id`  | Memperbarui artikel           | ✅           |
| DELETE | `/api/articles/:id`  | Menghapus artikel             | ✅           |
| GET    | `/api/teachers`      | Mendapatkan data guru         | ❌           |
| POST   | `/api/teachers`      | Menambahkan data guru         | ✅           |

> Dan masih banyak lagi...

---

## 📁 Struktur Folder

```
├── prisma/                # Skema dan migrasi Prisma
├── src/
│   ├── config/            # Konfigurasi (database, firebase)
│   ├── errorHandler/      # Penanganan error kustom
│   ├── middleware/        # Middleware (auth, upload, dll.)
│   ├── routes/            # Definisi rute modular
│   ├── tests/             # File testing (Jest)
│   ├── types/             # Definisi TypeScript
│   ├── utils/             # Helper & utilitas umum
│   ├── validation/        # Validasi menggunakan Zod
│   ├── app.ts             # Setup Express utama
│   └── index.ts           # Titik masuk aplikasi
├── .env                   # Variabel lingkungan (tidak untuk di-commit)
├── Dockerfile             # Konfigurasi Docker untuk aplikasi
├── docker-compose.yml     # Docker Compose untuk database
├── package.json           # Dependensi & skrip
└── tsconfig.json          # Konfigurasi TypeScript
```