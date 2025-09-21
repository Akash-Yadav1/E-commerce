
// Promo banner slider with pause on hover
function promoBanner() {
  const root = document.getElementById("promoSlides");
  if (!root) return;
  const slides = root.querySelectorAll(".promo-slide");
  let i = 0, timer;

  function showNext() {
    slides[i].classList.remove("active");
    i = (i + 1) % slides.length;
    slides[i].classList.add("active");
  }

  function start() { timer = setInterval(showNext, 5000); }
  function stop() { clearInterval(timer); }

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);

  start();
}
let heroTimer;  // global variable

function heroCarousel() {
  const root = document.getElementById('heroCarousel');
  if (!root) return;

  const slides = root.querySelectorAll('.slide');
  const dotsWrap = root.querySelector('.dots');
  if (!dotsWrap) return;

  let i = 0;

  function setSlide(idx) {
    i = (idx + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('active', k === i));
    dotsWrap.querySelectorAll('.dot').forEach((d, k) => d.classList.toggle('active', k === i));
  }

  function next() { setSlide(i + 1); }

  function resetTimer() {
    clearInterval(heroTimer); // clear old timer
    heroTimer = setInterval(next, 4500);
  }

  setSlide(0);
  resetTimer();

  root.addEventListener('mouseenter', () => clearInterval(heroTimer));
  root.addEventListener('mouseleave', resetTimer);
}



// 3D tilt on hero card
function tiltCard() {
  const card = document.getElementById("tilt");
  if (!card) return;
  const limit = 10;

  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width * 2 - 1;
    const y = (e.clientY - r.top) / r.height * 2 - 1;
    card.style.transform = `rotateY(${x * limit}deg) rotateX(${-y * limit}deg)`;
  });
  card.addEventListener("mouseleave", () => card.style.transform = "rotateX(0deg) rotateY(0deg)");
}

// Scroll reveal
function revealOnScroll() {
  const io = new IntersectionObserver((ents) => {
    ents.forEach(ent => {
      if (ent.isIntersecting) {
        ent.target.classList.add('show');
        io.unobserve(ent.target);
      }
    });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

// Mobile menu
function mobileMenu() {
  const burger = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  const scrim = document.getElementById('mobileScrim');
  const close = document.getElementById('closeMobile');
  if (!burger || !menu) return;

  const open = () => { burger.classList.add('active'); menu.classList.add('show'); document.body.classList.add('menu-open'); };
  const shut = () => { burger.classList.remove('active'); menu.classList.remove('show'); document.body.classList.remove('menu-open'); };

  burger.addEventListener('click', () => menu.classList.contains('show') ? shut() : open());
  scrim?.addEventListener('click', shut);
  close?.addEventListener('click', shut);
}

// Back to top
function toTop() {
  const btn = document.getElementById('toTop');
  if (!btn) return; // <-- this prevents errors if element is missing

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}



function setupCart() {
  const buttons = document.querySelectorAll(".add-cart");
  const userId = "guest"; // Later replace with logged-in user ID

  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const product = {
        userId,
        productId: btn.dataset.id,
        title: btn.dataset.title,
        price: btn.dataset.price,
        img: btn.dataset.img,
      };

      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        });
        const data = await res.json();
        console.log("Cart updated:", data);

        // Update cart counter
        const count = data.items.reduce((sum, i) => sum + i.qty, 0);
        const cartCount = document.getElementById("cartCount");
        if (cartCount) cartCount.textContent = count;
      } catch (err) {
        console.error("Error adding to cart:", err);
      }
    });
  });
}

// Row arrows
function wireArrows() {
  document.querySelectorAll('.arrow').forEach(btn => {
    const rowId = btn.dataset.row;
    const row = document.getElementById(rowId);
    btn.addEventListener('click', () => {
      const by = (btn.classList.contains('next') ? 1 : -1) * (row.clientWidth * .85);
      row.scrollBy({ left: by, behavior: 'smooth' });
    });
  });
}
function initArrows() { wireArrows(); }







// --- State & dummy data -------------------------------------------------
const CURR_SYMBOL = { USD: '$', EUR: '€', GBP: '£', INR: '₹' };

const DUMMY_PRODUCTS = Array.from({ length: 24 }).map((_, i) => ({
  id: 'p' + (i + 1),
  title: [
    'Noise-Cancelling Headphones',
    '4K Action Camera',
    'Smart Air Fryer 5L',
    'Mechanical Keyboard RGB',
    'Wireless Charger Pad',
    'Smartwatch Pro X',
    'Portable Bluetooth Speaker',
    'Fitness Tracker Band',
    'Robot Vacuum Cleaner',
    'Gaming Mouse 8K',
    'Ultra Slim Laptop 14"',
    'Mirrorless Camera Lens 35mm',
  ][i % 12] + ' #' + (i + 1),
  price: (Math.random() * 200 + 39).toFixed(2),
  old: (Math.random() * 260 + 99).toFixed(2),
  rating: (Math.random() * 2 + 3).toFixed(1),
  img: `https://picsum.photos/seed/prod${i}/480/480`
}));

// Cart state in localStorage
const CART_KEY = 'gm_cart';
const loadCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');
const saveCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));

// --- Helpers ------------------------------------------------------------
const fmt = (n, cur) => `${CURR_SYMBOL[cur] || '$'}${Number(n).toFixed(2)}`;
const setYear = () => document.getElementById('year').textContent = new Date().getFullYear();



// Create a product card element
function productCard(p) {
  const el = document.createElement('div');
  el.className = 'prod-card';
  el.innerHTML = `
        <div class="thumb"><img src="${p.img}" alt="${p.title}" loading="lazy"></div>
        <div class="title" title="${p.title}">${p.title}</div>
        <div class="stars">${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5 - Math.round(p.rating))} <span class="tag">(${p.rating})</span></div>
        <div class="price-row">
          <div class="price" data-price="${p.price}">$${p.price}</div>
          <div class="old" data-old="${p.old}">$${p.old}</div>
        </div>
        <div class="card-actions">
          <button class="btn" data-add="${p.id}">Add to Cart</button>
          <button class="btn ghost" onclick="alert('Wishlisted!')">♡</button>
        </div>`;
  return el;
}

// Populate rows
function mountRow(rowId, startIdx) {
  const row = document.getElementById(rowId);
  row.innerHTML = '';
  DUMMY_PRODUCTS.slice(startIdx, startIdx + 10).forEach(p => row.appendChild(productCard(p)));
}

// Row arrows
function wireArrows() {
  document.querySelectorAll('.arrow').forEach(btn => {
    const rowId = btn.dataset.row;
    const row = document.getElementById(rowId);
    btn.addEventListener('click', () => {
      const by = (btn.classList.contains('next') ? 1 : -1) * (row.clientWidth * .85);
      row.scrollBy({ left: by, behavior: 'smooth' });
    });
  });
}

// Currency switching (format only)
function wireCurrency() {
  const curSel = document.getElementById('currency');
  const reprice = () => {
    document.querySelectorAll('[data-price]').forEach(el => {
      el.textContent = fmt(el.dataset.price, curSel.value);
    });
    document.querySelectorAll('[data-old]').forEach(el => {
      el.textContent = fmt(el.dataset.old, curSel.value);
    });
    // subtotal too
    updateSubtotal();
  };
  curSel.addEventListener('change', reprice);
  reprice();
}

// Search suggestions (dummy)
function wireSearch() {
  const input = document.getElementById('search');
  const box = document.getElementById('suggest');
  const SUGGEST = ['iPhone 16 Pro', 'Galaxy Fold', 'Air Fryer', 'Robot Vacuum', 'RTX 5090', 'Noise Cancelling', 'Sneakers', 'Espresso Machine', 'Camping Tent'];
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { box.classList.add('hide'); return; }
    const res = SUGGEST.filter(s => s.toLowerCase().includes(q)).slice(0, 6);
    if (res.length) {
      box.innerHTML = res.map(r => `<a href="#">${r}</a>`).join('');
      box.classList.remove('hide');
    } else box.classList.add('hide');
  });
  document.addEventListener('click', e => { if (!e.target.closest('.search')) box.classList.add('hide'); });
  document.getElementById('searchBtn').addEventListener('click', () => {
    alert('Search coming soon!');
  });
}



// Mobile menu
function mobileMenu() {
  const burger = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  const scrim = document.getElementById('mobileScrim');
  const close = document.getElementById('closeMobile');
  const open = () => { burger.classList.add('active'); menu.classList.add('show'); document.body.classList.add('menu-open'); };
  const shut = () => { burger.classList.remove('active'); menu.classList.remove('show'); document.body.classList.remove('menu-open'); };
  burger.addEventListener('click', () => menu.classList.contains('show') ? shut() : open());
  scrim.addEventListener('click', shut); close.addEventListener('click', shut);
}

// Prevent body shift when menu open
(function () { const css = document.createElement('style'); css.innerHTML = 'body.menu-open{overflow:hidden}'; document.head.appendChild(css); })();




// Cart drawer
function cart() {
  const cartBtn = document.getElementById('cartBtn');
  const drawer = document.getElementById('cartDrawer');
  const scrim = document.getElementById('drawerScrim');
  const close = document.getElementById('closeCart');
  const itemsEl = document.getElementById('cartItems');
  const countEl = document.getElementById('cartCount');
  const subtotalEl = document.getElementById('subtotal');
  const curSel = document.getElementById('currency');

  let cart = loadCart();

  const open = () => { drawer.classList.add('show'); document.body.classList.add('menu-open'); render(); };
  const shut = () => { drawer.classList.remove('show'); document.body.classList.remove('menu-open'); };
  cartBtn.addEventListener('click', open); scrim.addEventListener('click', shut); close.addEventListener('click', shut);

  function render() {
    countEl.textContent = cart.reduce((a, c) => a + c.qty, 0);
    itemsEl.innerHTML = '';
    if (!cart.length) { itemsEl.innerHTML = '<div class="muted">Your cart is empty.</div>'; }
    cart.forEach(c => {
      const row = document.createElement('div');
      row.style.display = 'grid';
      row.style.gridTemplateColumns = '64px 1fr auto';
      row.style.gap = '.6rem';
      row.style.alignItems = 'center';
      row.innerHTML = `
            <img src="${c.img}" alt="${c.title}" style="width:64px;height:64px;object-fit:cover;border-radius:10px">
            <div>
              <div style="font-weight:600">${c.title}</div>
              <div class="tag">${fmt(c.price, curSel.value)}</div>
              <div style="display:flex;gap:.4rem;align-items:center;margin-top:.2rem">
                <button class="btn ghost" data-dec="${c.id}">-</button>
                <span>${c.qty}</span>
                <button class="btn ghost" data-inc="${c.id}">+</button>
                <button class="btn ghost" data-rem="${c.id}">Remove</button>
              </div>
            </div>
            <div style="font-weight:700">${fmt(c.price * c.qty, curSel.value)}</div>`;
      itemsEl.appendChild(row);
    });
    updateSubtotal();
  }

  function updateCount() {
    countEl.textContent = cart.reduce((a, c) => a + c.qty, 0);
  }

  function updateSubtotal() {
    const cur = document.getElementById('currency').value;
    const sub = cart.reduce((a, c) => a + c.qty * Number(c.price), 0);
    document.getElementById('subtotal').textContent = fmt(sub, cur);
  }
  window.updateSubtotal = updateSubtotal; // used by currency change

  // row events
  document.body.addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (add) {
      const id = add.getAttribute('data-add');
      const p = DUMMY_PRODUCTS.find(x => x.id === id) || DUMMY_PRODUCTS[0];
      const found = cart.find(x => x.id === id);
      if (found) found.qty++; else cart.push({ id: p.id, title: p.title, price: Number(p.price), img: p.img, qty: 1 });
      saveCart(cart); updateCount();
      // tiny feedback
      add.textContent = 'Added ✓'; setTimeout(() => add.textContent = 'Add to Cart', 800);
    }
    const dec = e.target.closest('[data-dec]');
    if (dec) { const id = dec.getAttribute('data-dec'); const it = cart.find(x => x.id === id); if (it) { it.qty--; if (it.qty <= 0) cart = cart.filter(x => x.id !== id); saveCart(cart); render(); } }
    const inc = e.target.closest('[data-inc]');
    if (inc) { const id = inc.getAttribute('data-inc'); const it = cart.find(x => x.id === id); if (it) { it.qty++; saveCart(cart); render(); } }
    const rem = e.target.closest('[data-rem]');
    if (rem) { const id = rem.getAttribute('data-rem'); cart = cart.filter(x => x.id !== id); saveCart(cart); render(); }
  });

  // expose for subtotal currency re-render
  window.__cart_render = () => { cart = loadCart(); render(); };

  // initial
  updateCount();
}

// Mount products into rows
function mountProducts() {
  mountRow('dealsRow', 0);
  mountRow('bestRow', 6);
  mountRow('newRow', 12);
}

// Wire arrows after mounting
function initArrows() { wireArrows(); }


// Center product rows on load
function centerRows() {
  document.querySelectorAll('.prod-row').forEach(row => {
    row.scrollLeft = (row.scrollWidth - row.clientWidth) / 2;
  });
}

// Animate on scroll
function animateOnScroll() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('show');
        io.unobserve(e.target);
      }
    });
  }, { threshold: .2 });
  document.querySelectorAll('.prod-card, .cat-card, .banner, .ribbon, .newsletter').forEach(el => io.observe(el));
}


setYear();
document.addEventListener('DOMContentLoaded', () => {
  mountProducts();
  heroCarousel();
  mountRow('trendRow', 18);
  mountRow('recRow', 12);
  initArrows();
  cart();
  wireCurrency();
  wireSearch();
  tiltCard();
  revealOnScroll();
  mobileMenu();
  centerRows();
  animateOnScroll();
  toTop();
  promoBanner();
});

// Accessibility: close drawers/menus with ESC
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.getElementById('cartDrawer').classList.remove('show');
    document.getElementById('mobileMenu').classList.remove('show');
    document.body.classList.remove('menu-open');
    document.getElementById('hamburger').classList.remove('active');
  }
});
