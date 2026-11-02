# Neoskara UI

Pratinjau desain tampilan awal toko Neoskara Indonesia, sebelum diimplementasikan di aplikasi Laravel 13 + Livewire 4.

**Live:** https://hanifauliya.github.io/neoskara-ui/

## Arah desain

Mengikuti gaya Instagram [@neoskara](https://www.instagram.com/neoskara/):

- **Gelap dan streetwear:** latar hitam, teks krem, huruf grotesk tebal dan rapat (Archivo), tekstur grain seperti foto feed.
- **Aksen logo:** merah `#e0301e` dan oranye `#f39a2b` dari logo, dipakai hemat (tombol, badge, penanda).
- **Kampanye #SAVEBORNEO:** latar bara coklat berbintik dan huruf serif Romawi (Cinzel), seperti post kampanye di IG.
- **Komunitas #NeoFCteam:** warna navy dan emas dari jersey.
- **Identitas lokal:** Banjarmasin, Borneo, bahasa Banjar ringan ("pian").

Foto produk dan logo dari Neoskara. Kaos #SaveBorneo dan jersey NeoFC masih grafik SVG karena belum ada fotonya. Harga masih contoh.

## Struktur

```
index.html            halaman utama
assets/css/style.css  token warna, layout, komponen, responsif
assets/js/data.js     data contoh kategori dan produk
assets/js/main.js     render produk, filter, keranjang simulasi, menu mobile
assets/img/           logo, foto lookbook, foto produk, favicon
```

## Menjalankan lokal

Tanpa build. Buka lewat server statis apa saja:

```bash
python -m http.server 8080
# lalu buka http://localhost:8080
```

## Catatan untuk Laravel

Token warna di `:root` (style.css) bisa dipindah ke `@theme` di `resources/css/app.css`. Kartu produk, hero, dan blok kampanye sudah terpisah rapi sehingga mudah dijadikan komponen Blade/Livewire.
