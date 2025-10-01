 // ================== HEADER ==================
        // Hamburger toggle for mobile
        const hamburger = document.getElementById('hamburger');
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            document.body.classList.toggle('menu-open'); // optional if you want body scroll lock
        });

        // Search bar functionality
        const searchInput = document.getElementById('search');
        const searchBtn = document.getElementById('searchBtn');
        const suggest = document.getElementById('suggest');

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

        // Click suggestion
        suggest.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggest-item')) {
                searchInput.value = e.target.textContent;
                searchBtn.click();
            }
        });

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
            const primeOnly = primeCheckbox.checked;

            products.forEach(prod => {
                const brand = prod.getAttribute('data-brand');
                const price = parseFloat(prod.getAttribute('data-price'));
                const rating = parseInt(prod.getAttribute('data-rating'));
                const isPrime = prod.getAttribute('data-prime') === 'true';
                let show = true;

                if (selectedBrands.length && !selectedBrands.includes(brand)) show = false;
                if (selectedPrices.length) {
                    let match = selectedPrices.some(range => {
                        const [min, max] = range.split('-').map(Number);
                        return price >= min && price <= max;
                    });
                    if (!match) show = false;
                }
                if (selectedRatings.length) {
                    let match = selectedRatings.some(r => rating >= r);
                    if (!match) show = false;
                }
                if (primeOnly && !isPrime) show = false;

                prod.style.display = show ? 'block' : 'none';
            });
        }

        brandCheckboxes.forEach(cb => cb.addEventListener('change', filterProducts));
        priceCheckboxes.forEach(cb => cb.addEventListener('change', filterProducts));
        ratingCheckboxes.forEach(cb => cb.addEventListener('change', filterProducts));
        primeCheckbox.addEventListener('change', filterProducts);


        // ================== CURRENCY & SHIP TO ==================
        document.getElementById('currency').addEventListener('change', (e) => {
            console.log('Currency changed to:', e.target.value);
            // Implement your currency conversion logic here
        });

        document.getElementById('shipto').addEventListener('change', (e) => {
            console.log('Shipping to:', e.target.value);
            // Implement shipping logic here
        });

        // ================== FOOTER YEAR ==================
        document.getElementById('year').textContent = new Date().getFullYear();

        // ================== OPTIONAL: Sticky Header Shadow ==================
        const header = document.querySelector('header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) header.style.boxShadow = '0 6px 20px rgba(0,0,0,0.5)';
            else header.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
        });
        // ===== CART LOGIC =====
        let cart = [];
        const cartDropdown = document.getElementById('cartDropdown');
        const cartItemsContainer = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const cartBtn = document.getElementById('cartBtn');
        const checkoutBtn = document.getElementById('checkoutBtn');
        const cartCount = document.getElementById('cartCount');

        // Show/hide cart dropdown
        cartBtn.addEventListener('click', () => {
            cartDropdown.classList.toggle('hide');
        });

        // Close cart when clicking outside
        document.addEventListener('click', (e) => {
            if (!cartDropdown.contains(e.target) && !cartBtn.contains(e.target)) {
                cartDropdown.classList.add('hide');
            }
        });

        // Add product to cart
        function addToCart(productCard) {
            const name = productCard.querySelector('.product-name').textContent;
            const price = parseFloat(productCard.querySelector('.product-price').textContent.replace('$', ''));
            const img = productCard.querySelector('img').src;

            const existing = cart.find(p => p.name === name);
            if (existing) {
                existing.qty += 1;
            } else {
                cart.push({ name, price, qty: 1, img });
            }

            updateCartUI();
        }

        // Update cart UI
        function updateCartUI() {
            const totalQty = cart.reduce((acc, p) => acc + p.qty, 0);
            cartCount.textContent = totalQty;

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `<p class="muted">Your cart is empty.</p>`;
                cartTotal.textContent = 'Total: $0';
                return;
            }

            cartItemsContainer.innerHTML = cart.map((p, index) => `
    <div class="cart-item">
      <img src="${p.img}" alt="${p.name}">
      <div class="cart-item-info">
        <span class="name">${p.name}</span>
        <span class="price">$${(p.price * p.qty).toFixed(2)}</span>
        <div class="qty-controls">
          <button class="qty-btn" onclick="decreaseQty(${index})">-</button>
          <span>${p.qty}</span>
          <button class="qty-btn" onclick="increaseQty(${index})">+</button>
          <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
        </div>
      </div>
    </div>
  `).join('');

            const totalPrice = cart.reduce((acc, p) => acc + p.price * p.qty, 0);
            cartTotal.textContent = `Total: $${totalPrice.toFixed(2)}`;
        }

        // Quantity control functions
        function increaseQty(index) {
            cart[index].qty += 1;
            updateCartUI();
        }

        function decreaseQty(index) {
            cart[index].qty -= 1;
            if (cart[index].qty <= 0) cart.splice(index, 1);
            updateCartUI();
        }

        function removeItem(index) {
            cart.splice(index, 1);
            updateCartUI();
        }

        // Attach to all Add-to-Cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const card = btn.closest('.product-card');
                addToCart(card);
            });
        });

        // Checkout button
        checkoutBtn.addEventListener('click', () => {
            alert('Proceeding to checkout...');
            // Add redirect logic here if needed
        });
