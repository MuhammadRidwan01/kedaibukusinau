# Design Context — Website Toko Buku
> File ini digunakan sebagai konteks utama untuk AI dalam membuat keputusan desain.
> Selalu rujuk file ini sebelum membuat komponen, layout, atau keputusan visual apapun.

---

## Identitas Proyek

| Key | Value |
|-----|-------|
| Nama Proyek | Website Katalog Toko Buku |
| Tipe | Katalog + Blog + Admin Panel (bukan e-commerce penuh) |
| Transaksi | Tidak ada di website — diarahkan ke Shopee & WhatsApp |
| Developer | Muhammad Ridwan |
| Stack | (sesuaikan dengan stack yang digunakan developer) |

---

## Prinsip Desain

Gunakan prinsip ini sebagai filter utama saat membuat keputusan desain.

### 1. Editorial First
Website ini adalah etalase buku, bukan marketplace. Desain harus terasa seperti membuka majalah atau katalog toko buku independen yang berkelas — bukan seperti Tokopedia atau Shopee.

### 2. Warm & Trustworthy
Pengunjung harus merasa nyaman berlama-lama di website ini. Hindari warna dingin, sudut tajam yang keras, atau elemen yang terlalu "tech startup". Gunakan nuansa hangat, spacing longgar, dan tipografi yang readable.

### 3. CTA is King
Satu-satunya tujuan bisnis website ini adalah membuat pengunjung klik **"Beli di Shopee"** atau **"Chat via WhatsApp"**. Setiap keputusan desain harus mendukung tujuan ini. Jika ada konflik antara estetika dan visibilitas CTA — prioritaskan CTA.

### 4. Content Over Chrome
Buku adalah konten utama. Cover buku harus jadi elemen visual yang paling menonjol di setiap halaman produk. Hindari dekorasi UI yang mengalihkan perhatian dari cover dan judul buku.

### 5. Mobile is Primary
Mayoritas pengunjung toko buku online mengakses lewat HP. Desain mobile bukan sekadar versi "diperkecil" — rancang untuk mobile dulu, lalu expand ke desktop.

---

## Design Tokens

### Warna

```
/* Background */
--color-bg-primary:     #FAF3E0;   /* Cream — background utama semua halaman publik */
--color-bg-secondary:   #FFFFFF;   /* Putih — card, form, modal */
--color-bg-tertiary:    #F0E9D6;   /* Cream gelap — hover state, section alt */

/* Text */
--color-text-primary:   #1A1A1A;   /* Near black — heading, body utama */
--color-text-secondary: #4A4A4A;   /* Abu gelap — subheading, deskripsi */
--color-text-muted:     #888888;   /* Abu — caption, placeholder, metadata */
--color-text-inverse:   #FFFFFF;   /* Putih — teks di atas background gelap */

/* Accent */
--color-accent-red:     #C0392B;   /* Merah — CTA utama, badge, highlight */
--color-accent-red-hover: #A93226; /* Merah gelap — hover state tombol merah */
--color-accent-navy:    #1E3A5F;   /* Navy — header, footer, elemen sekunder */
--color-accent-navy-hover: #162D4A;
--color-accent-green:   #25D366;   /* WhatsApp green — tombol WA */
--color-accent-green-hover: #1DA851;

/* Border */
--color-border-primary: #E0D9CE;   /* Border card, input, divider */
--color-border-focus:   #C0392B;   /* Focus ring input */

/* Status */
--color-success:        #27AE60;
--color-warning:        #F39C12;
--color-error:          #E74C3C;
--color-info:           #2980B9;

/* Admin Panel (berbeda dari publik) */
--color-admin-bg:       #F4F6F9;
--color-admin-sidebar:  #1E3A5F;
--color-admin-sidebar-text: #FFFFFF;
--color-admin-sidebar-active: #C0392B;
```

### Tipografi

```
/* Font Family */
--font-serif:    'Playfair Display', 'Lora', Georgia, serif;
--font-sans:     'Inter', 'DM Sans', 'Helvetica Neue', sans-serif;

/* Heading — gunakan font serif */
--text-h1:       clamp(28px, 4vw, 40px) / --font-serif / Bold
--text-h2:       clamp(22px, 3vw, 28px) / --font-serif / Bold
--text-h3:       18px / --font-sans / SemiBold (600)
--text-h4:       16px / --font-sans / SemiBold (600)

/* Body — gunakan font sans */
--text-body-lg:  16px / --font-sans / Regular (400) / line-height: 1.7
--text-body:     14px / --font-sans / Regular (400) / line-height: 1.6
--text-small:    12px / --font-sans / Regular (400)
--text-caption:  11px / --font-sans / Medium (500) / uppercase / letter-spacing: 0.05em

/* Tombol */
--text-btn:      14px / --font-sans / SemiBold (600)
```

### Spacing

```
/* Gunakan skala 4px */
--space-1:   4px
--space-2:   8px
--space-3:   12px
--space-4:   16px
--space-5:   20px
--space-6:   24px
--space-8:   32px
--space-10:  40px
--space-12:  48px
--space-16:  64px
--space-20:  80px
--space-24:  96px

/* Section padding (vertikal) */
--section-py-sm:  40px
--section-py-md:  64px
--section-py-lg:  96px

/* Container */
--container-max:  1200px
--container-px:   24px   /* kiri + kanan */
```

### Border Radius

```
--radius-sm:   4px    /* input, badge kecil */
--radius-md:   8px    /* card, button */
--radius-lg:   12px   /* card besar, modal */
--radius-xl:   16px   /* hero card */
--radius-full: 999px  /* pill badge */
```

### Shadow

```
--shadow-sm:  0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
--shadow-md:  0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
--shadow-lg:  0 10px 30px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06);
--shadow-hover: 0 8px 24px rgba(0,0,0,0.12);
```

---

## Komponen

### Book Card
```
Ukuran cover: rasio 2:3 (contoh: 200x300px, 160x240px)
Hover state: shadow naik (--shadow-hover), cover scale(1.02), judul underline
Badge posisi: pojok kiri atas cover, absolute
Padding card: 12px
Gap antar info: 4px
Harga: font-sans, SemiBold, warna --color-accent-red
```

### Tombol CTA (paling penting)
```
"Beli di Shopee":
  bg: --color-accent-red
  text: #FFFFFF
  hover: --color-accent-red-hover + shadow naik
  icon: Shopee icon atau shopping-bag

"Chat via WhatsApp":
  bg: --color-accent-green
  text: #FFFFFF
  hover: --color-accent-green-hover + shadow naik
  icon: WhatsApp icon

Ukuran tombol di halaman detail buku:
  height: 48px minimum
  padding: 12px 24px
  width: 100% (mobile), min 200px (desktop)
  border-radius: --radius-md
  font: --text-btn
```

### Navbar
```
Height: 64px desktop, 56px mobile
Background: #FFFFFF dengan border-bottom 1px --color-border-primary
Sticky: yes
Logo: kiri
Menu: tengah (desktop) / hidden (mobile, pakai hamburger)
Kanan: ikon search, ikon user (untuk link admin)
Active menu item: warna --color-accent-red, underline
Mobile menu: slide down panel, full width
```

### Badge
```
"New":        bg #27AE60, text putih
"Best Seller": bg #C0392B, text putih
"Diskon":     bg #F39C12, text putih
"Habis":      bg #888888, text putih
font: 10px, SemiBold, uppercase, padding 3px 8px, border-radius --radius-full
```

### Form Input
```
height: 44px
border: 1px solid --color-border-primary
border-radius: --radius-sm
padding: 0 12px
font: --text-body
focus: border-color --color-border-focus, ring 2px rgba(192,57,43,0.15)
error: border-color --color-error
```

### Admin Sidebar
```
width: 240px (desktop), full screen (mobile drawer)
background: --color-admin-sidebar (#1E3A5F)
text: --color-admin-sidebar-text
active item: bg rgba(255,255,255,0.1), left border 3px --color-admin-sidebar-active
icon + label per menu item
collapse ke 64px di tablet (icon only)
```

---

## Layout & Grid

### Halaman Publik
```
Container max-width: 1200px, centered, padding kiri-kanan 24px
Grid buku:
  Desktop (≥1024px): 4 kolom, gap 24px
  Tablet (768-1023px): 3 kolom, gap 16px
  Mobile (<768px): 2 kolom, gap 12px

Grid artikel:
  Desktop: 3 kolom
  Tablet: 2 kolom
  Mobile: 1 kolom
```

### Halaman Detail Buku
```
Desktop: 2 kolom — cover 40% | info 60%, gap 48px
Tablet: 2 kolom — cover 45% | info 55%
Mobile: 1 kolom — cover penuh atas, info bawah
Cover: max-width 400px, border-radius --radius-lg, shadow --shadow-md
```

### Admin Panel
```
Sidebar: 240px fixed kiri
Konten: sisa lebar - sidebar
Header bar: 64px, background putih, shadow bawah tipis
Content padding: 24px
Stat cards: 4 kolom → 2 kolom (tablet) → 1 kolom (mobile)
```

---

## Keputusan Desain Berdasarkan Kasus

### ❓ Background section berbeda atau sama?
✅ Alternasikan antara `--color-bg-primary` (cream) dan `#FFFFFF` untuk memberi ritme visual di landing page. Gunakan hanya 2 nilai ini, tidak lebih.

### ❓ Berapa banyak font yang dipakai?
✅ Maksimal 2 font: 1 serif (heading) + 1 sans-serif (body). Jangan tambah font ketiga.

### ❓ CTA Shopee vs WA, mana yang lebih utama?
✅ Keduanya setara. Tampilkan side by side dengan ukuran sama. Jangan buat salah satu lebih kecil.

### ❓ Halaman tanpa konten (empty state)?
✅ Selalu buat empty state yang jelas: ilustrasi ringan + teks deskriptif + tombol aksi. Contoh: "Belum ada buku tersedia. Kembali lagi nanti."

### ❓ Loading state?
✅ Gunakan skeleton loading (bukan spinner) untuk card buku dan artikel.

### ❓ Gambar buku belum tersedia?
✅ Gunakan placeholder dengan background --color-bg-tertiary + ikon buku di tengah. Jangan pakai gambar "image not found" generik.

### ❓ Teks judul buku terlalu panjang?
✅ Truncate di 2 baris (line-clamp: 2) untuk card. Tampilkan full di halaman detail.

### ❓ Harga: pakai titik atau koma?
✅ Format Indonesia: Rp 125.000 (titik sebagai pemisah ribuan, tanpa koma desimal).

### ❓ Apakah admin panel harus ikut estetika publik?
✅ TIDAK. Admin panel clean, professional, minimal. Tidak pakai font serif, background cukup #F4F6F9.

### ❓ Berapa minimum touch target di mobile?
✅ 44x44px minimum untuk semua elemen yang bisa diklik/diketuk.

### ❓ Apakah perlu animasi?
✅ Animasi ringan saja: hover transition 200ms ease, page fade-in 300ms. Hindari animasi berat yang memperlambat persepsi loading.

---

## Yang Tidak Boleh Dilakukan

```
❌ Jangan pakai lebih dari 2 font family
❌ Jangan pakai background putih polos (#FFFFFF) sebagai background utama halaman publik — pakai cream
❌ Jangan sembunyikan tombol CTA atau buat ukurannya kecil
❌ Jangan pakai gradien agresif — subtle saja jika perlu
❌ Jangan pakai lebih dari 5 warna berbeda dalam satu halaman
❌ Jangan buat layout admin sama dengan halaman publik
❌ Jangan pakai font serif di admin panel
❌ Jangan pakai icon yang tidak konsisten (pilih satu icon library: Lucide / Heroicons / Phosphor)
❌ Jangan pakai shadow yang terlalu berat di halaman publik — terasa berat dan tidak editorial
❌ Jangan hilangkan breadcrumb di halaman dalam (katalog, detail buku, artikel)
```

---

## Referensi Visual

Saat ragu, tanya: *"Apakah desain ini cocok untuk toko buku independen yang serius, atau terlihat seperti marketplace diskon?"*

Jika jawabannya kedua — revisi. Tujuannya adalah yang pertama.

---

*Design Context v1.0 — Muhammad Ridwan — Website Toko Buku*
