/*
 * Data contoh untuk pratinjau desain Neoskara.
 * Harga dan stok belum final; nanti diganti katalog dari Laravel.
 */
window.NEOSKARA = (() => {
  'use strict';

  const categories = [
    { id: 'kaos', name: 'Kaos' },
    { id: 'outer', name: 'Outer' },
    { id: 'celana', name: 'Celana' },
  ];

  /**
   * `image` = foto utama kartu, `hoverImage` (opsional) muncul saat kursor
   * di atas kartu. Tanpa foto, kartu memakai grafik `art` dari main.js.
   */
  const products = [
    {
      id: 1,
      name: 'Kaos Neoskara Indonesia',
      category: 'kaos',
      color: 'Hitam',
      price: 159000,
      image: 'assets/img/products/kaos-neoskara-indonesia.jpg',
      alt: 'Model memakai kaos hitam oversize bertuliskan Neoskara Indonesia',
    },
    {
      id: 2,
      name: 'Hoodie Zip NSKR',
      category: 'outer',
      color: 'Hitam',
      price: 389000,
      image: 'assets/img/products/hoodie-zip-nskr.jpg',
      alt: 'Model memakai hoodie zip hitam dengan logo X besar dan tulisan NSKR',
    },
    {
      id: 3,
      name: 'Celana Pendek Stripe',
      category: 'celana',
      color: 'Hitam garis putih',
      price: 179000,
      image: 'assets/img/products/celana-pendek-stripe.jpg',
      alt: 'Celana pendek hitam bergaris putih dipakai model',
    },
    {
      id: 4,
      name: 'Kaos #SaveBorneo',
      category: 'kaos',
      color: 'Hitam',
      price: 169000,
      badge: 'Pre-order',
      image: 'assets/img/products/kaos-saveborneo.jpg',
      alt: 'Kaos hitam #SaveBorneo digantung di tengah hutan yang terbakar',
      hoverImage: 'assets/img/lookbook/kaos-saveborneo-masker.jpg',
      hoverAlt: 'Model bermasker gas memakai kaos #SaveBorneo, sablon di punggung',
    },
  ];

  return Object.freeze({ categories, products });
})();
