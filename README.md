# Neoskara UI

Pratinjau desain tampilan awal toko Neoskara, sebelum diimplementasikan di aplikasi Laravel 13 + Livewire 4.

**Live:** https://hanifauliya.github.io/neoskara-ui/

## Arah desain

- **Khas Banjarmasin:** motif sasirangan (Gigi Haruan, Kulat Kurikit, Ombak Sinapur Karang, dll.), pasar terapung Lok Baintan, jukung dan tanggui, sapaan bahasa Banjar (pian, dangsanak, bungas, baisukan).
- **Sentuhan Jepang:** ruang kosong yang lega, huruf serif Shippori Mincho, angka kanji sebagai penanda bagian, teks vertikal katakana.
- **Palet:** indigo sungai `#1f2a44`, merah kesumba `#b3262d`, kuning kunyit `#e2a93b`, krem washi `#f6efe3`.

Semua gambar produk adalah SVG yang digambar dari kode (siluet pakaian + tile motif), jadi tidak ada foto berhak cipta. Produk, harga, dan klaim di halaman masih contoh.

## Struktur

```
index.html            halaman utama
assets/css/style.css  token warna, layout, komponen, responsif
assets/js/data.js     data contoh: palet, motif, siluet, kategori, produk
assets/js/main.js     render kartu, filter, keranjang simulasi, menu mobile
assets/img/           favicon
```

## Menjalankan lokal

Tanpa build. Buka lewat server statis apa saja, misalnya:

```bash
python -m http.server 8080
# lalu buka http://localhost:8080
```

## Catatan untuk Laravel

Token warna di `:root` (style.css) bisa dipindah ke `@theme` di `resources/css/app.css`. Bagian halaman (hero, kategori, kartu produk, motif) sudah dipisah sehingga mudah dijadikan Blade/Livewire component.
