(() => {
  'use strict';

  const { motifs, shapes, categories, products, swatches } = window.NEOSKARA;
  const motifById = Object.fromEntries(motifs.map((m) => [m.id, m]));
  const $ = (selector, root = document) => root.querySelector(selector);

  const rupiah = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  });

  const escapeHtml = (value) =>
    String(value).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);

  /* ---------- SVG builder ---------- */

  let uid = 0;

  /** Pattern SVG dari tile motif, diwarnai dengan `accent`. */
  function patternDef(motif, accent, scale = 1) {
    const id = `p-${motif.id}-${++uid}`;
    const def = `<pattern id="${id}" width="${motif.w}" height="${motif.h}" patternUnits="userSpaceOnUse" patternTransform="scale(${scale})"><g style="color:${accent}">${motif.tile}</g></pattern>`;
    return { id, def };
  }

  /** Siluet pakaian berisi motif sasirangan. */
  function garmentSvg({ shape, motif, base, accent }) {
    const s = shapes[shape];
    const pattern = patternDef(motifById[motif], accent, 0.9);
    return `
      <svg class="garment" viewBox="0 0 200 240" aria-hidden="true" focusable="false">
        <defs>${pattern.def}</defs>
        <path d="${s.body}" fill="${base}"/>
        <path d="${s.body}" fill="url(#${pattern.id})" opacity=".9"/>
        <path d="${s.detail}" fill="none" stroke="${base}" stroke-width="3" stroke-linecap="round" opacity=".9"/>
      </svg>`;
  }

  /** Kotak penuh motif, dipakai di bagian "Kenali motifnya". */
  function swatchSvg(motif, base, accent) {
    const pattern = patternDef(motif, accent, 1.4);
    return `
      <svg viewBox="0 0 160 160" aria-hidden="true" focusable="false">
        <defs>${pattern.def}</defs>
        <rect width="160" height="160" fill="${base}"/>
        <rect width="160" height="160" fill="url(#${pattern.id})"/>
      </svg>`;
  }

  /* ---------- Render ---------- */

  function renderCategories() {
    const list = $('[data-categories]');
    if (!list) return;
    list.innerHTML = categories
      .map((c) => {
        const count = products.filter((p) => p.category === c.id).length;
        return `
          <li>
            <a class="category-card" href="#baru" data-goto-category="${c.id}">
              <span class="category-visual">${garmentSvg(c)}</span>
              <span class="category-name">${escapeHtml(c.name)}</span>
              <span class="category-count">${count} produk</span>
            </a>
          </li>`;
      })
      .join('');
  }

  function renderFilters(active) {
    const bar = $('[data-filters]');
    if (!bar) return;
    const options = [{ id: 'semua', name: 'Semua' }, ...categories];
    bar.innerHTML = options
      .map(
        (o) =>
          `<button type="button" class="chip" data-filter="${o.id}" aria-pressed="${o.id === active}">${escapeHtml(o.name)}</button>`
      )
      .join('');
  }

  function renderProducts(filter = 'semua') {
    const grid = $('[data-products]');
    if (!grid) return;
    const items = filter === 'semua' ? products : products.filter((p) => p.category === filter);
    grid.innerHTML = items
      .map(
        (p) => `
        <li class="product-card">
          <div class="product-media" style="--card-tint:${p.base}">
            ${p.badge ? `<span class="badge">${escapeHtml(p.badge)}</span>` : ''}
            ${garmentSvg(p)}
            <button type="button" class="quick-add" data-add="${p.id}">Tambah ke keranjang</button>
          </div>
          <div class="product-info">
            <p class="product-motif">${escapeHtml(motifById[p.motif].name)}</p>
            <h3 class="product-name">${escapeHtml(p.name)}</h3>
            <p class="product-price">${rupiah.format(p.price)}</p>
            <ul class="swatches" aria-label="Pilihan warna">
              ${swatches.map((c) => `<li style="--swatch:${c}"></li>`).join('')}
            </ul>
          </div>
        </li>`
      )
      .join('');
  }

  function renderMotifs() {
    const list = $('[data-motifs]');
    if (!list) return;
    const pairs = [
      ['#1f2a44', '#e2a93b'],
      ['#b3262d', '#f6efe3'],
      ['#2f5d73', '#e8dcc4'],
      ['#6b1f2a', '#e2a93b'],
      ['#3d4a3a', '#f6efe3'],
      ['#e8dcc4', '#1f2a44'],
      ['#f6efe3', '#b3262d'],
    ];
    list.innerHTML = motifs
      .map((m, i) => {
        const [base, accent] = pairs[i % pairs.length];
        return `
          <li class="motif-card">
            <div class="motif-swatch">${swatchSvg(m, base, accent)}</div>
            <h3>${escapeHtml(m.name)}</h3>
            <p>${escapeHtml(m.meaning)}</p>
          </li>`;
      })
      .join('');
  }

  /* ---------- Keranjang (simulasi) ---------- */

  const CART_KEY = 'neoskara.cart';

  const cart = {
    read() {
      try {
        return JSON.parse(localStorage.getItem(CART_KEY)) ?? [];
      } catch {
        return [];
      }
    },
    write(items) {
      try {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
      } catch {
        /* Penyimpanan diblokir: keranjang tetap jalan selama halaman terbuka. */
      }
    },
  };

  let cartItems = cart.read();

  function updateCartCount() {
    const el = $('[data-cart-count]');
    if (!el) return;
    el.textContent = String(cartItems.length);
    el.hidden = cartItems.length === 0;
  }

  let toastTimer;
  function toast(message) {
    const el = $('[data-toast]');
    if (!el) return;
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2600);
  }

  function addToCart(id) {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    cartItems = [...cartItems, id];
    cart.write(cartItems);
    updateCartCount();
    toast(`${product.name} masuk keranjang. Ayuha, lanjut belanja!`);
  }

  /* ---------- Interaksi ---------- */

  function setFilter(id) {
    renderFilters(id);
    renderProducts(id);
  }

  function bindEvents() {
    document.addEventListener('click', (event) => {
      const filterBtn = event.target.closest('[data-filter]');
      if (filterBtn) {
        setFilter(filterBtn.dataset.filter);
        return;
      }

      const addBtn = event.target.closest('[data-add]');
      if (addBtn) {
        addToCart(Number(addBtn.dataset.add));
        return;
      }

      const categoryLink = event.target.closest('[data-goto-category]');
      if (categoryLink) {
        setFilter(categoryLink.dataset.gotoCategory);
        return;
      }

      if (event.target.closest('[data-cart-btn]')) {
        toast(cartItems.length ? `Ada ${cartItems.length} barang di keranjang pian.` : 'Keranjang masih kosong.');
      }
    });

    const navToggle = $('[data-nav-toggle]');
    const nav = $('[data-nav]');
    if (navToggle && nav) {
      const setOpen = (open) => {
        navToggle.setAttribute('aria-expanded', String(open));
        navToggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
        document.body.classList.toggle('nav-open', open);
      };
      navToggle.addEventListener('click', () => setOpen(navToggle.getAttribute('aria-expanded') !== 'true'));
      nav.addEventListener('click', (e) => e.target.closest('a') && setOpen(false));
      document.addEventListener('keydown', (e) => e.key === 'Escape' && setOpen(false));
    }

    const form = $('[data-newsletter]');
    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const input = form.elements.email;
        const msg = $('[data-form-msg]', form);
        if (!input.checkValidity()) {
          msg.textContent = 'Email belum benar, coba dicek lagi.';
          msg.dataset.state = 'error';
          input.focus();
          return;
        }
        msg.textContent = 'Makasih banar! Kabar terbaru akan kami kirim ke email pian.';
        msg.dataset.state = 'ok';
        form.reset();
      });
    }

    const header = $('[data-header]');
    if (header) {
      const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }

  /** Gandakan isi marquee supaya animasinya bersambung tanpa jeda. */
  function setupMarquee() {
    const track = $('[data-marquee]');
    if (!track) return;
    const clone = track.innerHTML;
    track.insertAdjacentHTML('beforeend', clone.replace(/<span>/g, '<span aria-hidden="true">'));
  }

  function setupReveal() {
    const targets = document.querySelectorAll('.section-head, .category-card, .product-card, .motif-card, .values li, .feature-copy');
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px' }
    );
    targets.forEach((el) => {
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  renderCategories();
  setFilter('semua');
  renderMotifs();
  updateCartCount();
  setupMarquee();
  bindEvents();
  setupReveal();
})();
