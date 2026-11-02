(() => {
  'use strict';

  const { categories, products } = window.NEOSKARA;
  const $ = (selector, root = document) => root.querySelector(selector);

  const rupiah = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  });

  const escapeHtml = (value) =>
    String(value).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);

  /* ---------- Grafik kaos (untuk produk tanpa foto) ---------- */

  const TEE_PATH = 'M60 22 85 12q15 14 30 0l25 10 40 30-18 28-17-10v150H55V70l-17 10-18-28Z';
  const NECK_PATH = 'M85 12q15 22 30 0';

  /**
   * Siluet kaos oversize. `print` = teks sablon di dada (serif),
   * `number` = nomor punggung gaya jersey.
   */
  function teeSvg({ base, print = '', number = '', trim = '' }) {
    const printText = print
      ? `<text x="100" y="92" text-anchor="middle" class="tee-print">${escapeHtml(print)}</text>`
      : '';
    const numberText = number
      ? `<text x="76" y="96" text-anchor="middle" class="tee-number" fill="${trim}">${escapeHtml(number)}</text>
         <circle cx="124" cy="88" r="9" fill="none" stroke="${trim}" stroke-width="2"/>
         <path d="M38 80 20 52M162 80l18-28" stroke="${trim}" stroke-width="4"/>`
      : '';
    return `
      <svg class="tee" viewBox="0 0 200 240" aria-hidden="true" focusable="false">
        <path d="${TEE_PATH}" fill="${base}"/>
        <path d="${NECK_PATH}" fill="none" stroke="rgb(255 255 255 / .14)" stroke-width="2"/>
        ${printText}${numberText}
      </svg>`;
  }

  /* ---------- Render ---------- */

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

  function productMedia(p) {
    if (p.image) {
      const hover = p.hoverImage
        ? `<img class="hover-img" src="${p.hoverImage}" alt="${escapeHtml(p.hoverAlt)}" loading="lazy">`
        : '';
      return `<img src="${p.image}" alt="${escapeHtml(p.alt)}" width="720" height="900" loading="lazy">${hover}`;
    }
    return `<div class="product-art product-art--${p.art.bg}">${teeSvg(p.art)}</div>`;
  }

  function renderProducts(filter = 'semua') {
    const grid = $('[data-products]');
    if (!grid) return;
    const items = filter === 'semua' ? products : products.filter((p) => p.category === filter);
    grid.innerHTML = items
      .map(
        (p) => `
        <li class="product-card">
          <div class="product-media">
            ${p.badge ? `<span class="badge">${escapeHtml(p.badge)}</span>` : ''}
            ${productMedia(p)}
            <button type="button" class="quick-add" data-add="${p.id}">+ Keranjang</button>
          </div>
          <div class="product-info">
            <h3 class="product-name">${escapeHtml(p.name)}</h3>
            <p class="product-meta">${escapeHtml(p.color)}</p>
            <p class="product-price">${rupiah.format(p.price)}</p>
          </div>
        </li>`
      )
      .join('');
  }

  function renderStaticArt() {
    const jersey = $('[data-jersey]');
    if (jersey) {
      jersey.innerHTML = teeSvg({ base: '#1e2a47', number: '10', trim: '#d8b04c' });
    }
  }

  /* ---------- Keranjang (simulasi) ---------- */

  const CART_KEY = 'neoskara.cart';

  const cartStore = {
    read() {
      try {
        const items = JSON.parse(localStorage.getItem(CART_KEY));
        return Array.isArray(items) ? items : [];
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

  let cartItems = cartStore.read();

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
    cartStore.write(cartItems);
    updateCartCount();
    toast(`${product.name} masuk keranjang.`);
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
        toast(cartItems.length ? `Ada ${cartItems.length} barang di keranjang.` : 'Keranjang masih kosong.');
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
        msg.textContent = 'Makasih! Kabar rilis berikutnya akan kami kirim ke email pian.';
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
    if (track) track.insertAdjacentHTML('beforeend', track.innerHTML);
  }

  function setupReveal() {
    if (!('IntersectionObserver' in window)) return;
    const targets = document.querySelectorAll('.section-head, .product-card, .campaign-copy, .neofc-grid > *, .about-statement, .about-points li');
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

  setFilter('semua');
  renderStaticArt();
  updateCartCount();
  setupMarquee();
  bindEvents();
  setupReveal();
})();
