/*
 * Data contoh untuk pratinjau desain Neoskara.
 * Nanti diganti data dari Laravel (katalog produk sungguhan).
 */
window.NEOSKARA = (() => {
  'use strict';

  /** Palet: diambil dari warna celup sasirangan dan sungai Banjarmasin. */
  const color = {
    indigo: '#1f2a44',   // tarum, biru sungai malam
    river: '#2f5d73',    // Martapura pagi hari
    moss: '#3d4a3a',     // hijau lumut tepian
    kunyit: '#e2a93b',   // kuning kunyit
    kesumba: '#b3262d',  // merah kesumba
    ulin: '#6b1f2a',     // merah kayu ulin
    washi: '#f6efe3',    // kertas krem
    sand: '#e8dcc4',     // pasir sungai
  };

  /**
   * Motif sasirangan, digambar sebagai tile SVG berulang.
   * `tile` memakai currentColor supaya warnanya bisa diganti per produk.
   */
  const motifs = [
    {
      id: 'gigi-haruan',
      name: 'Gigi Haruan',
      meaning: 'Deretan segitiga seperti gigi ikan haruan. Lambang ketajaman berpikir dan keteguhan.',
      w: 24, h: 14,
      tile: '<path fill="currentColor" d="M0 14 6 2l6 12 6-12 6 12Z"/>',
    },
    {
      id: 'kulat-kurikit',
      name: 'Kulat Kurikit',
      meaning: 'Jamur kecil yang tumbuh rapat. Tanda kesuburan dan rezeki yang terus tumbuh.',
      w: 28, h: 28,
      tile: '<g fill="currentColor"><circle cx="14" cy="8" r="3"/><circle cx="14" cy="20" r="3"/><circle cx="8" cy="14" r="3"/><circle cx="20" cy="14" r="3"/><circle cx="0" cy="0" r="1.6"/><circle cx="28" cy="0" r="1.6"/><circle cx="0" cy="28" r="1.6"/><circle cx="28" cy="28" r="1.6"/></g>',
    },
    {
      id: 'ombak',
      name: 'Ombak Sinapur Karang',
      meaning: 'Ombak yang memecah karang. Gambaran semangat yang tidak gampang menyerah.',
      w: 40, h: 20,
      tile: '<path fill="none" stroke="currentColor" stroke-width="2.4" d="M0 10q10-9 20 0t20 0"/><circle fill="currentColor" cx="20" cy="18" r="1.4"/>',
    },
    {
      id: 'bintang',
      name: 'Bintang Bahambur',
      meaning: 'Bintang bertaburan di langit malam. Harapan dan cita-cita yang tinggi.',
      w: 40, h: 40,
      tile: '<g fill="currentColor"><path d="M10 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"/><path d="M30 24l1.4 3.6 3.6 1.4-3.6 1.4L30 34l-1.4-3.6L25 29l3.6-1.4Z"/></g>',
    },
    {
      id: 'kambang-kacang',
      name: 'Kambang Kacang',
      meaning: 'Bunga kacang panjang. Simbol keakraban dan hubungan yang erat.',
      w: 30, h: 30,
      tile: '<g fill="currentColor" transform="translate(15 15)"><ellipse rx="2.6" ry="7"/><ellipse rx="2.6" ry="7" transform="rotate(90)"/><circle r="2" fill="none" stroke="currentColor"/></g>',
    },
    {
      id: 'hiris-gagatas',
      name: 'Hiris Gagatas',
      meaning: 'Irisan kue gagatas berbentuk belah ketupat. Lambang kebersamaan saat berbagi.',
      w: 24, h: 24,
      tile: '<path fill="none" stroke="currentColor" stroke-width="2" d="M12 3l9 9-9 9-9-9Z"/>',
    },
    {
      id: 'jajumputan',
      name: 'Jajumputan',
      meaning: 'Titik hasil kain dijumput lalu diikat sebelum dicelup. Teknik paling dasar sasirangan.',
      w: 20, h: 20,
      tile: '<g fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="10" cy="10" r="4.5"/></g><circle fill="currentColor" cx="10" cy="10" r="1.3"/>',
    },
  ];

  /** Siluet pakaian dalam viewBox 200x240. `detail` digambar sebagai garis. */
  const shapes = {
    tee: {
      body: 'M60 22 85 12q15 14 30 0l25 10 40 30-18 28-17-10v150H55V70l-17 10-18-28Z',
      detail: 'M85 12q15 22 30 0',
    },
    shirt: {
      body: 'M62 22 86 14l14 16 14-16 24 8 32 38 16 90-20 4-20-70v140H54V84l-20 70-20-4 16-90Z',
      detail: 'M86 14l14 24 14-24M100 38v186',
    },
    haori: {
      body: 'M62 20 100 34l38-14 52 22v80h-42v106H52V122H10V42Z',
      detail: 'M100 34 82 228M100 34l18 194M52 122V60M148 122V60',
    },
    pants: {
      body: 'M58 16h84l12 210h-44l-10-130-10 130H46Z',
      detail: 'M58 30h84M100 30v66',
    },
    laung: {
      body: 'M100 26 174 100 100 174 26 100Z',
      detail: 'M100 44 156 100 100 156 44 100Z',
    },
    tote: {
      body: 'M44 84h112l10 140H34Z',
      detail: 'M74 84q0-54 26-54t26 54',
    },
  };

  const categories = [
    { id: 'kaos', motif: 'gigi-haruan', name: 'Kaos', shape: 'tee', base: color.indigo, accent: color.kunyit },
    { id: 'kemeja', motif: 'kulat-kurikit', name: 'Kemeja', shape: 'shirt', base: color.washi, accent: color.kesumba },
    { id: 'outer', motif: 'ombak', name: 'Outer', shape: 'haori', base: color.river, accent: color.washi },
    { id: 'celana', motif: 'jajumputan', name: 'Celana', shape: 'pants', base: color.moss, accent: color.sand },
    { id: 'aksesoris', motif: 'bintang', name: 'Aksesoris', shape: 'laung', base: color.ulin, accent: color.kunyit },
  ];

  const products = [
    { id: 1, name: 'Kaos Jukung Oversize', category: 'kaos', shape: 'tee', motif: 'gigi-haruan', base: color.indigo, accent: color.kunyit, price: 189000, badge: 'Baru' },
    { id: 2, name: 'Kemeja Kulat Kurikit', category: 'kemeja', shape: 'shirt', motif: 'kulat-kurikit', base: color.washi, accent: color.kesumba, price: 349000 },
    { id: 3, name: 'Outer Haori Sinapur', category: 'outer', shape: 'haori', motif: 'ombak', base: color.river, accent: color.washi, price: 459000, badge: 'Terbatas' },
    { id: 4, name: 'Kulot Jajumputan', category: 'celana', shape: 'pants', motif: 'jajumputan', base: color.moss, accent: color.sand, price: 279000 },
    { id: 5, name: 'Laung Bintang Bahambur', category: 'aksesoris', shape: 'laung', motif: 'bintang', base: color.ulin, accent: color.kunyit, price: 99000 },
    { id: 6, name: 'Tote Pasar Terapung', category: 'aksesoris', shape: 'tote', motif: 'hiris-gagatas', base: color.sand, accent: color.indigo, price: 129000 },
    { id: 7, name: 'Kaos Kambang Kacang', category: 'kaos', shape: 'tee', motif: 'kambang-kacang', base: color.kesumba, accent: color.washi, price: 179000 },
    { id: 8, name: 'Kemeja Ombak Martapura', category: 'kemeja', shape: 'shirt', motif: 'ombak', base: color.indigo, accent: color.sand, price: 369000, badge: 'Baru' },
  ];

  /** Pilihan warna yang tampil sebagai titik di kartu produk. */
  const swatches = [color.indigo, color.kesumba, color.washi];

  return Object.freeze({ color, motifs, shapes, categories, products, swatches });
})();
