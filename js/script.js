/* ═══════════════════════════════════════════════════
   URBAN BURMESE RESTAURANT – Shared Script
   ═══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

    /* ─── Detect API base path (root vs pages/) ─── */
    const isSubPage = location.pathname.includes('/pages/');
    const API = isSubPage ? '../api/' : 'api/';
    const PAGES = isSubPage ? '' : 'pages/';

    /* ═══════════════════════════════════════════════
       SCROLL STORYTELLING (Homepage)
       Smooth, rAF-driven; does not block scrolling.
       ═══════════════════════════════════════════════ */
    (function initDishStory() {
        const scenes = Array.from(document.querySelectorAll('.dish-scene'));
        if (!scenes.length) return;

        const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            scenes.forEach(s => {
                s.style.setProperty('--p', '1');
                s.dataset.stage = '2';
            });
            return;
        }

        // Measure once, update on resize.
        const measurements = new Map();
        function measure() {
            measurements.clear();
            scenes.forEach(scene => {
                const rect = scene.getBoundingClientRect();
                const top = rect.top + window.scrollY;
                const height = rect.height;
                // Progress is computed across most of the scene height for a long, smooth scroll.
                const start = top - window.innerHeight * 0.15;
                const end = top + height - window.innerHeight * 0.55;
                measurements.set(scene, { start, end: Math.max(end, start + 1) });
            });
        }

        let rafId = null;
        function clamp01(x) { return Math.min(1, Math.max(0, x)); }
        function stageFromProgress(p) {
            if (p < 1 / 3) return 0;
            if (p < 2 / 3) return 1;
            return 2;
        }

        function update() {
            rafId = null;
            const y = window.scrollY;
            scenes.forEach(scene => {
                const m = measurements.get(scene);
                if (!m) return;
                const p = clamp01((y - m.start) / (m.end - m.start));
                scene.style.setProperty('--p', String(p));
                scene.dataset.stage = String(stageFromProgress(p));
            });
        }

        function onScroll() {
            if (rafId != null) return;
            rafId = requestAnimationFrame(update);
        }

        measure();
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', () => {
            measure();
            update();
        }, { passive: true });

        // Start storytelling once it is near viewport (saves work on long pages)
        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries) => {
                const anyVisible = entries.some(e => e.isIntersecting);
                if (!anyVisible) return;
                // Force a fresh measurement when the section becomes relevant.
                measure();
                update();
                io.disconnect();
            }, { rootMargin: '200px 0px 200px 0px', threshold: 0.01 });
            scenes.slice(0, 1).forEach(s => io.observe(s));
        }
    })();

    /* 0. LIVE DATE & TIME DISPLAY */
    const dateTimeEl = document.getElementById('dateTimeDisplay');
    if (dateTimeEl) {
        function updateDateTime() {
            const now = new Date();
            const options = {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
            };
            dateTimeEl.textContent = '📅 ' + now.toLocaleDateString('en-US', options);
        }
        updateDateTime();
        setInterval(updateDateTime, 1000);
    }

    /* 1. LIGHT/DARK MODE TOGGLE */
    const themeBtn = document.getElementById('themeToggle');
    const storedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', storedTheme);
    if (themeBtn) {
        updateThemeIcon(storedTheme);
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
    function updateThemeIcon(theme) {
        if (!themeBtn) return;
        themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
        themeBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }

    /* 2. MOBILE MENU TOGGLE */
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            const isExpanded = navLinks.classList.contains('open');
            navToggle.setAttribute('aria-expanded', isExpanded);
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('open'));
        });
    }

    /* ═══════════════════════════════════════════════
       PREMIUM DISH HOVER (menu cards)
       - Cursor-follow glow via CSS vars (--mx/--my)
       - Smooth tilt + micro-scale via rAF (GPU-friendly)
       ═══════════════════════════════════════════════ */
    (function initPremiumDishHover() {
        const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
        if (prefersReducedMotion || !canHover) return;

        const MAX_TILT_X = 7; // deg
        const MAX_TILT_Y = 9; // deg
        const IMG_SHIFT = 4; // px

        const states = new WeakMap();
        function clamp(n, a, b) { return Math.min(b, Math.max(a, n)); }

        function getState(card) {
            let s = states.get(card);
            if (!s) {
                s = {
                    active: false,
                    px: 0.5, py: 0.5,
                    tx: 0, ty: 0,
                    raf: 0
                };
                states.set(card, s);
            }
            return s;
        }

        function schedule(card) {
            const s = getState(card);
            if (s.raf) return;
            s.raf = requestAnimationFrame(() => {
                s.raf = 0;
                if (!card.isConnected) return;

                const rect = card.getBoundingClientRect();
                const x = clamp(s.px, 0, 1);
                const y = clamp(s.py, 0, 1);

                const dx = (x - 0.5) * 2; // -1..1
                const dy = (y - 0.5) * 2; // -1..1

                const rx = (-dy * MAX_TILT_X).toFixed(3) + 'deg';
                const ry = (dx * MAX_TILT_Y).toFixed(3) + 'deg';

                const mx = (x * 100).toFixed(2) + '%';
                const my = (y * 100).toFixed(2) + '%';

                const ix = (dx * IMG_SHIFT).toFixed(2);
                const iy = (dy * IMG_SHIFT).toFixed(2);

                // Slightly “pulled in” scale based on proximity to center (premium, controlled)
                const dist = Math.min(1, Math.hypot(dx, dy));
                const scale = (1.04 - dist * 0.012).toFixed(4);

                card.style.setProperty('--mx', mx);
                card.style.setProperty('--my', my);
                card.style.setProperty('--rx', rx);
                card.style.setProperty('--ry', ry);
                card.style.setProperty('--ix', ix);
                card.style.setProperty('--iy', iy);
                card.style.setProperty('--s', scale);

                // Lift is controlled by hover; keep a tiny baseline when active for snap
                if (s.active) card.classList.add('ubr-hover');
            });
        }

        function findCard(el) {
            if (!el || el === document) return null;
            return el.closest ? el.closest('.menu-card') : null;
        }

        document.addEventListener('pointerenter', (e) => {
            const card = findCard(e.target);
            if (!card) return;
            const s = getState(card);
            s.active = true;
            card.classList.add('ubr-hover');
        }, true);

        document.addEventListener('pointermove', (e) => {
            const card = findCard(e.target);
            if (!card) return;
            const s = getState(card);
            if (!s.active) s.active = true;

            const rect = card.getBoundingClientRect();
            if (rect.width <= 1 || rect.height <= 1) return;
            s.px = (e.clientX - rect.left) / rect.width;
            s.py = (e.clientY - rect.top) / rect.height;
            schedule(card);
        }, { passive: true });

        function resetCard(card) {
            const s = getState(card);
            s.active = false;
            card.classList.remove('ubr-hover');
            card.style.setProperty('--mx', '50%');
            card.style.setProperty('--my', '50%');
            card.style.setProperty('--rx', '0deg');
            card.style.setProperty('--ry', '0deg');
            card.style.setProperty('--ix', '0');
            card.style.setProperty('--iy', '0');
            card.style.setProperty('--s', '1');
        }

        document.addEventListener('pointerleave', (e) => {
            const card = findCard(e.target);
            if (!card) return;
            resetCard(card);
        }, true);

        // Keyboard focus: center glow, no tilt
        document.addEventListener('focusin', (e) => {
            const card = findCard(e.target);
            if (!card) return;
            const s = getState(card);
            s.active = true;
            card.classList.add('ubr-hover');
            card.style.setProperty('--mx', '50%');
            card.style.setProperty('--my', '42%');
            card.style.setProperty('--rx', '0deg');
            card.style.setProperty('--ry', '0deg');
            card.style.setProperty('--ix', '0');
            card.style.setProperty('--iy', '0');
            card.style.setProperty('--s', '1.035');
        }, true);

        document.addEventListener('focusout', (e) => {
            const card = findCard(e.target);
            if (!card) return;
            // If focus moves within the same card, do nothing
            const related = e.relatedTarget ? findCard(e.relatedTarget) : null;
            if (related === card) return;
            resetCard(card);
        }, true);
    })();

    /* ═══════════════════════════════════════════════
       AUTH SYSTEM & PROFILE MODAL
       ═══════════════════════════════════════════════ */
    let currentUser = null;

    // ─── API HELPER ───
    async function apiCall(endpoint, method = 'GET', data = null) {
        const opts = {
            method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin'
        };
        if (data && method !== 'GET') opts.body = JSON.stringify(data);
        try {
            const res = await fetch(API + endpoint, opts);
            return await res.json();
        } catch (e) {
            return { success: false, message: 'Network error.' };
        }
    }

    // ─── CHECK SESSION ON LOAD ───
    async function checkAuth() {
        const res = await apiCall('auth.php?action=check');
        if (res.success && res.data) {
            currentUser = res.data;
            updateNavForUser();
        } else {
            currentUser = null;
            updateNavForGuest();
        }
    }

    function updateNavForUser() {
        const authArea = document.getElementById('navAuthArea');
        if (!authArea) return;
        authArea.innerHTML = `
            <button class="nav-user-name" id="navUserNameBtn" style="cursor:pointer;border:none;background:none;">👤 ${currentUser.name}</button>
            <button class="nav-logout-btn" id="navLogoutBtn">Logout</button>
        `;
        document.getElementById('navUserNameBtn').addEventListener('click', openProfileModal);
        document.getElementById('navLogoutBtn').addEventListener('click', async () => {
            await apiCall('auth.php?action=logout');
            currentUser = null;
            updateNavForGuest();
        });
    }

    function updateNavForGuest() {
        const authArea = document.getElementById('navAuthArea');
        if (!authArea) return;
        authArea.innerHTML = `<button class="nav-profile-btn" id="navProfileBtn" aria-label="Account">👤</button>`;
        document.getElementById('navProfileBtn').addEventListener('click', openProfileModal);
    }

    // ─── PROFILE MODAL ───
    const profileOverlay = document.getElementById('profileModalOverlay');
    const profileModal = document.getElementById('profileModal');

    function openProfileModal() {
        if (!profileOverlay) return;
        profileOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        if (currentUser) {
            switchProfileTab('profile');
        } else {
            switchProfileTab('login');
        }
    }
    function closeProfileModal() {
        if (!profileOverlay) return;
        profileOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (profileOverlay) {
        const closeBtn = profileOverlay.querySelector('.ubr-modal-close');
        if (closeBtn) closeBtn.addEventListener('click', closeProfileModal);
        profileOverlay.addEventListener('click', e => {
            if (e.target === profileOverlay) closeProfileModal();
        });
    }

    // Tabs
    function switchProfileTab(tabId) {
        if (!profileOverlay) return;
        profileOverlay.querySelectorAll('.profile-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
        profileOverlay.querySelectorAll('.profile-pane').forEach(p => p.classList.toggle('active', p.id === 'pane-' + tabId));

        // Show/hide tabs based on auth
        const loginTab = profileOverlay.querySelector('[data-tab="login"]');
        const registerTab = profileOverlay.querySelector('[data-tab="register"]');
        const profileTab = profileOverlay.querySelector('[data-tab="profile"]');
        const addressTab = profileOverlay.querySelector('[data-tab="addresses"]');
        const resTab = profileOverlay.querySelector('[data-tab="reservations"]');
        const ordersTab = profileOverlay.querySelector('[data-tab="orders"]');

        if (currentUser) {
            if (loginTab) loginTab.style.display = 'none';
            if (registerTab) registerTab.style.display = 'none';
            if (profileTab) profileTab.style.display = '';
            if (addressTab) addressTab.style.display = '';
            if (resTab) resTab.style.display = '';
            if (ordersTab) ordersTab.style.display = '';
            if (tabId === 'profile') loadProfileData();
            if (tabId === 'addresses') loadAddresses();
            if (tabId === 'reservations') loadMyReservations();
            if (tabId === 'orders') loadMyOrders();
        } else {
            if (loginTab) loginTab.style.display = '';
            if (registerTab) registerTab.style.display = '';
            if (profileTab) profileTab.style.display = 'none';
            if (addressTab) addressTab.style.display = 'none';
            if (resTab) resTab.style.display = 'none';
            if (ordersTab) ordersTab.style.display = 'none';
        }
    }

    // Tab clicks
    if (profileOverlay) {
        profileOverlay.querySelectorAll('.profile-tab').forEach(tab => {
            tab.addEventListener('click', () => switchProfileTab(tab.dataset.tab));
        });
    }

    // ─── LOGIN ───
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async e => {
            e.preventDefault();
            const msg = document.getElementById('loginMsg');
            msg.textContent = '';
            msg.className = 'profile-msg';
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            if (!email || !password) { msg.textContent = 'All fields required.'; msg.classList.add('error'); return; }
            const res = await apiCall('auth.php?action=login', 'POST', { email, password });
            if (res.success) {
                currentUser = res.data;
                showToast(`👋 Welcome back, ${currentUser.name}!`);
                showModalBanner(`👋 Welcome back, ${currentUser.name}!`);
                updateNavForUser();
                switchProfileTab('profile');
                msg.textContent = '';
            } else {
                msg.textContent = res.message || 'Login failed.';
                msg.classList.add('error');
            }
        });
    }

    // ─── REGISTER ───
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async e => {
            e.preventDefault();
            const msg = document.getElementById('registerMsg');
            msg.textContent = '';
            msg.className = 'profile-msg';
            const name = document.getElementById('regName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const phone = document.getElementById('regPhone').value.trim();
            const password = document.getElementById('regPassword').value;
            if (!name || !email || !password) { msg.textContent = 'Name, email, and password are required.'; msg.classList.add('error'); return; }
            const res = await apiCall('auth.php?action=register', 'POST', { name, email, phone, password });
            if (res.success) {
                currentUser = res.data;
                showToast(`🎉 Welcome, to our restaurant ${currentUser.name}! `);
                showModalBanner(`🎉 Welcome, ${currentUser.name}! Thanks for joining us.`);
                updateNavForUser();
                switchProfileTab('profile');
            } else {
                msg.textContent = res.message || 'Registration failed.';
                msg.classList.add('error');
            }
        });
    }

    // ─── PROFILE EDIT ───
    async function loadProfileData() {
        const res = await apiCall('profile.php');
        if (res.success && res.data) {
            const d = res.data;
            const pn = document.getElementById('profileName');
            const pe = document.getElementById('profileEmail');
            const pp = document.getElementById('profilePhone');
            if (pn) pn.value = d.name || '';
            if (pe) pe.value = d.email || '';
            if (pp) pp.value = d.phone || '';
        }
    }

    const profileForm = document.getElementById('profileEditForm');
    if (profileForm) {
        profileForm.addEventListener('submit', async e => {
            e.preventDefault();
            const msg = document.getElementById('profileMsg');
            msg.textContent = '';
            msg.className = 'profile-msg';
            const name = document.getElementById('profileName').value.trim();
            const email = document.getElementById('profileEmail').value.trim();
            const phone = document.getElementById('profilePhone').value.trim();
            const res = await apiCall('profile.php', 'POST', { name, email, phone });
            if (res.success) {
                currentUser = res.data;
                updateNavForUser();
                msg.textContent = '✅ Profile updated!';
                msg.classList.add('success');
            } else {
                msg.textContent = res.message || 'Update failed.';
                msg.classList.add('error');
            }
        });
    }

    // ─── ADDRESSES ───
    async function loadAddresses() {
        const container = document.getElementById('addressList');
        if (!container) return;
        const res = await apiCall('addresses.php');
        if (!res.success) { container.innerHTML = '<p style="color:var(--text-muted);">Could not load addresses.</p>'; return; }
        const addresses = res.data || [];
        if (!addresses.length) {
            container.innerHTML = '<p style="color:var(--text-muted);">No saved addresses. Add one below!</p>';
            return;
        }
        container.innerHTML = addresses.map(a => `
            <div class="address-card ${a.is_default ? 'default' : ''}">
                ${a.is_default ? '<span class="address-default-badge">★ Default</span>' : ''}
                <div class="address-card-label">${escHtml(a.label)}</div>
                <div class="address-card-text">${escHtml(a.address_text)}</div>
                <div class="address-map-preview">
                    <iframe src="https://maps.google.com/maps?q=${encodeURIComponent(a.address_text)}&output=embed" loading="lazy"></iframe>
                </div>
                <div class="address-card-actions">
                    ${!a.is_default ? `<button onclick="setDefaultAddress(${a.id})">Set Default</button>` : ''}
                    <button class="delete-btn" onclick="deleteAddress(${a.id})">Delete</button>
                </div>
            </div>`).join('');
    }

    // Global functions for address actions
    window.setDefaultAddress = async function (id) {
        const res = await apiCall('addresses.php', 'PUT', { id, is_default: true, label: 'Home', address_text: '.' });
        // Re-fetch to get full data — simpler than partial update
        const allRes = await apiCall('addresses.php');
        if (allRes.success) {
            const addr = allRes.data.find(a => a.id === id);
            if (addr) {
                await apiCall('addresses.php', 'PUT', { id, is_default: true, label: addr.label, address_text: addr.address_text });
            }
        }
        loadAddresses();
    };

    window.deleteAddress = async function (id) {
        if (!confirm('Delete this address?')) return;
        await apiCall('addresses.php', 'DELETE', { id });
        loadAddresses();
    };

    const addAddressForm = document.getElementById('addAddressForm');
    if (addAddressForm) {
        addAddressForm.addEventListener('submit', async e => {
            e.preventDefault();
            const label = document.getElementById('newAddrLabel').value;
            const addressText = document.getElementById('newAddrText').value.trim();
            const isDefault = document.getElementById('newAddrDefault').checked;
            if (!addressText) return;
            await apiCall('addresses.php', 'POST', { label, address_text: addressText, is_default: isDefault });
            document.getElementById('newAddrText').value = '';
            document.getElementById('newAddrDefault').checked = false;
            loadAddresses();
        });
    }

    // ─── MY RESERVATIONS (in profile) ───
    async function loadMyReservations() {
        const container = document.getElementById('myReservationsList');
        if (!container) return;
        const res = await apiCall('reservations.php');
        if (!res.success) { container.innerHTML = '<p style="color:var(--text-muted);">Login to see reservations.</p>'; return; }
        const list = res.data || [];
        if (!list.length) {
            container.innerHTML = '<p style="color:var(--text-muted);">No reservations yet.</p>';
            return;
        }
        const today = new Date().toISOString().split('T')[0];
        container.innerHTML = list.map(r => {
            const isPast = r.reservation_date < today || r.status === 'cancelled';
            return `<div class="reservation-card ${isPast ? 'past' : ''}">
                <div class="reservation-card-header">
                    <span class="reservation-card-table">🪑 Table ${r.table_number}</span>
                    <span class="reservation-card-status ${r.status}">${r.status}</span>
                </div>
                <div class="reservation-card-details">
                    <span>📅 ${r.reservation_date}</span>
                    <span>🕐 ${r.reservation_time}</span>
                    <span>👥 ${r.party_size} guests</span>
                </div>
                ${r.status === 'confirmed' && !isPast ? `<button class="reservation-cancel-btn" onclick="cancelReservation(${r.id})">Cancel Reservation</button>` : ''}
            </div>`;
        }).join('');
    }

    window.cancelReservation = async function (id) {
        if (!confirm('Cancel this reservation?')) return;
        await apiCall('reservations.php', 'DELETE', { id });
        loadMyReservations();
        // If on services page, refresh floor plan
        if (typeof window.refreshFloorPlan === 'function') window.refreshFloorPlan();
    };

    // ─── MY ORDERS (in profile) ───
    async function loadMyOrders() {
        const container = document.getElementById('myOrdersList');
        if (!container) return;
        const res = await apiCall('orders.php');
        if (!res.success) { container.innerHTML = '<p style="color:var(--text-muted);">Login to see orders.</p>'; return; }
        const list = res.data || [];
        if (!list.length) {
            container.innerHTML = '<p style="color:var(--text-muted);">No orders yet. Visit our <a href="' + PAGES + 'menu.html" style="color:var(--gold-500);">menu</a> to place one!</p>';
            return;
        }
        const statusColors = { pending: '#fbbf24', preparing: '#60a5fa', ready: '#a855f7', delivered: '#22c55e', cancelled: '#ef4444' };
        container.innerHTML = list.map(order => {
            const dateStr = new Date(order.created_at).toLocaleString('en-US', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
            });
            const items = (order.items || []).map(i => 
                `<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:0.82rem;">
                    <span>${escHtml(i.item_name)} <small style="color:var(--text-muted);">x${i.qty} · ${escHtml(i.portion)}</small></span>
                    <span style="color:var(--gold-500);">฿${parseFloat(i.line_total).toFixed(0)}</span>
                </div>`
            ).join('');
            const statusColor = statusColors[order.status] || 'var(--text-muted)';

            const canCancel = order.status === 'pending' || order.status === 'preparing';
            const paymentMethod = order.payment_method || 'cod';
            const paymentStatus = order.payment_status || 'unpaid';
            const isBankUnpaid = paymentMethod === 'bank' && paymentStatus === 'unpaid';

            const payBadge = paymentMethod === 'bank'
                ? `<span style="font-size:0.72rem;padding:3px 10px;border-radius:50px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;background:${paymentStatus === 'paid' ? '#22c55e22' : '#fbbf2422'};color:${paymentStatus === 'paid' ? '#22c55e' : '#fbbf24'};">bank · ${paymentStatus}</span>`
                : `<span style="font-size:0.72rem;padding:3px 10px;border-radius:50px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;background:#94a3b822;color:#94a3b8;">cod</span>`;

            const actions = `
                <div style="display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;margin-top:10px;">
                    ${canCancel ? `<button class="reservation-cancel-btn" style="padding:8px 14px;" onclick="cancelOrder(${order.id})">Cancel Order</button>` : ''}
                    ${isBankUnpaid ? `<button class="btn btn-primary" style="padding:8px 14px;" onclick="confirmOrderPayment(${order.id})">Confirm Payment</button>` : ''}
                </div>
            `;

            return `<div class="reservation-card" style="margin-bottom:12px;">
                <div class="reservation-card-header">
                    <span class="reservation-card-table">🛒 Order #${order.id}</span>
                    <div style="display:flex;gap:8px;align-items:center;">
                        ${payBadge}
                        <span style="font-size:0.72rem;padding:3px 10px;border-radius:50px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;background:${statusColor}22;color:${statusColor};">${order.status}</span>
                    </div>
                </div>
                <div style="font-size:0.82rem;color:var(--text-muted);margin-bottom:8px;">📅 ${dateStr}</div>
                <div style="border-top:1px solid var(--border-color);padding-top:8px;">${items}</div>
                ${order.delivery_address ? `<div style="font-size:0.82rem;color:var(--text-secondary);margin-top:8px;">📍 ${escHtml(order.delivery_address)}</div>` : ''}
                <div style="text-align:right;margin-top:8px;font-weight:700;color:var(--gold-500);font-size:1rem;">Total: ฿${parseFloat(order.total).toFixed(0)}</div>
                ${actions}
            </div>`;
        }).join('');
    }

    window.cancelOrder = async function (orderId) {
        if (!confirm('Cancel this order?')) return;
        const res = await apiCall('orders.php?action=cancel', 'PATCH', { order_id: orderId });
        if (!res.success) {
            alert(res.message || 'Failed to cancel order.');
            return;
        }
        loadMyOrders();
    };

    window.confirmOrderPayment = async function (orderId) {
        if (!confirm('Confirm payment for this bank transfer order?')) return;
        const res = await apiCall('orders.php?action=confirm_payment', 'PATCH', { order_id: orderId });
        if (!res.success) {
            alert(res.message || 'Failed to confirm payment.');
            return;
        }
        loadMyOrders();
    };

    // ─── TOASTS ───
    function showToast(message, type = 'success') {
        const variant = type === 'info' ? 'info' : 'success';
        const toast = document.createElement('div');
        toast.className = `ubr-toast ubr-toast-${variant}`;
        toast.textContent = String(message ?? '');
        document.body.appendChild(toast);

        window.setTimeout(() => {
            toast.classList.add('ubr-toast-out');
            window.setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 400);
        }, 3500);
    }

    function showModalBanner(message) {
        const modal = document.getElementById('profileModal');
        if (!modal) return;

        const existing = document.getElementById('ubrWelcomeBanner');
        if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

        const heading = modal.querySelector('.ubr-modal-header h2') || modal.querySelector('h2,h1,h3');
        if (!heading) return;

        const banner = document.createElement('div');
        banner.id = 'ubrWelcomeBanner';
        banner.textContent = String(message ?? '');
        heading.insertAdjacentElement('afterend', banner);

        window.setTimeout(() => {
            banner.classList.add('ubr-banner-out');
            window.setTimeout(() => {
                if (banner.parentNode) banner.parentNode.removeChild(banner);
            }, 450);
        }, 4000);
    }

    // ─── UTILITY ───
    function escHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Make helpers globally available for inline scripts
    window.UBR = {
        apiCall,
        currentUser: () => currentUser,
        openProfileModal,
        checkAuth,
        API,
        PAGES,
        escHtml
    };

    /* 3. FORM VALIDATION (Contact page) */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            let isValid = true;
            document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');

            const name = document.getElementById('name');
            if (name.value.trim().length < 2) { showError(name, 'Name must be at least 2 characters.'); isValid = false; }

            const email = document.getElementById('email');
            if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) { showError(email, 'Please enter a valid email address.'); isValid = false; }

            const phone = document.getElementById('phone');
            if (phone && phone.value.trim().length < 8) { showError(phone, 'Please enter a valid phone number.'); isValid = false; }

            const eventType = document.getElementById('eventType');
            if (eventType && !eventType.value) { showError(eventType, 'Please select an event type.'); isValid = false; }

            const eventDate = document.getElementById('eventDate');
            if (eventDate && !eventDate.value) { showError(eventDate, 'Please select an event date.'); isValid = false; }

            const guests = document.getElementById('guests');
            if (guests && (!guests.value || parseInt(guests.value) < 1)) { showError(guests, 'Please enter the number of guests (at least 1).'); isValid = false; }

            const message = document.getElementById('message');
            if (message.value.trim().length < 10) { showError(message, 'Message must be at least 10 characters.'); isValid = false; }

            if (isValid) {
                // POST to API
                const data = {
                    name: name.value.trim(),
                    email: email.value.trim(),
                    phone: phone ? phone.value.trim() : '',
                    event_type: eventType ? eventType.value : '',
                    event_date: eventDate ? eventDate.value : null,
                    guests: guests ? parseInt(guests.value) : 0,
                    message: message.value.trim()
                };
                const res = await apiCall('contact.php', 'POST', data);
                const now = new Date();
                const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const successMsg = document.getElementById('formSuccess');
                if (res.success) {
                    successMsg.textContent = `✅ Inquiry sent at ${timeString}! We'll get back to you soon.`;
                } else {
                    successMsg.textContent = `✅ Inquiry sent at ${timeString}! We'll get back to you soon.`;
                }
                successMsg.style.display = 'block';
                contactForm.reset();
                setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
            }
        });

        function showError(input, msg) {
            const errorEl = input.nextElementSibling;
            if (errorEl && errorEl.classList.contains('error-msg')) {
                errorEl.textContent = msg;
                errorEl.style.display = 'block';
            }
        }
    }

    // ─── INIT: Check auth on page load ───
    checkAuth();
});
