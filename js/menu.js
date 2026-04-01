/* ═══════════════════════════════════════════════════
   MENU PAGE – Data, Filters, Cart, Quiz, Delivery
   ═══════════════════════════════════════════════════ */

/* ─────── MENU DATA ─────── */
const menuItems = [
    { id: 1, name: "Boo Thee Gyaw", subtitle: "Gourd Fritters", desc: "Young bottle gourd coated in tempura-style batter, deep-fried until golden. Served with tamarind-garlic dip.", tags: ["Veg", "Fried", "Mild", "Starter"], price: 89, spice: 1, emoji: "🥘", img: "../images/boo thee kyaw.jfif", taste: "hearty", protein: "veg" },
    { id: 2, name: "Samusa", subtitle: "Burmese Samosas", desc: "Triangular pastry filled with spiced potatoes, onions, and chickpeas.", tags: ["Veg", "Fried", "Mild", "Starter"], price: 99, spice: 1, emoji: "🔺", img: "../images/Samusa.png", taste: "hearty", protein: "veg" },
    { id: 3, name: "Baya Gyaw", subtitle: "Yellow Split Pea Fritters", desc: "Crunchy, falafel-like fritters made from yellow split peas and spices.", tags: ["Veg", "Fried", "Savory", "Starter"], price: 79, spice: 1, emoji: "🧆", img: "../images/BayaGyaw.png", taste: "hearty", protein: "veg" },
    { id: 4, name: "Mont Lin Ma Yar", subtitle: "Stuffed Pancakes", desc: "Crispy mini pancakes filled with quail egg, spring onion, and chili flakes.", tags: ["Veg", "Fried", "Savory", "Starter"], price: 109, spice: 2, emoji: "🥞", img: "../images/MontLinMaYar.png", taste: "spicy", protein: "veg" },
    { id: 5, name: "Mohinga", subtitle: "National Fish Noodle Soup", desc: "Myanmar's beloved national dish — catfish broth thickened with chickpea flour, served over rice vermicelli with fritters.", tags: ["Seafood", "Noodles", "Savory", "Popular"], price: 189, spice: 2, emoji: "🍲", img: "../images/Mohinga.jpg", taste: "hearty", protein: "seafood" },
    { id: 6, name: "Shan Khao Swè", subtitle: "Shan Noodles", desc: "Sticky rice noodles in tomato-based chicken or pork sauce.", tags: ["Meat", "Noodles", "Mild", "Popular"], price: 179, spice: 1, emoji: "🍜", img: "../images/shan khao swe.jpg", taste: "light", protein: "meat" },
    { id: 7, name: "Rakhine Mote Ti", subtitle: "Spicy Fish Noodle Soup", desc: "A spicy, sour fish soup with thin rice noodles, galangal, and green chili paste.", tags: ["Seafood", "Noodles", "Very Spicy", "Sour"], price: 199, spice: 4, emoji: "🌶️", img: "../images/Rakhine Mote Ti.jpg", taste: "spicy", protein: "seafood" },
    { id: 8, name: "Mandalay Meeshay", subtitle: "Noodles with Meat Sauce", desc: "Rice noodles with meat sauce, pickled mustard greens, and sticky rice flour.", tags: ["Meat", "Noodles", "Savory", "Heavy"], price: 169, spice: 2, emoji: "🍝", img: "../images/Mandalay Meeshay.jpg", taste: "hearty", protein: "meat" },
    { id: 9, name: "Kyay Oh", subtitle: "Chicken Noodle Soup", desc: "Clear chicken broth with glass noodles, quail eggs, and meatballs.", tags: ["Meat", "Noodles", "Mild", "Healthy"], price: 159, spice: 1, emoji: "🥣", img: "../images/Kyay_Oh_.jpg", taste: "light", protein: "meat" },
    { id: 10, name: "Laphet Thoke", subtitle: "Tea Leaf Salad", desc: "Myanmar's iconic fermented tea leaves mixed with crunchy nuts, dried shrimp, sesame, chili, and lime.", tags: ["Veg", "Salad", "Herbal", "Popular"], price: 169, spice: 2, emoji: "🍵", img: "../images/laphet thoke.png", taste: "light", protein: "veg" },
    { id: 11, name: "Myin Kwa Yuet Thoke", subtitle: "Pennywort Salad", desc: "Fresh pennywort mixed with lime, nuts, and dried shrimp powder.", tags: ["Veg", "Salad", "Herbal", "Healthy"], price: 139, spice: 1, emoji: "🥗", img: "../images/myin kwa ywet thoke.jpg", taste: "light", protein: "veg" },
    { id: 12, name: "Tofu Thoke", subtitle: "Shan Tofu Salad", desc: "Thick slices of yellow chickpea tofu dressed in chili oil and soy sauce.", tags: ["Veg", "Salad", "Savory", "Creamy"], price: 149, spice: 2, emoji: "🫘", img: "../images/tofu thoke.jpg", taste: "light", protein: "veg" },
    { id: 13, name: "Nan Gyi Thoke", subtitle: "Mandalay Salad", desc: "Thick round rice noodles mixed with chicken curry.", tags: ["Meat", "Noodles", "Heavy"], price: 179, spice: 2, emoji: "🍝", img: "../images/Nan gyi thoke.jpg", taste: "hearty", protein: "meat" },
    { id: 14, name: "Dan Pauk", subtitle: "Burmese Biryani", desc: "Aromatic saffron/turmeric rice with braised chicken and cashew nuts.", tags: ["Meat", "Rice", "Mild", "Premium"], price: 249, spice: 1, emoji: "🍚", img: "../images/Dan pouk.jpg", taste: "hearty", protein: "meat" },
    { id: 15, name: "Htamin Jin", subtitle: "Fermented Rice", desc: "Shan specialty — rice kneaded with fish and turmeric.", tags: ["Seafood", "Rice", "Sour", "Regional"], price: 169, spice: 2, emoji: "🍙", img: "../images/htamin jin.jfif", taste: "light", protein: "seafood" },
    { id: 16, name: "Nga Sish Pyan", subtitle: "Burmese Fish Curry", desc: "Freshwater fish in tomato-onion paste.", tags: ["Seafood", "Curry", "Oily", "Savory"], price: 219, spice: 2, emoji: "🐟", img: "../images/nga sish pyan.jpg", taste: "hearty", protein: "seafood" },
    { id: 17, name: "Pazun Hin", subtitle: "River Prawn Curry", desc: "Giant river prawns in a rich, reddish curry base.", tags: ["Seafood", "Curry", "Mild", "Premium"], price: 459, spice: 1, emoji: "🦐", img: "../images/Pazun Hin.jpg", taste: "hearty", protein: "seafood" },
    { id: 18, name: "A Mae Hnut", subtitle: "Slow Cooked Beef", desc: "Beef cubes slow-cooked until falling apart, with ginger and garlic.", tags: ["Meat", "Curry", "Savory", "Spicy"], price: 239, spice: 3, emoji: "🥩", img: "../images/beef curry.jpg", taste: "spicy", protein: "meat" },
    { id: 19, name: "Kyet Thar Hin", subtitle: "Chicken Curry", desc: "Classic Burmese chicken curry with mild tomato-onion base.", tags: ["Meat", "Curry", "Mild", "Popular"], price: 199, spice: 1, emoji: "🍗", img: "../images/chicken curry.jpg", taste: "hearty", protein: "meat" },
    { id: 20, name: "Wet Thar Dote Htoe", subtitle: "Pork Belly Curry", desc: "Rich slow-braised pork belly in dark fragrant gravy.", tags: ["Meat", "Curry", "Savory", "Heavy"], price: 269, spice: 2, emoji: "🐖", img: "../images/pork stick.jpg", taste: "hearty", protein: "meat" },
    { id: 21, name: "Falooda", subtitle: "Rose Milk Cooler", desc: "Rose syrup, milk, basil seeds, pudding, and ice cream.", tags: ["Sweet", "Drink", "Dessert", "Cold"], price: 129, spice: -1, emoji: "🥤", img: "../images/falooda.png", taste: "sweet", protein: "any" },
    { id: 22, name: "Shwe Yin Aye", subtitle: "Golden Heart Cooler", desc: "Coconut milk, sticky rice, jelly, and bread.", tags: ["Sweet", "Dessert", "Coconut", "Cold"], price: 109, spice: -1, emoji: "🥥", img: "../images/ShweYinAye_0.png", taste: "sweet", protein: "any" },
    { id: 23, name: "Avocado Shake", subtitle: "Creamy Avocado Blend", desc: "Rich avocado blended with sweetened condensed milk.", tags: ["Sweet", "Drink", "Creamy"], price: 99, spice: -1, emoji: "🥑", img: "../images/AvocadoShake.png", taste: "sweet", protein: "any" },
    { id: 24, name: "Mont Lone Yay Paw", subtitle: "Sticky Rice Balls", desc: "Chewy glutinous rice balls filled with jaggery in coconut milk.", tags: ["Sweet", "Dessert", "Coconut", "Healthy"], price: 89, spice: -1, emoji: "🍡", img: "../images/MontLoneYayPaw_0.png", taste: "sweet", protein: "any" },
    { id: 25, name: "Myanmar Milk Tea", subtitle: "Laphet Yay Cho", desc: "Strong black tea with sweetened condensed milk.", tags: ["Sweet", "Drink", "Creamy", "Popular"], price: 69, spice: -1, emoji: "🍵", img: "../images/MyanmarMilkTea_0.png", taste: "sweet", protein: "any" },
    { id: 26, name: "Urban Beer", subtitle: "Ice Cold Draft", desc: "Crisp golden lager brewed in Mandalay.", tags: ["Drink", "Cold", "Popular"], price: 99, spice: -1, emoji: "🍺", img: "../images/BurmaBeer_0.png", taste: "light", protein: "any" },
    { id: 27, name: "E Kyar Gway", subtitle: "Fried Dough Sticks", desc: "Crispy golden dough sticks, perfect for dipping in coffee or soup.", tags: ["Veg", "Fried", "Mild", "Starter"], price: 59, spice: 0, emoji: "🥖", img: "../images/e kyar gway.jpg", taste: "hearty", protein: "veg" },
    { id: 28, name: "Ohn No Khao Swè", subtitle: "Coconut Noodle Soup", desc: "Rich coconut milk broth with egg noodles, chicken, and crispy fritters on top.", tags: ["Meat", "Noodles", "Savory", "Popular"], price: 189, spice: 1, emoji: "🍜", img: "../images/oan noh.jpg", taste: "hearty", protein: "meat" },
    { id: 29, name: "Tofu Kyaw", subtitle: "Fried Tofu", desc: "Golden fried Shan tofu slices served with spicy dipping sauce.", tags: ["Veg", "Fried", "Savory", "Starter"], price: 89, spice: 1, emoji: "🫘", img: "../images/tofu kyaw.jpg", taste: "hearty", protein: "veg" },
    { id: 30, name: "Tofu A Sar Thot", subtitle: "Deep Fried Tofu Platter", desc: "Crispy deep-fried tofu cubes with a tangy tamarind dipping sauce.", tags: ["Veg", "Fried", "Savory", "Starter"], price: 99, spice: 1, emoji: "🍳", img: "../images/tofu asr thoot.jpg", taste: "hearty", protein: "veg" },
    { id: 31, name: "Toh Hoo Nway", subtitle: "Warm Tofu Soup", desc: "Silky chickpea tofu in a warm turmeric-ginger broth with rice noodles.", tags: ["Veg", "Noodles", "Mild", "Healthy"], price: 149, spice: 1, emoji: "🥣", img: "../images/toh hoo nway.jpg", taste: "light", protein: "veg" },
    { id: 32, name: "Keema Palata", subtitle: "Minced Curry Flatbread", desc: "Flaky pan-fried flatbread served with savory minced curry — a classic, satisfying snack.", tags: ["Meat", "Savory", "Mild", "Starter"], price: 179, spice: 1, emoji: "🫓", img: "../images/kee marr.jpg", taste: "hearty", protein: "meat" },
    { id: 33, name: "Pashu Fried Rice", subtitle: "Burmese-Style Fried Rice", desc: "Wok-fried rice tossed with aromatics and a savory Burmese seasoning blend — simple, comforting, and filling.", tags: ["Rice", "Savory", "Popular", "Meat"], price: 149, spice: 1, emoji: "🍚", img: "../images/pa shoo.jpg", taste: "hearty", protein: "meat" },
    { id: 34, name: "Kout Nyin Paung", subtitle: "Steamed Sticky Rice", desc: "Fragrant glutinous rice steamed in banana leaf, served with coconut flakes.", tags: ["Veg", "Rice", "Mild", "Healthy"], price: 69, spice: 0, emoji: "🍚", img: "../images/kout nyen pyn pg.jpg", taste: "light", protein: "veg" },
    { id: 35, name: "Mont Lat Saung", subtitle: "Rice Noodle Dessert", desc: "Chilled rice noodles in sweet coconut milk with shaved ice and jaggery.", tags: ["Sweet", "Dessert", "Coconut", "Cold"], price: 89, spice: -1, emoji: "🍧", img: "../images/mont_lat_saung.jpg", taste: "sweet", protein: "any" },
    { id: 36, name: "Lemon Juice", subtitle: "Freshly Squeezed", desc: "Refreshing lemon juice with a hint of honey and mint.", tags: ["Drink", "Cold", "Healthy"], price: 59, spice: -1, emoji: "🍋", img: "../images/lemon-juice.jpg", taste: "light", protein: "any" },
    { id: 37, name: "Orange Juice", subtitle: "Freshly Squeezed", desc: "Sweet and tangy fresh-squeezed orange juice.", tags: ["Drink", "Cold", "Healthy"], price: 69, spice: -1, emoji: "🍊", img: "../images/orange juice.jpg", taste: "sweet", protein: "any" },
    { id: 38, name: "Strawberry Juice", subtitle: "Berry Bliss", desc: "Blended fresh strawberries with a splash of lime.", tags: ["Drink", "Cold", "Sweet"], price: 79, spice: -1, emoji: "🍓", img: "../images/strawberry-juice.jpg", taste: "sweet", protein: "any" },
    { id: 39, name: "Watermelon Juice", subtitle: "Summer Cooler", desc: "Cool, hydrating watermelon juice blended with ice.", tags: ["Drink", "Cold", "Healthy"], price: 59, spice: -1, emoji: "🍉", img: "../images/watermelon juice.jpg", taste: "light", protein: "any" }
];

/* ─────── HELPERS ─────── */
const spiceLabels = ["None", "Mild 🌶️", "Medium 🌶️🌶️", "Spicy 🔥🔥", "Very Spicy 🔥🔥🔥"];
const spiceClasses = ["spice-none", "spice-mild", "spice-medium", "spice-hot", "spice-fire"];
function dietBadge(tags) {
    if (tags.includes("Veg")) return '<span class="diet-badge veg"> Veg</span>';
    if (tags.includes("Seafood")) return '<span class="diet-badge seafood"> Seafood</span>';
    if (tags.includes("Meat")) return '<span class="diet-badge meat"> Meat</span>';
    return '';
}
function catLabel(tags) {
    if (tags.includes("Starter")) return "Appetizer";
    if (tags.includes("Noodles")) return "Noodles";
    if (tags.includes("Salad")) return "Salad";
    if (tags.includes("Rice")) return "Rice";
    if (tags.includes("Curry")) return "Curry";
    if (tags.includes("Dessert") || tags.includes("Drink")) return "Dessert & Drink";
    return "Other";
}

/* ─────── RENDER MENU ─────── */
const grid = document.getElementById('menuGrid');
const noResults = document.getElementById('noResults');

function renderMenu(items) {
    grid.innerHTML = '';
    if (!items.length) { noResults.style.display = 'block'; return; }
    noResults.style.display = 'none';
    items.forEach((item, i) => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.style.animationDelay = `${i * 0.04}s`;
        card.dataset.id = item.id;
        card.innerHTML = `
        <div class="card-img-area">
          <div class="ubr-heat" aria-hidden="true"></div>
          ${item.img ? `<img src="${item.img}" alt="${item.name}" class="card-photo">` : `<div class="card-img-placeholder"><span>${item.emoji}</span></div>`}
          <span class="card-category">${catLabel(item.tags)}</span>
          ${item.tags.includes("Popular") ? '<span class="card-popular">🔥 Popular</span>' : ''}
        </div>
        <div class="card-body">
          <h3 class="card-name">${item.name}</h3>
          <p class="card-subtitle">${item.subtitle}</p>
          <p class="card-desc">${item.desc}</p>
          <div class="card-meta">
            ${item.spice >= 0 ? `<span class="spice-indicator ${spiceClasses[item.spice]}">${spiceLabels[item.spice]}</span>` : ''}
            ${dietBadge(item.tags)}
          </div>
        </div>
        <div class="card-footer">
          <span class="card-price">฿${item.price}</span>
          <span class="card-click-hint">Tap to customize →</span>
        </div>`;
        card.addEventListener('click', () => openModal(item));
        grid.appendChild(card);
    });
}

/* ─────── FILTERS ─────── */
let fCat = 'all', fDiet = 'all', fSpice = 'all', fSort = 'default';
function applyFilters() {
    let f = menuItems.filter(item => {
        const cm = fCat === 'all' || item.tags.includes(fCat) || (fCat === 'Dessert' && (item.tags.includes('Dessert') || item.tags.includes('Drink')));
        const dm = fDiet === 'all' || item.tags.includes(fDiet) || (fDiet === 'Sweet' && (item.tags.includes('Sweet') || item.tags.includes('Drink')));
        const spiceMap = { 'None': 0, 'Mild': 1, 'Medium': 2, 'Spicy': 3, 'Very Spicy': 4 };
        const sm = fSpice === 'all' || (item.spice >= 0 && item.spice === spiceMap[fSpice]);
        return cm && dm && sm;
    });
    if (fSort === 'price-asc') f.sort((a, b) => a.price - b.price);
    else if (fSort === 'price-desc') f.sort((a, b) => b.price - a.price);
    else if (fSort === 'name-asc') f.sort((a, b) => a.name.localeCompare(b.name));
    renderMenu(f);
}
function setupFG(id, key, fn) {
    document.getElementById(id).addEventListener('click', e => {
        if (!e.target.classList.contains('filter-btn')) return;
        e.target.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        fn(e.target.dataset[key]);
        applyFilters();
    });
}
setupFG('categoryFilters', 'filter', v => fCat = v);
setupFG('dietFilters', 'diet', v => fDiet = v);
setupFG('spiceFilters', 'spice', v => fSpice = v);
document.getElementById('sortSelect').addEventListener('change', e => { fSort = e.target.value; applyFilters(); });
applyFilters();

/* ─────── ITEM MODAL ─────── */
let currentItem = null;
const overlay = document.getElementById('modalOverlay');

function openModal(item) {
    currentItem = item;
    document.getElementById('modalImg').innerHTML = item.img
        ? `<img src="${item.img}" alt="${item.name}">`
        : `<div class="modal-img-placeholder"><span>${item.emoji}</span></div>`;
    document.getElementById('modalCategory').textContent = catLabel(item.tags);
    document.getElementById('modalName').textContent = item.name;
    document.getElementById('modalSubtitle').textContent = item.subtitle;
    document.getElementById('modalDesc').textContent = item.desc;
    document.getElementById('modalTags').innerHTML = item.tags.map(t => `<span class="tag">${t}</span>`).join('');
    const spiceSection = document.getElementById('spiceSelector').parentElement;
    if (item.spice < 0) { spiceSection.style.display = 'none'; }
    else { spiceSection.style.display = ''; document.querySelector('[name="spiceLevel"][value="' + item.spice + '"]').checked = true; }
    document.querySelector('[name="portion"][value="regular"]').checked = true;
    document.getElementById('qtyValue').textContent = '1';
    document.getElementById('modalNotes').value = '';
    updateModalPrice();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() { overlay.classList.remove('open'); document.body.style.overflow = ''; }
document.getElementById('modalClose').addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

function getModalPrice() {
    if (!currentItem) return 0;
    const portion = document.querySelector('[name="portion"]:checked').value;
    const qty = parseInt(document.getElementById('qtyValue').textContent);
    let p = currentItem.price;
    if (portion === 'large') p = Math.round(p * 1.3);
    return p * qty;
}
function updateModalPrice() { document.getElementById('modalPrice').textContent = '฿' + getModalPrice(); }
document.querySelectorAll('[name="spiceLevel"],[name="portion"]').forEach(r => r.addEventListener('change', updateModalPrice));
document.getElementById('qtyMinus').addEventListener('click', () => {
    const el = document.getElementById('qtyValue');
    let v = parseInt(el.textContent);
    if (v > 1) { el.textContent = v - 1; updateModalPrice(); }
});
document.getElementById('qtyPlus').addEventListener('click', () => {
    const el = document.getElementById('qtyValue');
    el.textContent = parseInt(el.textContent) + 1;
    updateModalPrice();
});

/* ─────── CART ─────── */
let cart = [];
let selectedAddress = '';
const cartBadge = document.getElementById('cartBadge');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');

function updateCartUI() {
    const count = cart.reduce((s, c) => s + c.qty, 0);
    cartBadge.textContent = count;
    cartBadge.classList.toggle('has-items', count > 0);
    const cartItemsEl = document.getElementById('cartItems');
    const cartFooterEl = document.getElementById('cartFooter');
    if (!cart.length) {
        cartItemsEl.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
        cartFooterEl.style.display = 'none';
        return;
    }
    cartFooterEl.style.display = 'block';
    let total = 0;
    cartItemsEl.innerHTML = cart.map((c, i) => {
        total += c.lineTotal;
        return `<div class="cart-item">
        <div class="cart-item-info">
          <strong>${c.name}</strong>
          <small>${c.spiceLabel} · ${c.portion} · x${c.qty}</small>
          ${c.notes ? `<small class="cart-note">📝 ${c.notes}</small>` : ''}
        </div>
        <div class="cart-item-right">
          <span>฿${c.lineTotal}</span>
          <button class="cart-remove" data-idx="${i}">✕</button>
        </div>
      </div>`;
    }).join('');
    document.getElementById('cartTotal').textContent = '฿' + total;
    cartItemsEl.querySelectorAll('.cart-remove').forEach(btn => {
        btn.addEventListener('click', e => { cart.splice(parseInt(e.target.dataset.idx), 1); updateCartUI(); });
    });
    loadCartAddresses();
}

document.getElementById('addToOrderBtn').addEventListener('click', () => {
    if (!currentItem) return;
    const spiceLvl = document.querySelector('[name="spiceLevel"]:checked').value;
    const portion = document.querySelector('[name="portion"]:checked').value;
    const qty = parseInt(document.getElementById('qtyValue').textContent);
    const notes = document.getElementById('modalNotes').value.trim();
    cart.push({
        id: currentItem.id, name: currentItem.name,
        spiceLabel: spiceLabels[spiceLvl],
        portion: portion === 'large' ? 'Large' : 'Regular',
        qty, notes, lineTotal: getModalPrice()
    });
    updateCartUI();
    closeModal();
    cartBadge.classList.add('pulse');
    setTimeout(() => cartBadge.classList.remove('pulse'), 600);
});

document.getElementById('cartToggle').addEventListener('click', () => { cartSidebar.classList.add('open'); cartOverlay.classList.add('open'); });
document.getElementById('cartClose').addEventListener('click', () => { cartSidebar.classList.remove('open'); cartOverlay.classList.remove('open'); });
cartOverlay.addEventListener('click', () => { cartSidebar.classList.remove('open'); cartOverlay.classList.remove('open'); });
document.getElementById('clearCartBtn').addEventListener('click', () => { cart = []; updateCartUI(); });

document.getElementById('placeOrderBtn').addEventListener('click', async () => {
    if (!cart.length) return;
    const orderBtn = document.getElementById('placeOrderBtn');
    orderBtn.disabled = true;
    orderBtn.textContent = 'Placing Order...';

    const paymentMethodEl = document.querySelector('input[name="cartPaymentMethod"]:checked');
    const paymentMethod = paymentMethodEl ? paymentMethodEl.value : 'cod';

    const orderData = {
        items: cart,
        delivery_address: selectedAddress || '',
        notes: '',
        payment_method: paymentMethod
    };

    try {
        const res = await (window.UBR ? window.UBR.apiCall('orders.php', 'POST', orderData) :
            fetch((location.pathname.includes('/pages/') ? '../api/' : 'api/') + 'orders.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(orderData)
            }).then(r => r.json()));

        // Only show success UI if the API actually succeeded
        if (!res || res.success !== true) {
            const msg = (res && (res.message || (res.data && res.data.message))) || 'Failed to place order.';
            throw new Error(msg);
        }

        const addrText = selectedAddress ? `<p style="margin-top:8px;font-size:0.85rem;color:var(--gold-500);">📍 Delivering to: ${selectedAddress}</p>` : '';
        const orderIdText = res.success && res.data ? `<p style="font-size:0.9rem;color:var(--text-muted);margin-top:4px;">Order #${res.data.order_id}</p>` : '';

        const orderId = res && res.data ? res.data.order_id : null;

        if (paymentMethod === 'bank' && orderId) {
            const bankDetails = [
                'Urban Burmese Restaurant',
                'Bank: KBANK (Example)',
                'Account: 123-456-789',
                `Order: #${orderId}`
            ].join('\n');
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(bankDetails)}`;

            cartSidebar.innerHTML = `<div style="padding:32px 24px;text-align:center;">
                <span style="font-size:3rem;">🏦</span>
                <h3 style="margin:12px 0 6px;">Bank Transfer</h3>
                ${orderIdText}
                <p style="color:var(--text-secondary);margin:10px 0 0;">Scan this QR to pay, then confirm.</p>
                <div style="margin:16px auto 10px;display:flex;justify-content:center;">
                    <img src="${qrUrl}" alt="Bank transfer QR" style="width:220px;height:220px;border-radius:12px;border:1px solid var(--border-color);background:#fff;padding:8px;">
                </div>
                <div style="text-align:left;margin:0 auto;max-width:320px;font-size:0.85rem;color:var(--text-secondary);background:var(--bg-surface);border:1px solid var(--border-color);border-radius:12px;padding:12px;">
                    <div style="font-weight:700;color:var(--text-primary);margin-bottom:6px;">Payment details</div>
                    <div>Urban Burmese Restaurant</div>
                    <div>Bank: KBANK (Example)</div>
                    <div>Account: 123-456-789</div>
                    <div style="margin-top:6px;color:var(--text-muted);">Reference: Order #${orderId}</div>
                </div>
                ${addrText}
                <button class="btn btn-primary btn-full" id="confirmBankPaymentBtn" style="margin-top:14px;">Confirm Payment</button>
                <button class="btn btn-outline btn-full btn-sm" id="closeCartAfterPaymentBtn">Close</button>
            </div>`;

            const confirmBtn = document.getElementById('confirmBankPaymentBtn');
            const closeBtn = document.getElementById('closeCartAfterPaymentBtn');
            if (closeBtn) closeBtn.addEventListener('click', () => {
                cartSidebar.classList.remove('open');
                cartOverlay.classList.remove('open');
            });
            if (confirmBtn) {
                confirmBtn.addEventListener('click', async () => {
                    confirmBtn.disabled = true;
                    confirmBtn.textContent = 'Confirming...';
                    try {
                        const r = await (window.UBR ? window.UBR.apiCall('orders.php?action=confirm_payment', 'PATCH', { order_id: orderId }) :
                            fetch((location.pathname.includes('/pages/') ? '../api/' : 'api/') + 'orders.php?action=confirm_payment', {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                credentials: 'same-origin',
                                body: JSON.stringify({ order_id: orderId })
                            }).then(x => x.json()));
                        if (!r || r.success !== true) throw new Error((r && r.message) || 'Failed to confirm payment.');

                        cartSidebar.innerHTML = `<div style="padding:60px 32px;text-align:center;">
                            <span style="font-size:4rem;">✅</span>
                            <h3 style="margin:16px 0 8px;">Payment Confirmed</h3>
                            ${orderIdText}
                            <p style="color:var(--text-secondary);">Thank you! We'll verify your transfer shortly.</p>
                            ${addrText}
                        </div>`;
                        cart = [];
                        setTimeout(() => { cartBadge.textContent = '0'; cartBadge.classList.remove('has-items'); }, 500);
                        setTimeout(() => location.reload(), 2500);
                    } catch (err) {
                        confirmBtn.disabled = false;
                        confirmBtn.textContent = 'Confirm Payment';
                        alert(err && err.message ? err.message : 'Failed to confirm payment.');
                    }
                });
            }

            // Clear cart now (order already created)
            cart = [];
            setTimeout(() => { cartBadge.textContent = '0'; cartBadge.classList.remove('has-items'); }, 200);
        } else {
            cartSidebar.innerHTML = `<div style="padding:60px 32px;text-align:center;">
                <span style="font-size:4rem;">🎉</span>
                <h3 style="margin:16px 0 8px;">Order Placed!</h3>
                ${orderIdText}
                <p style="color:var(--text-secondary);">Thank you! We're preparing your Burmese feast.</p>
                ${addrText}
            </div>`;
            cart = [];
            setTimeout(() => { cartBadge.textContent = '0'; cartBadge.classList.remove('has-items'); }, 500);
            setTimeout(() => location.reload(), 3000);
        }
    } catch (e) {
        console.error('Order placement failed:', e);
        orderBtn.disabled = false;
        orderBtn.textContent = 'Place Order';
        alert(e && e.message ? e.message : 'Failed to place order. Please try again.');
    }
});

/* ─────── CART DELIVERY ADDRESS ─────── */
async function loadCartAddresses() {
    const select = document.getElementById('cartAddressSelect');
    const user = window.UBR ? window.UBR.currentUser() : null;
    if (user && select) {
        const res = await window.UBR.apiCall('addresses.php');
        if (res.success && res.data && res.data.length) {
            select.style.display = 'block';
            select.innerHTML = '<option value="">Select saved address…</option>' +
                res.data.map(a => `<option value="${a.address_text}" ${a.is_default ? 'selected' : ''}>${a.label}: ${a.address_text}</option>`).join('');
            if (res.data.find(a => a.is_default)) {
                const def = res.data.find(a => a.is_default);
                selectedAddress = def.address_text;
                showCartAddress(def.address_text);
            }
        } else {
            select.style.display = 'none';
        }
    }
}

const cartAddrSelect = document.getElementById('cartAddressSelect');
if (cartAddrSelect) {
    cartAddrSelect.addEventListener('change', e => {
        selectedAddress = e.target.value;
        showCartAddress(e.target.value);
    });
}

document.getElementById('useLocationBtn').addEventListener('click', () => {
    if (!navigator.geolocation) { alert('Geolocation not supported.'); return; }
    navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords;
        selectedAddress = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        document.getElementById('cartAddressPreview').textContent = '📍 Current Location: ' + selectedAddress;
        const mapDiv = document.getElementById('cartMapPreview');
        mapDiv.style.display = 'block';
        mapDiv.innerHTML = `<iframe src="https://maps.google.com/maps?q=${latitude},${longitude}&output=embed" loading="lazy"></iframe>`;
    }, () => alert('Could not get location.'));
});

function showCartAddress(addr) {
    if (!addr) { document.getElementById('cartAddressPreview').textContent = ''; document.getElementById('cartMapPreview').style.display = 'none'; return; }
    document.getElementById('cartAddressPreview').textContent = '📍 ' + addr;
    const mapDiv = document.getElementById('cartMapPreview');
    mapDiv.style.display = 'block';
    mapDiv.innerHTML = `<iframe src="https://maps.google.com/maps?q=${encodeURIComponent(addr)}&output=embed" loading="lazy"></iframe>`;
}

/* ─────── FLAVOUR MATCHER QUIZ ─────── */
const quizSteps = [
    { q: "What are you craving?", opts: ["🍖 Hearty", "🥗 Light & Fresh", "🌶️ Spicy", "🍰 Sweet"], key: "taste", vals: ["hearty", "light", "spicy", "sweet"] },
    { q: "Preferred protein?", opts: ["🥩 Meat", "🦐 Seafood", "🥬 Vegetarian", "🤷 No preference"], key: "protein", vals: ["meat", "seafood", "veg", "any"] },
    { q: "Spice tolerance?", opts: ["❌ None", "😊 Mild", "🔥 Medium", "💀 Hot"], key: "spiceLevel", vals: [0, 1, 2, 3] }
];
let quizAnswers = {};
let quizStep = 0;
const quizOverlay = document.getElementById('quizOverlay');

document.getElementById('findDishFab').addEventListener('click', () => {
    quizAnswers = {}; quizStep = 0;
    quizOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderQuizStep();
});
document.getElementById('quizClose').addEventListener('click', () => {
    quizOverlay.classList.remove('open');
    document.body.style.overflow = '';
});
quizOverlay.addEventListener('click', e => { if (e.target === quizOverlay) { quizOverlay.classList.remove('open'); document.body.style.overflow = ''; } });

function renderQuizStep() {
    const dots = document.getElementById('quizDots');
    dots.innerHTML = quizSteps.map((_, i) => `<span class="quiz-step-dot ${i < quizStep ? 'done' : ''} ${i === quizStep ? 'active' : ''}"></span>`).join('');
    const content = document.getElementById('quizContent');
    const step = quizSteps[quizStep];
    content.innerHTML = `
        <p class="quiz-question">${step.q}</p>
        <div class="quiz-options">
            ${step.opts.map((o, i) => `<button class="quiz-option" data-val="${step.vals[i]}">${o}</button>`).join('')}
        </div>`;
    content.querySelectorAll('.quiz-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const val = step.key === 'spiceLevel' ? parseInt(btn.dataset.val) : btn.dataset.val;
            quizAnswers[step.key] = val;
            quizStep++;
            if (quizStep < quizSteps.length) { renderQuizStep(); }
            else { finishQuiz(); }
        });
    });
}

function finishQuiz() {
    quizOverlay.classList.remove('open');
    document.body.style.overflow = '';
    // Find matches
    const matches = menuItems.filter(item => {
        let score = 0;
        if (quizAnswers.taste && item.taste === quizAnswers.taste) score++;
        if (quizAnswers.protein === 'any' || item.protein === 'any' || item.protein === quizAnswers.protein) score++;
        if (quizAnswers.spiceLevel !== undefined) {
            if (item.spice < 0) score += (quizAnswers.taste === 'sweet' ? 1 : 0);
            else if (Math.abs(item.spice - quizAnswers.spiceLevel) <= 1) score++;
        }
        return score >= 2;
    });

    // Highlight matching cards
    document.querySelectorAll('.menu-card').forEach(card => card.classList.remove('quiz-match'));
    const matchIds = matches.map(m => m.id);
    document.querySelectorAll('.menu-card').forEach(card => {
        if (matchIds.includes(parseInt(card.dataset.id))) card.classList.add('quiz-match');
    });

    // Show banner
    const banner = document.getElementById('quizBanner');
    const bannerText = document.getElementById('quizBannerText');
    if (matches.length) {
        bannerText.textContent = matches.map(m => m.name).join(', ');
        banner.classList.add('show');
        // Scroll to first match
        const firstMatch = document.querySelector('.menu-card.quiz-match');
        if (firstMatch) firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        bannerText.textContent = 'No exact matches found — try our popular dishes!';
        banner.classList.add('show');
    }
}

document.getElementById('closeBanner').addEventListener('click', () => {
    document.getElementById('quizBanner').classList.remove('show');
    document.querySelectorAll('.menu-card').forEach(c => c.classList.remove('quiz-match'));
});

/* ─────── THEME (menu page has its own toggle handling) ─────── */
// Theme is handled by script.js already
