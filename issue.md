# 📱 Mobile Responsiveness & Layout Breakdown Audit: High-Level Issue Backlog

> **Project:** MasDim Cafe (React + TypeScript + Tailwind CSS)  
> **Role:** Senior Frontend Engineer  
> **Audience:** Junior Developer / AI Sub-Agent  
> **Focus:** Investigasi & Perbaikan Kerusakan Tampilan pada Handphone / Layar Mobile (< 640px)  
> **Status:** Open / Ready to Implement  

---

## 📌 1. Executive Summary & Root Cause Diagnosis

Setelah dilakukan pengujian dan audit visual pada viewport mobile (benchmark: resolusi **360px – 390px**, contoh: iPhone SE, iPhone 12/13/14, Samsung Galaxy S series), ditemukan bahwa aplikasi mengalami **kerusakan tampilan yang parah pada perangkat handphone**.

### 🔍 4 Penyebab Utama Kerusakan Tampilan Mobile:
1. **Penggunaan `min-w-md` (448px) yang Melebihi Lebar Layar HP**:  
   Layar smartphone standar memiliki lebar 360px–390px. Di halaman Login dan Modal, kode memaksakan `min-w-md` (minimal lebar 448px), sehingga halaman mengalami **horizontal overflow (bocor ke samping)**, muncul scrollbar horizontal, dan input terpotong.
2. **Fixed Height `h-[80vh]` & Kurangnya Constraints Gambar**:  
   Pada Hero Section (`Main.tsx`), tinggi kontainer dikunci `h-[80vh]` padahal konten teks dan gambar yang bertumpuk vertikal di HP membutuhkan ruang lebih dari 800px. Akibatnya teks dan gambar meluber (*overflowing*) dan bertabrakan dengan elemen lain.
3. **Flexbox Baris Tunggal yang Kaku (Rigid Row Flex)**:  
   Pada baris item keranjang (`Cart.tsx`) dan Header saat login, elemen-elemen (gambar, teks panjang, tombol kuantitas, tombol hapus) dipaksa berada dalam 1 baris tanpa `flex-wrap`. Pada layar 360px, elemen saling berdesakan, teks nama menu tertekan menjadi 1 huruf per baris, atau melebar keluar layar.
4. **Header Terlalu Tinggi (`h-30` = 120px) & Kategori Menu Menumpuk**:  
   Header memakan ~20% dari tinggi total layar HP, dan tombol kategori produk membungkus secara acak (*flex-wrap*) sehingga mendorong konten menu utama jauh ke bawah layar lipat (*below the fold*).

---

## 🚦 2. Severity Matrix Masalah Tampilan Mobile

| ID | Issue Title | Severity | File Terdampak | Dampak Visual di Handphone |
| :---: | :--- | :---: | :--- | :--- |
| **[MOB-01]** | Form Login Meluber ke Samping (`min-w-md`) | **P0 - Critical** | `src/Pages/Login.tsx` | Layar bocor horizontal, form terpotong di HP |
| **[MOB-02]** | Hero Section Bertabrakan & Meluber (`h-[80vh]`) | **P0 - Critical** | `src/Layouts/Main.tsx` | Konten terpotong, tombol menempel tanpa celah |
| **[MOB-03]** | Card Item Keranjang Tergencet & Overflow | **P0 - Critical** | `src/Pages/Cart.tsx` | Teks tergencet, tombol bertumpuk/rusak |
| **[MOB-04]** | Header Terlalu Tinggi & User Greeting Bocor | **P1 - High** | `src/Components/Header.tsx`, `LogoutButton.tsx` | Header memakan layar, greeting & tombol keluar layar |
| **[MOB-05]** | Filter Kategori Menumpuk & Header Menu Asimetris | **P1 - High** | `src/Pages/Menus.tsx` | Filter makan tempat vertikal, cart button melenceng |
| **[MOB-06]** | Gambar Detail Menu Terlalu Besar & Scroll Trap | **P2 - Medium** | `src/Layouts/MenuDetail.tsx` | Gambar memenuhi layar, scroll terjebak di review |
| **[MOB-07]** | Modal Menu Detail Bocor Layar (`min-w-md`) | **P2 - Medium** | `src/Layouts/MenuDetail(dengan zustand).tsx` | Modal lebih lebar dari layar HP |

---

## 🛠️ 3. Detail Masalah & Panduan Perbaikan Langkah-demi-Langkah

---

### [MOB-01] Form Login Meluber ke Samping karena `min-w-md` (448px)
- **Severity:** P0 - Critical
- **Lokasi File:** `src/Pages/Login.tsx` (Baris 38)
- **Masalah:**
  ```tsx
  // ❌ Kode Saat Ini:
  <div className="bg-gray-800 min-h-screen w-full flex justify-center items-center">
    <div className=" max-w-xl min-w-md min-h-80 ">
  ```
- **Mengapa Rusak di HP:**
  Di Tailwind CSS, `min-w-md` di-compile menjadi `min-width: 28rem` (yaitu **448px**). Sementara layar iPhone 13 hanya memiliki lebar **390px**, dan Android murah/standar sekitar **360px**. Container dipaksa lebih lebar 58px–88px daripada layar HP, menyebabkan halaman bisa digeser ke kanan-kiri secara tidak sengaja dan input email/password terpotong.
- **Solusi Perbaikan:**
  Ganti `min-w-md` menjadi `w-full max-w-md px-4`:
  ```tsx
  // ✅ Solusi:
  <div className="bg-gray-800 min-h-screen w-full flex justify-center items-center p-4">
    <div className="w-full max-w-md min-h-80 bg-gray-800">
      <form
        className="flex justify-between flex-col p-6 gap-2 bg-gray-900 rounded-xl shadow-lg border border-gray-700"
        onSubmit={handleSubmit(onSubmit)}
      >
  ```
- **Acceptance Criteria:**
  - Pada layar lebar 320px, 360px, dan 390px, form login pas di tengah layar dengan margin kanan-kiri yang rapi.
  - Tidak ada scrollbar horizontal sama sekali (`window.innerWidth === document.documentElement.clientWidth`).

---

### [MOB-02] Hero Section Rusak: Tinggi Terkunci `h-[80vh]`, Gap Hilang & Tipografi Raksasa
- **Severity:** P0 - Critical
- **Lokasi File:** `src/Layouts/Main.tsx` (Baris 13, 19, 32, 48)
- **Masalah:**
  ```tsx
  // ❌ Kode Saat Ini:
  <div className="  flex  items-center justify-center h-[80vh] w-full">
    <div className="max-w-3xl grid grid-cols-1 md:grid-cols-2">
      <div className="p-5">
        ...
        <p className="text-4xl font-serif text-amber-950 mb-5">...</p>
        ...
        <div className="flex justify-start md:gap-5">
          <button ...>Order Ahead &rarr;</button>
          <button ...>Our Menu &rarr;</button>
        </div>
      </div>
      <img className="self-center " src={coffee} alt="coffee" />
    </div>
  </div>
  ```
- **Mengapa Rusak di HP:**
  1. `h-[80vh]`: Pada HP, layar tersusun 1 kolom (teks di atas, gambar di bawah). Tinggi teks + gambar mencapai 750px+, sementara 80vh di HP hanya sekitar 500px–600px. Konten meluber keluar dari kontainer induknya.
  2. `text-4xl`: Ukuran font 36px terlalu raksasa untuk layar HP, membuat judul patah menjadi banyak baris janggal dan mendorong semua konten ke bawah.
  3. `md:gap-5` tanpa default gap: Kelas `md:gap-5` HANYA aktif di layar tablet ke atas (>=768px). Pada HP (<768px), tombol memiliki `gap: 0` alias **saling menempel tanpa spasi**.
  4. Gambar `coffee.png` tidak memiliki batas lebar maksimal (`max-w-*`), sehingga ukurannya liar di layar kecil.
- **Solusi Perbaikan:**
  ```tsx
  // ✅ Solusi:
  <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] py-8 px-4 w-full">
    <div className="max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="p-2 sm:p-5 text-center md:text-left">
        <p className="text-amber-800 font-semibold mb-3 text-sm sm:text-base">
          Locally-Owned Coffee Shop Serving Cleveland
        </p>
        <p className="text-2xl sm:text-3xl md:text-4xl font-serif text-amber-950 mb-4 leading-tight">
          Brewing Hope & Great Coffee in the heart of Buckeye
        </p>
        <p className="text-amber-950 font-light mb-5 text-sm sm:text-base">
          Once a bar, now a beacon of ambition —
          <span className="font-bold">The Tavern Coffee House </span> is a
          unique & eclectic café revitalizing the Buckeye-Shaker neighborhood
          through <span className="font-bold">community, careers, </span> and
          <span className="font-bold">coffee.</span>
        </p>
        <p className="text-amber-950 font-bold mb-6 text-sm sm:text-base">
          Open 8am – 1pm Monday-Friday
        </p>
        <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-3 sm:gap-4">
          <button
            className="w-full sm:w-auto bg-gray-100 px-5 py-2.5 border-2 border-amber-950 text-amber-950 font-semibold hover:bg-amber-950 hover:text-gray-100 transition duration-200 cursor-pointer rounded-lg text-center"
            onClick={handleOrder}
          >
            Order Ahead &rarr;
          </button>
          <button
            className="w-full sm:w-auto bg-amber-950 px-5 py-2.5 border-2 border-amber-950 text-gray-100 font-semibold hover:bg-gray-100 hover:text-amber-950 transition duration-200 cursor-pointer rounded-lg text-center"
            onClick={() => navigate("/menu")}
          >
            Our Menu &rarr;
          </button>
        </div>
      </div>
      <div className="flex justify-center p-2">
        <img
          className="w-full max-w-[280px] sm:max-w-sm md:max-w-full h-auto object-contain"
          src={coffee}
          alt="coffee"
        />
      </div>
    </div>
  </div>
  ```
- **Acceptance Criteria:**
  - Hero section tidak terpotong di HP manapun dan dapat di-scroll secara alami jika layar sangat pendek.
  - Tombol aksi memiliki jarak (gap) yang rapi dan mudah ditekan di layar sentuh (*touch target* minimal 44x44px).
  - Gambar kopi memiliki ukuran proporsional di tengah layar.

---

### [MOB-03] Baris Item Keranjang (Cart) Tergencet & Melebar ke Luar Layar
- **Severity:** P0 - Critical
- **Lokasi File:** `src/Pages/Cart.tsx` (Baris 31-71)
- **Masalah:**
  ```tsx
  // ❌ Kode Saat Ini:
  <div
    key={item.id}
    className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm"
  >
    <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded" />
    <div className="flex-1">
      <h2 className="font-semibold text-amber-950">{item.name}</h2>
      <p className="text-amber-800 font-bold">${item.price}</p>
    </div>

    <div className="flex items-center gap-2">
      <button ...>−</button>
      <span className="w-8 text-center">{item.quantity}</span>
      <button ...>+</button>
    </div>

    <button onClick={() => removeItem(item.id)} className="text-red-600 text-sm hover:underline">
      Hapus
    </button>
  </div>
  ```
- **Mengapa Rusak di HP:**
  Total lebar yang dibutuhkan oleh semua elemen dalam satu baris adalah:  
  `64px (gambar) + 16px (gap) + 120px (teks) + 16px (gap) + 110px (tombol qty) + 16px (gap) + 40px (hapus) = 382px`.  
  Namun pada layar HP 360px dengan padding container `p-6` (total padding kiri-kanan 48px), ruang yang tersedia hanya **312px**!  
  Akibatnya: teks nama kopi tergencet parah, tombol quantity dan tombol hapus tumpang tindih atau keluar dari batas layar.
- **Solusi Perbaikan:**
  Ubah tata letak kartu di layar kecil menjadi responsive (informasi produk di atas, kontrol quantity & hapus di baris bawah atau menggunakan grid):
  ```tsx
  // ✅ Solusi:
  <div
    key={item.id}
    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
  >
    {/* Info Produk */}
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <img
        src={item.image_url}
        alt={item.name}
        className="w-16 h-16 object-cover rounded-lg shrink-0"
      />
      <div className="min-w-0">
        <h2 className="font-semibold text-amber-950 text-base truncate">
          {item.name}
        </h2>
        <p className="text-amber-800 font-bold text-sm sm:text-base">
          ${item.price}
        </p>
      </div>
    </div>

    {/* Kontrol Kuantitas & Tombol Hapus */}
    <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
      <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-200">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-xs text-amber-950 font-bold active:scale-95 transition"
          aria-label="Kurangi kuantitas"
        >
          −
        </button>
        <span className="w-8 text-center font-semibold text-sm">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-xs text-amber-950 font-bold active:scale-95 transition"
          aria-label="Tambah kuantitas"
        >
          +
        </button>
      </div>

      <button
        onClick={() => removeItem(item.id)}
        className="text-red-500 hover:text-red-700 text-sm font-medium hover:underline p-1 cursor-pointer"
      >
        Hapus
      </button>
    </div>
  </div>
  ```
- **Acceptance Criteria:**
  - Pada layar 320px–390px, setiap item keranjang tersusun rapi tanpa teks terpotong aneh dan tanpa overflow horizontal.
  - Tombol `+` dan `−` mudah diklik dengan jari tanpa sengaja menekan tombol "Hapus".

---

### [MOB-04] Header Navbar Terlalu Tinggi (`h-30` = 120px) & Sapaan User Bocor di Layar HP
- **Severity:** P1 - High
- **Lokasi File:**  
  - `src/Components/Header.tsx` (Baris 12)  
  - `src/Components/LogoutButton.tsx` (Baris 12-22)
- **Masalah:**
  ```tsx
  // ❌ Header.tsx
  <div className="bg-white h-30 w-full shadow-md flex justify-between items-center p-5 mb-5 ">
    <img src={logo} alt="MasDim Cafe" className="w-36 hover:cursor-pointer " ... />
    {!isLogin ? <LoginButton /> : <LogoutButton />}
  </div>

  // ❌ LogoutButton.tsx
  <div className="flex gap-4 items-center">
    <div className="text-amber-900 font-semibold">Hello {user.name} </div>
    <button className="bg-amber-900 text-gray-200 rounded-md py-2 px-4 ...">Logout</button>
  </div>
  ```
- **Mengapa Rusak di HP:**
  1. `h-30` adalah 120px (tinggi navbar desktop yang sangat besar). Di HP dengan tinggi layar 667px, header ini memakan **18% dari seluruh layar**.
  2. Saat user sudah login, Logo (`w-36` = 144px) + Tulisan `"Hello Muhammad Dimas"` (~160px) + Tombol Logout (~80px) + Padding kiri kanan (40px) = **424px**. Di layar HP 360px–390px, elemen ini bertumpuk berantakan atau memaksa navbar melar ke samping.
- **Solusi Perbaikan:**
  1. Di `Header.tsx`: Buat tinggi responsive `h-16 sm:h-20`, perkecil logo di mobile (`w-24 sm:w-32`), dan kurangi padding `px-4 sm:px-6 py-3`.
  2. Di `LogoutButton.tsx`: Sembunyikan atau ringkas teks nama di mobile:
  ```tsx
  // ✅ Solusi LogoutButton.tsx:
  <div className="flex items-center gap-2 sm:gap-3">
    <span className="text-amber-900 font-semibold text-xs sm:text-sm max-w-[100px] sm:max-w-none truncate">
      {user.name}
    </span>
    <button
      className="bg-amber-900 text-white text-xs sm:text-sm rounded-md py-1.5 px-3 font-semibold hover:bg-amber-800 transition"
      type="button"
      onClick={handleLogout}
    >
      Logout
    </button>
  </div>
  ```
- **Acceptance Criteria:**
  - Tinggi navbar di layar HP tidak melebihi 64px (`h-16`).
  - Ketika user dengan nama panjang login, navbar tetap rapi dan tidak bocor ke samping.

---

### [MOB-05] Filter Kategori Menumpuk Berantakan & Tombol Keranjang Asimetris di Halaman Menus
- **Severity:** P1 - High
- **Lokasi File:** `src/Pages/Menus.tsx` (Baris 32-40, 47-58)
- **Masalah:**
  ```tsx
  // ❌ Menus.tsx
  <div className="flex justify-between items-center">
    <h1 className="text-3xl font-bold text-amber-950 mb-6">Our Menu</h1>
    <button className="..." onClick={() => navigate("/cart")}>
      🛒 Cart {totalItems}
    </button>
  </div>

  <div className="flex flex-row flex-wrap justify-center lg:flex-col gap-2">
    {categories.map((c) => ( ... ))}
  </div>
  ```
- **Mengapa Rusak di HP:**
  1. `h1` memiliki `mb-6`, sedangkan tombol keranjang tidak. Karena dibungkus `flex items-center`, tombol keranjang tertarik ke tengah vertikal dari `h1 + margin-bottom`, sehingga posisi tombol menjadi miring/asimetris terhadap judul di HP.
  2. Kategori filter menggunakan `flex-wrap justify-center`. Jika ada 6+ kategori, kategori tersebut membungkus menjadi 3-4 baris tombol yang memakan setengah layar HP sebelum user bisa melihat kartu menu pertama.
- **Solusi Perbaikan:**
  1. Hapus `mb-6` dari `h1` dan beri margin pada container header `mb-4 sm:mb-6`.
  2. Ubah kategori di HP menjadi **Horizontal Scrollable Chip List** (standar e-commerce/aplikasi mobile modern):
  ```tsx
  // ✅ Solusi Menus.tsx:
  <div className="flex justify-between items-center mb-4 sm:mb-6">
    <h1 className="text-2xl sm:text-3xl font-bold text-amber-950">Our Menu</h1>
    <button
      className="bg-amber-50 hover:bg-amber-100 border border-amber-800 text-amber-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-bold cursor-pointer transition flex items-center gap-1.5 shrink-0"
      onClick={() => navigate("/cart")}
    >
      <span>🛒</span> Cart ({totalItems})
    </button>
  </div>

  {/* Category Filter: Horizontal scroll di Mobile, Sidebar di Desktop */}
  <aside className="lg:sticky lg:top-6 lg:self-start mb-4 lg:mb-0">
    <h2 className="hidden lg:block text-sm font-bold text-gray-500 uppercase mb-3">
      Kategori
    </h2>
    <div className="flex flex-row overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 lg:flex-col gap-2 no-scrollbar">
      {categories.map((c) => (
        <button
          key={c}
          onClick={() => setSelectedCategory(c)}
          className={`shrink-0 text-left px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full lg:rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
            selectedCategory === c
              ? "bg-amber-950 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  </aside>
  ```
- **Acceptance Criteria:**
  - Kategori di HP berada dalam 1 baris yang dapat digeser secara horizontal (*swipe/horizontal scroll*).
  - Judul "Our Menu" dan tombol keranjang sejajar rapi secara vertikal.

---

### [MOB-06] Halaman Menu Detail: Gambar Terlalu Tinggi & Potensi Scroll Trap
- **Severity:** P2 - Medium
- **Lokasi File:** `src/Layouts/MenuDetail.tsx` (Baris 54-57, Baris 102)
- **Masalah:**
  ```tsx
  // ❌ MenuDetail.tsx
  <img src={menuItem.image_url} className="w-full h-80 object-cover" />
  ...
  <div className="space-y-3 max-h-125 overflow-y-auto">
  ```
- **Mengapa Rusak di HP:**
  1. `h-80` (320px): Gambar menghabiskan hampir 60% layar pertama smartphone sebelum pengguna melihat nama menu, rating, deskripsi, atau tombol tambah ke keranjang.
  2. `max-h-125 overflow-y-auto`: Kotak ulasan memiliki scroll tersendiri di dalam halaman. Pada layar sentuh handphone, ini memicu *scroll trap* (saat jari user menyentuh bagian ulasan untuk scroll ke bawah halaman, justru scroll ulasan yang bergerak, membuat user kesulitan keluar dari halaman).
- **Solusi Perbaikan:**
  - Gunakan `h-60 sm:h-80` agar gambar tidak mendominasi layar.
  - Pada layar mobile, biarkan ulasan mengalir secara alami tanpa *scroll trap*:
  ```tsx
  // ✅ Solusi:
  <img
    src={menuItem.image_url}
    alt={menuItem.name}
    className="w-full h-56 sm:h-80 object-cover"
  />
  ...
  {/* Review list */}
  <div className="space-y-3 max-h-96 sm:max-h-125 overflow-y-auto pr-1">
  ```
- **Acceptance Criteria:**
  - Pengguna HP dapat langsung melihat nama makanan dan harga tanpa harus scroll jauh melewati gambar.

---

### [MOB-07] Modal Menu Detail Menggunakan `min-w-md` (448px)
- **Severity:** P2 - Medium
- **Lokasi File:** `src/Layouts/MenuDetail(dengan zustand).tsx` (Baris 19)
- **Masalah:**
  ```tsx
  // ❌ Kode:
  <div className="relative min-w-md bg-gray-100 max-h-screen rounded-2xl grid-rows-1 sm:grid-cols-2">
  ```
- **Mengapa Rusak di HP:**
  Sama seperti halaman login, `min-w-md` memaksa modal melebar hingga 448px, melebihi lebar layar HP dan membuat tombol tutup (`x`) keluar dari layar.
- **Solusi Perbaikan:**
  Ubah menjadi responsive:
  ```tsx
  // ✅ Solusi:
  <div className="relative w-[92vw] max-w-md bg-gray-100 max-h-[90vh] overflow-y-auto rounded-2xl p-4">
  ```
- **Acceptance Criteria:**
  - Modal muat di layar HP dengan margin aman di sisi kiri dan kanan.

---

## 📐 4. Aturan Mobile-First CSS untuk Junior Programmer & AI

Saat menulis kode Tailwind CSS di proyek ini, patuhi panduan fundamental berikut:

1. **Selalu Terapkan Filosofi Mobile-First:**
   - Di Tailwind, kelas tanpa prefix (seperti `p-4`, `text-lg`, `grid-cols-1`) adalah nilai **default untuk layar HP terendah**.
   - Prefix seperti `sm:`, `md:`, `lg:` hanya digunakan untuk menambahkan penyesuaian pada layar yang lebih besar.
   - ❌ **SALAH:** Menulis `md:gap-5` tanpa menulis `gap-3` (mengakibatkan di HP gap bernilai 0).
   - ✅ **BENAR:** `gap-3 md:gap-5` (di HP gap 12px, di desktop gap 20px).
2. **Hindari `min-w-*` yang Lebih Besar dari 300px:**
   - Jangan pernah menggunakan `min-w-md` (448px), `min-w-lg` (512px) pada container utama.
   - Gunakan selalu kombinasi `w-full max-w-*` untuk layout yang fleksibel.
3. **Hindari Fixed Height `h-[...vh]` pada Konten Dinamis:**
   - Konten teks dan gambar pada layar HP akan melipat secara vertikal. Mengunci tinggi dengan `h-[80vh]` selalu berujung pada konten terpotong.
   - Gunakan `min-h-[...]` atau padding vertikal alami `py-8` / `py-12`.
4. **Sentuhan Jari (Touch Targets):**
   - Pastikan setiap tombol dan link interaktif di mobile memiliki ukuran area sentuh minimal **44x44px** agar tidak salah pencet.

---

## 🗺️ 5. Implementation Roadmap (Urutan Eksekusi)

```
[Fase 1: Perbaikan Kritis P0 - Overflow & Layout Pecah]
  1. Buka `src/Pages/Login.tsx`, ganti `min-w-md` dengan `w-full max-w-md px-4` [MOB-01]
  2. Buka `src/Layouts/Main.tsx`, perbaiki `h-[80vh]`, tombol gap, dan ukuran font [MOB-02]
  3. Buka `src/Pages/Cart.tsx`, ubah layout item keranjang menjadi responsive multi-baris [MOB-03]

[Fase 2: Perbaikan P1 - Header & Navigasi Mobile]
  4. Buka `src/Components/Header.tsx` & `LogoutButton.tsx`, kurangi tinggi dan rapikan sapaan user [MOB-04]
  5. Buka `src/Pages/Menus.tsx`, ubah filter kategori menjadi horizontal scroll [MOB-05]

[Fase 3: Polishing P2 - Detail Menu & Modal]
  6. Buka `src/Layouts/MenuDetail.tsx`, optimalkan tinggi gambar [MOB-06]
  7. Buka `src/Layouts/MenuDetail(dengan zustand).tsx`, ubah `min-w-md` menjadi `w-[92vw] max-w-md` [MOB-07]
```

---

## 🧪 6. Checklist Verifikasi & Testing di Handphone

Untuk memverifikasi bahwa seluruh issue telah selesai dengan benar:

- [ ] Buka Google Chrome / Edge Developer Tools (`F12`).
- [ ] Aktifkan **Device Toolbar** (`Ctrl + Shift + M`).
- [ ] Pilih preset **iPhone SE (375 × 667)** dan **Samsung Galaxy S8+ (360 × 740)**.
- [ ] **Test Halaman Home (`/`):** Pastikan tidak ada konten yang terpotong dan tombol "Order Ahead" memiliki jarak pemisah.
- [ ] **Test Halaman Login (`/login`):** Pastikan form login berada pas di tengah layar dan TIDAK ada scrollbar horizontal ke kanan-kiri.
- [ ] **Test Halaman Menu (`/menu`):** Pastikan filter kategori dapat di-swipe ke samping dalam 1 baris tanpa menutupi layar.
- [ ] **Test Halaman Keranjang (`/cart`):** Masukkan beberapa menu, buka keranjang. Pastikan nama menu, tombol tambah/kurang, dan tombol hapus tersusun rapi.
- [ ] Jalankan build check:
  ```bash
  npm run build
  npm run lint
  ```
