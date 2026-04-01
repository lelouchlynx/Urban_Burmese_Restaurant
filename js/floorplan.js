/* ═══════════════════════════════════════════════════
   FLOOR PLAN – Table Selection & Reservation Logic
   ═══════════════════════════════════════════════════ */
(function () {
    const API = '../api/';
    let selectedTable = null;
    let reservedTables = [];

    // Set default date to today
    const dateInput = document.getElementById('fpDate');
    const timeSelect = document.getElementById('fpTime');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.setAttribute('min', today);

    // ─── FETCH TABLE AVAILABILITY ───
    async function fetchAvailability() {
        const date = dateInput.value;
        const time = timeSelect.value;
        if (!date || !time) return;
        try {
            const res = await fetch(`${API}reservations.php?date=${date}&time=${time}`, { credentials: 'same-origin' });
            const data = await res.json();
            if (data.success) {
                reservedTables = data.data.map(r => r.table_number);
            } else {
                reservedTables = [];
            }
        } catch (e) { reservedTables = []; }
        renderTableStates();
    }

    // ─── RENDER TABLE STATES ───
    function renderTableStates() {
        document.querySelectorAll('.floor-table').forEach(g => {
            const tableNum = parseInt(g.dataset.table);
            const mainShape = g.querySelector('rect, circle');
            // Reset
            g.classList.remove('reserved');
            if (reservedTables.includes(tableNum)) {
                // Reserved - dark red
                g.classList.add('reserved');
                if (mainShape.tagName === 'circle') {
                    mainShape.setAttribute('fill', '#8b1a1a');
                    mainShape.setAttribute('stroke', '#6b1a1a');
                } else {
                    mainShape.setAttribute('fill', '#8b1a1a');
                    mainShape.setAttribute('stroke', '#6b1a1a');
                }
            } else if (selectedTable === tableNum) {
                // Selected - green
                if (mainShape.tagName === 'circle') {
                    mainShape.setAttribute('fill', '#22c55e');
                    mainShape.setAttribute('stroke', '#16a34a');
                } else {
                    mainShape.setAttribute('fill', '#22c55e');
                    mainShape.setAttribute('stroke', '#16a34a');
                }
            } else {
                // Available - gold
                mainShape.setAttribute('fill', '#eab308');
                mainShape.setAttribute('stroke', '#a16207');
            }
        });
    }

    // ─── TABLE CLICK ───
    document.querySelectorAll('.floor-table').forEach(g => {
        g.addEventListener('click', () => {
            const tableNum = parseInt(g.dataset.table);
            if (reservedTables.includes(tableNum)) return; // can't select reserved
            selectedTable = tableNum;
            renderTableStates();
            showResForm(tableNum, parseInt(g.dataset.seats));
        });

        // Tooltip
        g.addEventListener('mouseenter', (e) => {
            const tooltip = document.getElementById('tableTooltip');
            const tableNum = g.dataset.table;
            const seats = g.dataset.seats;
            const isReserved = reservedTables.includes(parseInt(tableNum));
            tooltip.innerHTML = `<strong>Table ${tableNum}</strong> · ${seats} seats${isReserved ? ' · <span style="color:#ef4444;">Reserved</span>' : ' · <span style="color:#22c55e;">Available</span>'}`;
            tooltip.classList.add('visible');
            const container = document.getElementById('floorPlanContainer');
            const rect = container.getBoundingClientRect();
            const gRect = g.getBoundingClientRect();
            tooltip.style.left = (gRect.left - rect.left + gRect.width / 2) + 'px';
            tooltip.style.top = (gRect.top - rect.top - 40) + 'px';
            tooltip.style.transform = 'translateX(-50%)';
        });
        g.addEventListener('mouseleave', () => {
            document.getElementById('tableTooltip').classList.remove('visible');
        });
    });

    // ─── SHOW RESERVATION FORM ───
    function showResForm(tableNum, seats) {
        const panel = document.getElementById('resFormPanel');
        panel.classList.add('open');
        document.getElementById('resFormTitle').textContent = `Reserve Table #${tableNum} (${seats} seats)`;
        document.getElementById('resPartySize').max = seats;
        document.getElementById('resPartySize').value = Math.min(2, seats);
        document.getElementById('resMsg').textContent = '';

        // Pre-fill if logged in
        const user = window.UBR ? window.UBR.currentUser() : null;
        if (user) {
            document.getElementById('resName').value = user.name || '';
            document.getElementById('resEmail').value = user.email || '';
            document.getElementById('resPhone').value = user.phone || '';
        }

        // Hide confirmation
        document.getElementById('resConfirmation').classList.remove('show');

        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // ─── SUBMIT RESERVATION ───
    const resForm = document.getElementById('reservationForm');
    if (resForm) {
        resForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const msg = document.getElementById('resMsg');
            msg.textContent = '';
            msg.className = 'profile-msg';

            if (!selectedTable) { msg.textContent = 'Please select a table first.'; msg.classList.add('error'); return; }

            const data = {
                guest_name: document.getElementById('resName').value.trim(),
                guest_email: document.getElementById('resEmail').value.trim(),
                guest_phone: document.getElementById('resPhone').value.trim(),
                table_number: selectedTable,
                party_size: parseInt(document.getElementById('resPartySize').value),
                reservation_date: dateInput.value,
                reservation_time: timeSelect.value,
                special_requests: document.getElementById('resSpecial').value.trim()
            };

            if (!data.guest_name || !data.guest_email) {
                msg.textContent = 'Name and email are required.'; msg.classList.add('error'); return;
            }

            try {
                const res = await fetch(API + 'reservations.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'same-origin',
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                if (result.success) {
                    // Show confirmation
                    const confirm = document.getElementById('resConfirmation');
                    document.getElementById('confirmDetails').innerHTML = `
                        <div class="detail"><div class="detail-label">Table</div><div class="detail-value">#${data.table_number}</div></div>
                        <div class="detail"><div class="detail-label">Date</div><div class="detail-value">${data.reservation_date}</div></div>
                        <div class="detail"><div class="detail-label">Time</div><div class="detail-value">${data.reservation_time}</div></div>
                        <div class="detail"><div class="detail-label">Party Size</div><div class="detail-value">${data.party_size} guests</div></div>
                        <div class="detail"><div class="detail-label">Guest</div><div class="detail-value">${data.guest_name}</div></div>`;
                    confirm.classList.add('show');
                    document.getElementById('resFormPanel').classList.remove('open');
                    resForm.reset();

                    // Update floor plan
                    reservedTables.push(selectedTable);
                    selectedTable = null;
                    renderTableStates();
                    confirm.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    msg.textContent = result.message || 'Reservation failed.';
                    msg.classList.add('error');
                }
            } catch (err) {
                msg.textContent = 'Network error. Please try again.';
                msg.classList.add('error');
            }
        });
    }

    // ─── DATE/TIME CHANGE → RE-FETCH ───
    dateInput.addEventListener('change', () => { selectedTable = null; fetchAvailability(); document.getElementById('resFormPanel').classList.remove('open'); });
    timeSelect.addEventListener('change', () => { selectedTable = null; fetchAvailability(); document.getElementById('resFormPanel').classList.remove('open'); });

    // ─── GLOBAL REFRESH FUNCTION (used by profile modal cancel) ───
    window.refreshFloorPlan = fetchAvailability;

    // ─── INIT ───
    fetchAvailability();
})();
