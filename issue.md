# 📋 Engineering Task & Code Review: High-Level Issue Backlog

> **Project:** MasDim Cafe (React + TypeScript + Vite + Zustand + TanStack Query)  
> **Author:** Senior Frontend Engineer  
> **Audience:** Junior Developer / AI Sub-Agent  
> **Status:** Open / Action Required  

---

## 📌 Executive Summary

Berdasarkan hasil comprehensive code review pada repository ini, aplikasi memiliki pondasi fitur yang baik (Authentication, Menus, Menu Detail, Cart, dan Client-side Routing). Namun, terdapat sejumlah **Critical Blockers** yang membuat build gagal (`npm run build` & `npm run lint` gagal), **Bug Runtime & Network**, **Arsitektur Folder & Penamaan yang melanggar konvensi**, serta **Inkonsistensi State Management & UX**.

Dokumen ini disusun sebagai panduan perbaikan yang jelas (*actionable*), terstruktur (*step-by-step*), dan dilengkapi kriteria penyelesaian (*acceptance criteria*) agar mudah dieksekusi secara mandiri oleh Junior Programmer maupun model AI.

---

## 🚦 Severity Matrix

| Severity | Total | Keterangan |
| :--- | :---: | :--- |
| **P0 - Critical (Blocker)** | 3 | Menggagalkan build/lint, merusak network request API secara global. |
| **P1 - High (Functional Bugs)** | 4 | Fitur rusak di runtime (form login tanpa pesan error, link mati/404, scoping bug). |
| **P2 - Medium (Architecture & Clean Code)** | 5 | Penamaan file tidak baku, dead code, penempatan layout salah, anti-pattern selector. |
| **P3 - Low (UI/UX, A11y & Polishing)** | 4 | Aksesibilitas, kontras warna Tailwind, loading state kasar, page title. |

---

## 🛠️ Prioritized Issue List

---

### [P0-01] TypeScript Build Failure: Unused Variable in Auth Store
- **Severity:** P0 - Blocker
- **File:** `src/stores/authStore.ts` (Line 2)
- **Problem:**
  Proses `npm run build` (`tsc -b`) gagal dengan error:
  ```text
  src/stores/authStore.ts(2,10): error TS6133: 'createJSONStorage' is declared but its value is never read.
  ```
- **Root Cause:**
  Import `createJSONStorage` diimpor dari `"zustand/middleware"` namun tidak pernah digunakan.
- **Solution:**
  Hapus import `createJSONStorage` dari line 2.
  ```ts
  // ❌ Sebelum
  import { createJSONStorage, persist } from "zustand/middleware";

  // ✅ Sesudah
  import { persist } from "zustand/middleware";
  ```
- **Acceptance Criteria:**
  - `npx tsc -b` tidak lagi memunculkan error `TS6133`.

---

### [P0-02] ESLint Failure: Unused Expression in Layout/Main.tsx
- **Severity:** P0 - Blocker
- **File:** `src/Layouts/Main.tsx` (Line 8-10)
- **Problem:**
  Proses `npm run lint` gagal dengan error:
  ```text
  9:5 error Expected an assignment or function call and instead saw an expression @typescript-eslint/no-unused-expressions
  ```
- **Root Cause:**
  Menggunakan operator ternary `? :` sebagai pengganti statement `if-else` untuk fungsi navigasi tanpa menampung return valuenya.
- **Solution:**
  Ubah ekspresi ternary menjadi percabangan `if ... else` yang eksplisit:
  ```tsx
  // ❌ Sebelum
  const handleOrder = () => {
    !isLogin ? navigate("/login") : navigate("/menu");
  };

  // ✅ Sesudah
  const handleOrder = () => {
    if (!isLogin) {
      navigate("/login");
    } else {
      navigate("/menu");
    }
  };
  ```
- **Acceptance Criteria:**
  - `npm run lint` lolos tanpa error pada file ini.

---

### [P0-03] Syntax Error pada File Konfigurasi `.env` (Leading Whitespace)
- **Severity:** P0 - Blocker
- **File:** `.env` (Line 1)
- **Problem:**
  Terdapat spasi setelah tanda `=` pada variabel `VITE_API_URL`:
  ```env
  VITE_API_URL= https://wpu-cafe.vercel.app/api
  ```
- **Root Cause:**
  Vite akan membaca value env beserta spasi di awal string (`" https://wpu-cafe.vercel.app/api"`). Saat digabungkan dengan fetch template string (misal: `${BASE_URL}/menu`), URL menjadi `" https://wpu-cafe.vercel.app/api/menu"` yang berisiko membuat request fetch gagal / network error.
- **Solution:**
  Hapus spasi setelah tanda `=`:
  ```env
  # ✅ Sesudah
  VITE_API_URL=https://wpu-cafe.vercel.app/api
  ```
- **Acceptance Criteria:**
  - `import.meta.env.VITE_API_URL` tidak memiliki leading/trailing whitespace.
  - Request fetch ke API berjalan mulus tanpa error URL malformed.

---

### [P1-01] Silent Failure pada Halaman Login (Missing Error Handling)
- **Severity:** P1 - High
- **File:** `src/Pages/Login.tsx` (Line 25-35)
- **Problem:**
  Komponen `Login.tsx` menyediakan state `const [error, setError] = useState<string>("");`, tetapi `loginMutation` **sama sekali tidak memiliki callback `onError`**. Jika user memasukkan email/password yang salah atau server mengalami down (500), tombol kembali normal tanpa menampilkan pesan kesalahan apa pun ke user.
- **Root Cause:**
  `useMutation` hanya menangani `onSuccess`.
- **Solution:**
  Tambahkan handler `onError` pada konfigurasi `useMutation`:
  ```tsx
  // ✅ Solusi:
  const loginMutation = useMutation({
    mutationFn: authLogin,
    onSuccess: ({ token, user }) => {
      loginAction(token, user);
      navigate("/");
    },
    onError: (err: Error) => {
      setError(err.message || "Gagal masuk. Silakan periksa kembali email dan password Anda.");
    },
  });
  ```
- **Acceptance Criteria:**
  - Ketika login gagal (contoh: status 400/401/500), pesan error muncul di banner merah di atas form.
  - Saat submit ulang, error lama dibersihkan dan diganti error baru jika masih gagal.

---

### [P1-02] Broken Navigation Link: Checkout Route Menuju 404
- **Severity:** P1 - High
- **Files:**
  - `src/Pages/Cart.tsx` (Line 88-93)
  - `src/routes/router.tsx`
- **Problem:**
  Di halaman `Cart.tsx`, terdapat tombol:
  ```tsx
  <Link to="/checkout" className="...">Checkout →</Link>
  ```
  Namun rute `/checkout` **belum terdaftar** di `router.tsx`, sehingga jika user menekan Checkout, mereka terlempar ke halaman blank 404 (`NotFound`).
- **Solution:**
  Pilih salah satu dari 2 opsi berikut:
  1. **Opsi A (Recommended jika Checkout belum siap):** Nonaktifkan tombol / ganti menjadi interaksi checkout sementara (misal tombol alert konfirmasi pembayaran & panggil `clearCart()`).
  2. **Opsi B:** Buat rute `/checkout` dengan komponen `Checkout.tsx` di dalam `ProtectedRoute` di `router.tsx`.
- **Acceptance Criteria:**
  - Tidak ada tombol atau link yang mengarahkan user ke halaman 404 tak terduga.

---

### [P1-03] Flawed API Error Handling di `authApi.ts`
- **Severity:** P1 - High
- **File:** `src/api/authApi.ts` (Line 13-15)
- **Problem:**
  Kode membaca `json.Error`:
  ```ts
  if (!response.ok) throw new Error(json.Error || "Login gagal");
  ```
  Sebagian besar REST API standar (termasuk Express/Nest/FastAPI) mengembalikan pesan error dengan key huruf kecil `json.message` atau `json.error`, bukan PascalCase `json.Error`. Selain itu, jika server mengembalikan status non-200 berupa HTML (misal 502 Bad Gateway), `await response.json()` akan melempar unhandled syntax crash.
- **Solution:**
  Gunakan pengecekan fallback yang aman:
  ```ts
  export const authLogin = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = json?.message || json?.error || json?.Error || "Login gagal, silakan coba lagi.";
      throw new Error(errorMessage);
    }
    return json;
  };
  ```
- **Acceptance Criteria:**
  - Pesan error dari backend ditampilkan dengan benar dan tidak jatuh ke error generic jika backend mengirim `{ message: "..." }`.

---

### [P1-04] Logic Scoping & Safe Destructuring di `MenuDetail.tsx`
- **Severity:** P1 - High
- **File:** `src/Layouts/MenuDetail.tsx` (Line 16-19 & Line 39)
- **Problem:**
  Handler `handleAdd` dipasang sebelum pengecekan awal (`isPending`, `isError`, `!data`).
  ```tsx
  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(menuItem); // menuItem dideklarasikan 20 baris di bawahnya!
  };
  ...
  if (isPending) return ...;
  if (!data) return null;
  const { menuItem, reviews } = data;
  ```
  Meskipun JS hoisting/lexical closure bekerja saat event handler dipanggil, menulis closure yang mengakses variabel sebelum deklarasinya merupakan *bad practice* (meningkatkan risiko TDZ / runtime bugs jika urutan refactor berubah) dan membingungkan linter/developer.
- **Solution:**
  Pindahkan deklarasi `handleAdd` ke bawah pengecekan data, atau passing langsung `data.menuItem`:
  ```tsx
  if (isPending) return <div ...>Loading...</div>;
  if (isError) return <div ...>Gagal memuat menu</div>;
  if (!data) return null;

  const { menuItem, reviews } = data;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(menuItem);
  };
  ```
- **Acceptance Criteria:**
  - Variabel dideklarasikan sebelum digunakan.

---

### [P2-01] Struktur Folder & Penamaan File Tidak Standar
- **Severity:** P2 - Medium
- **Files:**
  - `src/Layouts/Main.tsx`
  - `src/Layouts/MenuDetail.tsx`
  - `src/Components/CardMenus(dengan zustand).tsx`
  - `src/Layouts/MenuDetail(dengan zustand).tsx`
  - `src/Pages/Menus(denganzustand).tsx`
  - `src/stores/menuDetailStore.ts`
  - `src/App.tsx`
- **Problem:**
  1. `src/Layouts/Main.tsx` adalah Hero section, bukan Layout aplikasi.
  2. `src/Layouts/MenuDetail.tsx` adalah Halaman (Page), bukan Layout.
  3. Ada 3 file dengan tanda kurung bahasa Indonesia `(dengan zustand)`. Ini adalah file eksperimen yang tidak terpakai (orphaned/dead code).
  4. `src/stores/menuDetailStore.ts` tidak digunakan pada alur utama router.
  5. `src/App.tsx` tidak digunakan karena `main.tsx` langsung merender `RouterProvider`.
- **Solution:**
  1. Rename & pindahkan `src/Layouts/Main.tsx` -> `src/Components/Hero.tsx` (atau sesuaikan impornya di `src/Pages/Home.tsx`).
  2. Pindahkan `src/Layouts/MenuDetail.tsx` -> `src/Pages/MenuDetail.tsx` (dan sesuaikan impor di `src/routes/router.tsx`).
  3. Hapus (atau arsipkan ke folder `experiments/` jika ingin dijadikan catatan belajar) file-file duplikat:
     - `src/Components/CardMenus(dengan zustand).tsx`
     - `src/Layouts/MenuDetail(dengan zustand).tsx`
     - `src/Pages/Menus(denganzustand).tsx`
     - `src/stores/menuDetailStore.ts`
  4. Hapus file `src/App.tsx` yang tidak terpakai.
- **Acceptance Criteria:**
  - Semua nama file mengikuti standar camelCase/PascalCase tanpa tanda kurung atau spasi.
  - Komponen halaman berada di folder `Pages/`, layout di `Layouts/`, dan reusable components di `Components/`.

---

### [P2-02] Inkonsistensi Layout: Header Diimpor Berulang Kali
- **Severity:** P2 - Medium
- **Files:** `src/Pages/Home.tsx`, `src/Pages/Menus.tsx`, `src/Pages/Cart.tsx`, `src/routes/router.tsx`
- **Problem:**
  Komponen `<Header />` di-render secara manual di setiap halaman (`Home`, `Menus`, `Cart`). Sebaliknya, halaman `MenuDetail` justru kehilangan `Header` sehingga navigasi hilang saat berada di detail menu.
- **Solution:**
  Implementasikan pattern **Root Layout** dengan `<Outlet />` dari React Router:
  1. Buat file `src/Layouts/RootLayout.tsx`:
     ```tsx
     import { Outlet } from "react-router";
     import Header from "../Components/Header";

     const RootLayout = () => {
       return (
         <div className="min-h-screen flex flex-col bg-gray-50">
           <Header />
           <main className="flex-1">
             <Outlet />
           </main>
         </div>
       );
     };

     export default RootLayout;
     ```
  2. Di `src/routes/router.tsx`, jadikan `RootLayout` sebagai parent route utama:
     ```tsx
     const router = createBrowserRouter([
       {
         element: <RootLayout />,
         children: [
           { path: "/", element: <Home /> },
           { path: "/menu", element: <Menus /> },
           { path: "/menu/:id", element: <MenuDetail /> },
           {
             element: <ProtectedRoute />,
             children: [{ path: "/cart", element: <Cart /> }],
           },
         ],
       },
       {
         element: <GuestRoute />,
         children: [{ path: "/login", element: <Login /> }],
       },
       { path: "*", element: <NotFound /> },
     ]);
     ```
  3. Hapus import dan pemanggilan `<Header />` individual dari `Home.tsx`, `Menus.tsx`, dan `Cart.tsx`.
- **Acceptance Criteria:**
  - Header konsisten muncul di semua halaman publik dan cart.
  - Kode halaman lebih bersih dan DRY (Don't Repeat Yourself).

---

### [P2-03] Zustand Selector Anti-pattern di Halaman Cart & Menus
- **Severity:** P2 - Medium
- **Files:**
  - `src/Pages/Cart.tsx` (Line 10)
  - `src/Pages/Menus.tsx` (Line 17)
- **Problem:**
  Memanggil fungsi getter store langsung di dalam selector hook:
  ```tsx
  // ❌ Anti-pattern:
  const totalPrice = useCartStore((s) => s.getTotalPrice());
  const totalItems = useCartStore((state) => state.getTotalItem());
  ```
  Di Zustand, selector seharusnya berupa fungsi deterministik yang memetakan state ke value primitif atau object yang stabil. Memanggil `s.getTotalPrice()` yang di dalamnya memanggil `get()` mengevaluasi ulang fungsi di setiap render cycle tanpa selektor memoization yang rapi.
- **Solution:**
  Hitung langsung via selector murni atau ekstrak selector tersendiri:
  ```tsx
  // ✅ Rekomendasi di Cart.tsx:
  const totalPrice = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  // ✅ Rekomendasi di Menus.tsx / Header.tsx:
  const totalItems = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  ```
- **Acceptance Criteria:**
  - Cart dan Menus melakukan kalkulasi reaktif murni berdasarkan perubahan array `items`.

---

### [P2-04] Duplikasi Model TypeScript: `Menu` vs `MenuItem`
- **Severity:** P2 - Medium
- **Files:**
  - `src/types/Menu.ts`
  - `src/types/MenuDetail.ts`
- **Problem:**
  Interface `Menu` di `Menu.ts` dan `MenuItem` di `MenuDetail.ts` memiliki field yang 100% sama (identik):
  ```ts
  id, name, description, price, image_url, category, is_available, created_at
  ```
  Adanya dua interface yang sama menyebabkan kebingungan tipe data saat passing props antar komponen.
- **Solution:**
  Gunakan kembali `Menu` dari `types/Menu.ts` di dalam `MenuDetailResponse`:
  ```ts
  // src/types/MenuDetail.ts
  import type { Menu } from "./Menu";

  export interface ItemReview {
    id: string;
    menu_item_id: string;
    reviewer_name: string;
    rating: number;
    comment: string;
    created_at: string;
  }

  export interface Reviews {
    items: ItemReview[];
    total: number;
    averageRating: number;
  }

  export interface MenuDetailResponse {
    menuItem: Menu;
    reviews: Reviews;
  }
  ```
- **Acceptance Criteria:**
  - Tidak ada interface duplikat untuk entitas Menu item.

---

### [P2-05] Pembersihan Debug Log & File Dead Code
- **Severity:** P2 - Medium
- **Files:**
  - `src/Components/ProtectedRoute.tsx` (Line 6)
  - `src/api/menuApi.ts` (Line 22)
  - `src/utils/errorHandler.ts`
- **Problem:**
  1. `ProtectedRoute.tsx` mencetak `console.log("token:", "auth-Storage");`.
  2. `menuApi.ts` mencetak `console.log(data);`.
  3. `src/utils/errorHandler.ts` dibuat namun tidak pernah diimpor sama sekali di project.
- **Solution:**
  - Hapus semua sisa `console.log`.
  - Sambungkan `errorHandler.ts` ke fungsi catch API atau hapus jika tidak diperlukan.
- **Acceptance Criteria:**
  - Console browser bersih dari log sampah/debugging.

---

### [P3-01] Tailwind Class Conflict & Missing Visual Feedback pada Button
- **Severity:** P3 - Low
- **File:** `src/Components/CardMenus.tsx` (Line 42)
- **Problem:**
  Konflik utility class pada tombol Add to Cart:
  ```tsx
  className={`bg-amber-950 text-gray-100 px-4 py-1 rounded-xl hover:bg-amber-900 transition duration-200 cursor-pointer ${
    isInCart
      ? "bg-green-600 text-white hover:bg-green-700"
      : "bg-amber-950 text-white hover:bg-amber-900"
  }`}
  ```
  Kelas `bg-amber-950` berada di string dasar DAN di string kondisi, sehingga terjadi tumpang tindih CSS selector specificity di Tailwind. Selain itu, jika `isInCart` bernilai true, teks tombol tetap "Add" dan tidak memberikan feedback seperti "Added (✓)".
- **Solution:**
  Pisahkan class dasar dengan class dinamis:
  ```tsx
  <button
    className={`px-4 py-1 rounded-xl transition duration-200 cursor-pointer text-white font-medium ${
      isInCart
        ? "bg-green-600 hover:bg-green-700"
        : "bg-amber-950 hover:bg-amber-900"
    }`}
    onClick={handleAdd}
  >
    {isInCart ? "In Cart ✓" : "Add"}
  </button>
  ```
- **Acceptance Criteria:**
  - Tidak ada bentrok class warna background.
  - Teks tombol berubah informatif saat produk sudah ada di keranjang.

---

### [P3-02] Kontras Warna Rendah pada Hover State Button
- **Severity:** P3 - Low
- **Files:**
  - `src/Components/LoginButton.tsx` (Line 7)
  - `src/Components/LogoutButton.tsx` (Line 15)
- **Problem:**
  Tombol menggunakan:
  ```tsx
  className="bg-amber-900 text-gray-200 ... hover:bg-gray-300"
  ```
  Saat cursor di-hover, warna background menjadi abu-abu terang (`bg-gray-300`) sementara teks tetap abu-abu terang (`text-gray-200`). Ini menyebabkan teks tidak terbaca (contrast ratio < 2:1, melanggar standar WCAG AA).
- **Solution:**
  Sesuaikan warna teks saat hover atau gunakan variasi warna amber:
  ```tsx
  // ✅ Contoh solusi:
  className="bg-amber-900 text-white rounded-md py-2 px-4 font-bold cursor-pointer hover:bg-amber-800 transition duration-200"
  ```
- **Acceptance Criteria:**
  - Teks tetap memiliki kontras tinggi yang nyaman dibaca baik dalam keadaan normal maupun hover.

---

### [P3-03] Full Page Fallback Kasar pada Menus & Empty State
- **Severity:** P3 - Low
- **File:** `src/Pages/Menus.tsx` (Line 25-26)
- **Problem:**
  ```tsx
  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error...</p>;
  ```
  Jika data sedang dimuat atau error, halaman merender teks mentah di layar putih tanpa Header ataupun layout dasar aplikasi. Hal ini menyebabkan efek layout shift / flickering yang buruk bagi pengguna.
- **Solution:**
  Render skeleton loading atau spinner yang tetap mempertahankan layout dan Header:
  ```tsx
  if (isPending) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center py-20">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-900 border-t-transparent mb-4"></div>
        <p className="text-amber-950 font-medium">Memuat menu lezat...</p>
      </div>
    );
  }
  ```
- **Acceptance Criteria:**
  - Tampilan loading dan error tetap berada dalam frame layout aplikasi yang rapi.

---

### [P3-04] Validasi Schema & Metadata Polish
- **Severity:** P3 - Low
- **Files:**
  - `src/schemas/auth.schema.ts` (Line 11)
  - `index.html` (Line 7)
  - `src/Pages/NotFound.tsx`
- **Problem:**
  1. Pesan validasi tidak sinkron di `registerSchema`: `min(3, "Name requires at least 8 characters")`.
  2. Title di `index.html` masih default repo: `<title>13-cobapart1</title>`.
  3. Halaman `NotFound.tsx` hanya berupa `<div>NotFound</div>` tanpa tombol kembali ke Beranda.
- **Solution:**
  1. Sesuaikan validator `min(3, "Name requires at least 3 characters")`.
  2. Ganti title di `index.html` menjadi `<title>MasDim Cafe</title>`.
  3. Berikan styling ramah pengguna pada `NotFound.tsx` beserta link `<Link to="/">Kembali ke Beranda</Link>`.
- **Acceptance Criteria:**
  - Pesan validasi akurat.
  - Tab browser menampilkan nama brand yang profesional.
  - Halaman 404 memiliki rute kembali yang jelas.

---

## 🗺️ Step-by-Step Implementation Roadmap

Bagi Junior Programmer atau AI Worker, kerjakan perbaikan dengan urutan tahapan berikut:

```
[Fase 1: P0 Blockers & Env]
  1. Perbaiki spasi pada `.env` (P0-03)
  2. Hapus unused import `createJSONStorage` di `authStore.ts` (P0-01)
  3. Ubah ternary menjadi if-else di `Layouts/Main.tsx` (P0-02)
  4. Jalankan `npm run build` & `npm run lint` untuk verifikasi build hijau.

[Fase 2: P1 Functional & Network Fixes]
  5. Tambahkan `onError` dan pesan feedback di `Login.tsx` (P1-01)
  6. Perbaiki parsing error fallback di `authApi.ts` (P1-03)
  7. Rapikan deklarasi `handleAdd` di `MenuDetail.tsx` (P1-04)
  8. Handle rute Checkout di `Cart.tsx` / `router.tsx` (P1-02)

[Fase 3: P2 Refactoring & Code Hygiene]
  9. Bersihkan dead files (`App.tsx`, file `(dengan zustand)`) (P2-01)
  10. Pindahkan Main -> Hero, MenuDetail -> Pages (P2-01)
  11. Implementasikan `RootLayout` terpusat untuk Header (P2-02)
  12. Perbaiki selector Zustand di `Cart.tsx` & `Menus.tsx` (P2-03)
  13. Rapikan interface duplikat `Menu` & `MenuItem` (P2-04)
  14. Hapus `console.log` sisa (P2-05)

[Fase 4: P3 UI/UX & Quality-of-Life]
  15. Benahi Tailwind class conflict di `CardMenus.tsx` (P3-01)
  16. Perbaiki kontras hover tombol Login/Logout (P3-02)
  17. Perbagus Loading/Error state di `Menus.tsx` (P3-03)
  18. Update title `index.html` & styling `NotFound.tsx` (P3-04)
```

---

## 🧪 Verification & Acceptance Checklist

Sebelum menandai seluruh issue ini selesai (`Resolved`), jalankan verifikasi berikut:

- [ ] **Typecheck & Build:**  
  ```bash
  npm run build
  ```  
  *Harus exit dengan code 0 tanpa error.*
- [ ] **Linter:**  
  ```bash
  npm run lint
  ```  
  *Harus 0 errors dan 0 warnings.*
- [ ] **Login Flow:** Coba login dengan kredensial salah, verifikasi pesan error muncul di UI. Coba kredensial benar, verifikasi user diarahkan ke `/` dan token tersimpan.
- [ ] **Menu & Cart Flow:** Buka menu, filter kategori, klik item untuk melihat detail, tambahkan ke keranjang, dan ubah quantity di halaman Cart.
- [ ] **Routing:** Cek halaman 404, pastikan ada tombol kembali ke Beranda.
