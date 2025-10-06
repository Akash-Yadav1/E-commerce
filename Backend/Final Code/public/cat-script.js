// ================== CAT-SCRIPT.JS ==================
document.addEventListener('DOMContentLoaded', () => {

  // ================== HEADER ==================
  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      document.body.classList.toggle('menu-open'); 
    });
  }

  const searchInput = document.getElementById('search');
  const searchBtn = document.getElementById('searchBtn');
  const suggest = document.getElementById('suggest');

  if (searchInput && searchBtn && suggest) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      if (!query) {
        suggest.classList.add('hide');
        suggest.innerHTML = '';
        return;
      }
      const products = Array.from(document.querySelectorAll('.product-card'));
      const matches = products.filter(p => p.querySelector('.product-name').textContent.toLowerCase().includes(query));
      if (matches.length) {
        suggest.innerHTML = matches.map(p => `<div class="suggest-item">${p.querySelector('.product-name').textContent}</div>`).join('');
        suggest.classList.remove('hide');
      } else {
        suggest.innerHTML = `<div class="suggest-item">No results found</div>`;
        suggest.classList.remove('hide');
      }
    });

    searchBtn.addEventListener('click', () => {
      const firstMatch = Array.from(document.querySelectorAll('.product-card'))
        .find(p => p.querySelector('.product-name').textContent.toLowerCase().includes(searchInput.value.toLowerCase()));
      if (firstMatch) {
        firstMatch.scrollIntoView({ behavior: 'smooth' });
        firstMatch.style.border = '2px solid var(--brand)';
        setTimeout(() => firstMatch.style.border = 'none', 2000);
      }
      suggest.classList.add('hide');
    });

    suggest.addEventListener('click', (e) => {
      if (e.target.classList.contains('suggest-item')) {
        searchInput.value = e.target.textContent;
        searchBtn.click();
      }
    });
  }

  // ================== SIDEBAR FILTERS ==================
  const brandCheckboxes = document.querySelectorAll('.filter-brand');
  const priceCheckboxes = document.querySelectorAll('.filter-price');
  const ratingCheckboxes = document.querySelectorAll('.filter-rating');
  const primeCheckbox = document.querySelector('.filter-prime');
  const products = Array.from(document.querySelectorAll('.product-card'));

  function filterProducts() {
    const selectedBrands = Array.from(brandCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
    const selectedPrices = Array.from(priceCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
    const selectedRatings = Array.from(ratingCheckboxes).filter(cb => cb.checked).map(cb => parseInt(cb.value));
    const primeOnly = primeCheckbox?.checked || false;

    products.forEach(prod => {
      const brand = prod.getAttribute('data-brand');
      const price = parseFloat(prod.getAttribute('data-price'));
      const rating = parseInt(prod.getAttribute('data-rating'));
      const isPrime = prod.getAttribute('data-prime') === 'true';
      let show = true;

      if (selectedBrands.length && !selectedBrands.includes(brand)) show = false;
      if (selectedPrices.length) {
        const match = selectedPrices.some(range => {
          const [min, max] = range.split('-').map(Number);
          return price >= min && price <= max;
        });
        if (!match) show = false;
      }
      if (selectedRatings.length) {
        const match = selectedRatings.some(r => rating >= r);
        if (!match) show = false;
      }
      if (primeOnly && !isPrime) show = false;

      prod.style.display = show ? 'block' : 'none';
    });
  }

  brandCheckboxes.forEach(cb => cb.addEventListener('change', filterProducts));
  priceCheckboxes.forEach(cb => cb.addEventListener('change', filterProducts));
  ratingCheckboxes.forEach(cb => cb.addEventListener('change', filterProducts));
  primeCheckbox?.addEventListener('change', filterProducts);

  // ================== FOOTER YEAR ==================
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ================== STICKY HEADER SHADOW ==================
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) header.style.boxShadow = '0 6px 20px rgba(0,0,0,0.5)';
      else header.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
    });
  }

  // ================== CART LOGIC ==================
  function cart() {
    const cartBtn = document.getElementById('cartBtn');
    const drawer = document.getElementById('cartDrawer');
    const scrim = document.getElementById('drawerScrim');
    const close = document.getElementById('closeCart');
    const itemsEl = document.getElementById('cartItems');
    const countEl = document.getElementById('cartCount');
    const curSel = document.getElementById('currency');

    if (!cartBtn || !itemsEl || !countEl) return;

    let cart = JSON.parse(localStorage.getItem('gm_cart') || '[]');

    const open = () => { drawer?.classList.add('show'); document.body.classList.add('menu-open'); render(); };
    const shut = () => { drawer?.classList.remove('show'); document.body.classList.remove('menu-open'); };

    cartBtn.addEventListener('click', open);
    scrim?.addEventListener('click', shut);
    close?.addEventListener('click', shut);

    async function render() {
      countEl.textContent = cart.reduce((a, c) => a + c.qty, 0);
      itemsEl.innerHTML = '';

      if (!cart.length) {
        itemsEl.innerHTML = '<div class="muted">Your cart is empty.</div>';
        updateSubtotal();
        return;
      }

      const currency = curSel?.value || 'USD';

      for (let c of cart) {
        const { value: priceConv, symbol } = await convertPrice(c.price, currency);
        const row = document.createElement('div');
        row.style.display = 'grid';
        row.style.gridTemplateColumns = '64px 1fr auto';
        row.style.gap = '.6rem';
        row.style.alignItems = 'center';
        row.innerHTML = `
          <img src="${c.img}" alt="${c.title}" style="width:64px;height:64px;object-fit:cover;border-radius:10px">
          <div>
            <div style="font-weight:600">${c.title}</div>
            <div class="tag">${symbol}${priceConv.toFixed(2)}</div>
            <div style="display:flex;gap:.4rem;align-items:center;margin-top:.2rem">
              <button class="btn ghost" data-dec="${c.id}">-</button>
              <span>${c.qty}</span>
              <button class="btn ghost" data-inc="${c.id}">+</button>
              <button class="btn ghost" data-rem="${c.id}">Remove</button>
            </div>
          </div>
          <div style="font-weight:700">${symbol}${(priceConv * c.qty).toFixed(2)}</div>
        `;
        itemsEl.appendChild(row);
      }

      updateSubtotal();
    }

    async function updateSubtotal() {
      const currency = curSel?.value || 'USD';
      const totalUSD = cart.reduce((a, c) => a + c.qty * Number(c.price), 0);
      const { value, symbol } = await convertPrice(totalUSD, currency);
      const subtotalEl = document.getElementById('subtotal');
      if (subtotalEl) subtotalEl.textContent = `${symbol}${value.toFixed(2)}`;
    }

    window.updateSubtotal = updateSubtotal;

    function saveCart(data) {
      localStorage.setItem('gm_cart', JSON.stringify(data));
    }

    function updateCount() {
      countEl.textContent = cart.reduce((a, c) => a + c.qty, 0);
    }

    document.body.addEventListener('click', async e => {
      const add = e.target.closest('[data-add]');
      const dec = e.target.closest('[data-dec]');
      const inc = e.target.closest('[data-inc]');
      const rem = e.target.closest('[data-rem]');

      // ===== ADD TO CART =====
      if (add) {
        let card = add.closest('.product-card');
        let id = add.dataset.add || (card?.dataset.id || Math.random().toString(36).substr(2, 9));
        let title, price, img;

        if (card) {
          title = card.dataset.title || card.querySelector('.product-name')?.textContent.trim();
          price = Number(card.dataset.price || card.querySelector('.product-price')?.textContent.replace(/[^0-9.]/g, ''));
          img = card.dataset.img || card.querySelector('img')?.src;
        } else {
          // product page fallback
          const details = document.querySelector('.product-details');
          const gallery = document.querySelector('.product-gallery img');
          title = details?.querySelector('h1')?.textContent.trim() || 'Unknown Product';
          price = Number(details?.querySelector('.price')?.textContent.replace(/[^0-9.]/g, '')) || 0;
          img = gallery?.src || '';
        }

        const found = cart.find(x => x.id === id);
        if (found) found.qty++;
        else cart.push({ id, title, price, img, qty: 1 });

        saveCart(cart);
        updateCount();
        updateSubtotal();
        render();

        add.textContent = 'Added ✓';
        setTimeout(() => add.textContent = 'Add to Cart', 800);
      }

      // ===== DECREASE =====
      if (dec) {
        const id = dec.dataset.dec;
        const it = cart.find(x => x.id === id);
        if (it) {
          it.qty--;
          if (it.qty <= 0) cart = cart.filter(x => x.id !== id);
          saveCart(cart);
          updateCount();
          updateSubtotal();
          render();
        }
      }

      // ===== INCREASE =====
      if (inc) {
        const id = inc.dataset.inc;
        const it = cart.find(x => x.id === id);
        if (it) {
          it.qty++;
          saveCart(cart);
          updateCount();
          updateSubtotal();
          render();
        }
      }

      // ===== REMOVE ITEM =====
      if (rem) {
        const id = rem.dataset.rem;
        cart = cart.filter(x => x.id !== id);
        saveCart(cart);
        updateCount();
        updateSubtotal();
        render();
      }
    });

    render();

    // Re-render when currency changes
    curSel?.addEventListener('change', render);
  }

  // ================== CURRENCY CONVERSION ==================
  const RATE_CACHE = { USD: 1 };
  const CURR_SYMBOL = { USD: '$', EUR: '€', GBP: '£', INR: '₹', AUD: 'A$', CAD: 'C$', JPY: '¥' };

  async function convertPrice(amount, currency) {
    if (!RATE_CACHE[currency]) {
      try {
        const res = await fetch(`https://api.frankfurter.app/latest?amount=1&from=USD&to=${currency}`);
        const data = await res.json();
        RATE_CACHE[currency] = data.rates[currency];
      } catch (err) {
        console.error("Currency conversion failed:", err.message);
        RATE_CACHE[currency] = 1;
      }
    }
    const rate = RATE_CACHE[currency] || 1;
    return { value: amount * rate, symbol: CURR_SYMBOL[currency] || '$' };
  }

  async function repriceProducts() {
  const currency = document.getElementById('currency')?.value || 'USD';
  const priceEls = document.querySelectorAll('[data-price]');
  const oldEls = document.querySelectorAll('[data-old]');

  for (let el of priceEls) {
    const usd = parseFloat(el.dataset.price);
    const { value, symbol } = await convertPrice(usd, currency);
    el.textContent = `${symbol}${value.toFixed(2)}`;
  }

  for (let el of oldEls) {
    const usd = parseFloat(el.dataset.old);
    const { value, symbol } = await convertPrice(usd, currency);
    el.textContent = `${symbol}${value.toFixed(2)}`;
  }

  if (window.updateSubtotal) window.updateSubtotal();
}

// Trigger re-pricing on currency change
document.getElementById('currency')?.addEventListener('change', repriceProducts);
async function repriceProducts() {
  const currency = document.getElementById('currency')?.value || 'USD';

  document.querySelectorAll('[data-price]').forEach(async el => {
    const usd = parseFloat(el.dataset.price);
    const { value, symbol } = await convertPrice(usd, currency);
    el.textContent = `${symbol}${value.toFixed(2)}`;
  });

  document.querySelectorAll('[data-old]').forEach(async el => {
    const usd = parseFloat(el.dataset.old);
    const { value, symbol } = await convertPrice(usd, currency);
    el.textContent = `${symbol}${value.toFixed(2)}`;
  });

  if (window.updateSubtotal) window.updateSubtotal();
}


  function wireCurrency() {
    const curSel = document.getElementById('currency');
    if (!curSel) return;
    curSel.addEventListener('change', repriceProducts);
    repriceProducts();
  }

  // ================== INIT CART & CURRENCY ==================
  cart();
  wireCurrency();

});
