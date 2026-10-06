// ==========================================
// MOLIYA VA MIKRO QARZLAR ILOVASI - ASOSIY LOGIKA
// ==========================================

// Boshlang'ich andoza ma'lumotlar (agar kesh bo'sh bo'lsa)
const defaultState = {
  theme: 'dark',
  balance: 3840000,
  monthlyIncome: 6500000,
  monthlyExpense: 2660000,
  activeDebtTotal: 450000,
  categories: {
    food: 1120000,
    taxi: 640000,
    transport: 300000,
    debt: 400000,
    other: 200000
  },
  debts: [
    {
      id: 1,
      person: "Akmalbek (Do'stim)",
      avatar: "A",
      note: "Tushlik uchun olingan mikro qarz",
      dueDate: "10-Oktabr",
      totalAmount: 150000,
      paidAmount: 0,
      status: "Kutilmoqda"
    },
    {
      id: 2,
      person: "Mahalla do'koni",
      avatar: "M",
      note: "Oziq-ovqat mahsulotlari uchun",
      dueDate: "15-Oktabr",
      totalAmount: 500000,
      paidAmount: 200000,
      status: "Qisman to'langan"
    }
  ],
  transactions: [
    {
      id: 101,
      type: "debt",
      title: "Mikro qarz to'lovi: Dilshod",
      tag: "Qarz to'lovi",
      time: "Bugun, 12:40 • Kartadan to'landi",
      amount: -400000,
      icon: "💳",
      color: "var(--color-debt)",
      bg: "rgba(245, 158, 11, 0.15)"
    },
    {
      id: 102,
      type: "expense",
      title: "Yandex Go (Ishdan uyga)",
      tag: "Taksi",
      time: "Bugun, 09:15 • Naqd",
      amount: -35000,
      icon: "🚕",
      color: "var(--color-taxi)",
      bg: "rgba(6, 182, 212, 0.15)"
    },
    {
      id: 103,
      type: "expense",
      title: "Tushlik (Milliy taomlar)",
      tag: "Ovqatlanish",
      time: "Kecha, 13:20 • Payme",
      amount: -65000,
      icon: "🍔",
      color: "var(--color-food)",
      bg: "rgba(249, 115, 22, 0.15)"
    },
    {
      id: 104,
      type: "income",
      title: "Oylik asosiy maosh",
      tag: "Oylik tushum",
      time: "01-Oktabr, 10:00 • Plastik karta",
      amount: 6500000,
      icon: "💰",
      color: "var(--color-income)",
      bg: "rgba(16, 185, 129, 0.15)"
    },
    {
      id: 105,
      type: "expense",
      title: "ATTO karta to'ldirish",
      tag: "Yo'l haqi",
      time: "30-Sentabr, 18:00 • Click",
      amount: -50000,
      icon: "🚌",
      color: "var(--color-transport)",
      bg: "rgba(59, 130, 246, 0.15)"
    }
  ]
};

// Global App State
let appState = loadState();

// Chiqindi qutisi (Korzina) ma'lumotlari
let appTrash = loadTrash();

// ==========================================
// LOCAL STORAGE FUNKSIYALARI
// ==========================================

function loadState() {
  const saved = localStorage.getItem('finance_app_state');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Local storage load error:", e);
    }
  }
  return JSON.parse(JSON.stringify(defaultState));
}

function saveState() {
  localStorage.setItem('finance_app_state', JSON.stringify(appState));
}

function loadTrash() {
  const saved = localStorage.getItem('finance_app_trash');
  let trash = [];
  if (saved) {
    try {
      trash = JSON.parse(saved);
    } catch (e) {
      console.error("Trash load error:", e);
    }
  }

  // 1 hafta (7 kun) o'tgan eski elementlarni avtomatik o'chirish (Auto-delete)
  const now = Date.now();
  const cleanedTrash = trash.filter(item => item.expiresAt > now);
  if (cleanedTrash.length !== trash.length) {
    localStorage.setItem('finance_app_trash', JSON.stringify(cleanedTrash));
  }
  return cleanedTrash;
}

function saveTrash() {
  localStorage.setItem('finance_app_trash', JSON.stringify(appTrash));
  updateTrashBadge();
}

function updateTrashBadge() {
  const badge = document.getElementById('trashCountBadge');
  if (badge) {
    badge.textContent = appTrash.length;
  }
}

// 7 kun qolgan vaqtni hisoblash
function getRemainingDaysStr(expiresAt) {
  const diff = expiresAt - Date.now();
  if (diff <= 0) return "Muddati tugagan";
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  if (days > 0) {
    return `${days} kun qoldi`;
  }
  return `${hours} soat qoldi`;
}

// ==========================================
// YORDAMCHI FORMATTER VA XABARNOMALAR
// ==========================================

function formatSom(amount) {
  return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm";
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'debt' ? '💳' : (type === 'danger' ? '⚠️' : (type === 'success' ? '✅' : '🔔'));
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================
// MAVZU (DARK / LIGHT)
// ==========================================

function initTheme() {
  const root = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('theme') || appState.theme || 'dark';
  
  root.setAttribute('data-theme', savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', newTheme);
    appState.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    saveState();
  });
}

// ==========================================
// MODALLAR BOSHQARUVI
// ==========================================

function initModals() {
  const expenseModal = document.getElementById('expenseModal');
  const incomeModal = document.getElementById('incomeModal');
  const debtModal = document.getElementById('debtModal');
  const resetConfirmModal = document.getElementById('resetConfirmModal');
  const trashModal = document.getElementById('trashModal');

  document.getElementById('openExpenseModalBtn').addEventListener('click', () => openModal(expenseModal));
  document.getElementById('openIncomeModalBtn').addEventListener('click', () => openModal(incomeModal));
  document.getElementById('openDebtModalBtn').addEventListener('click', () => openModal(debtModal));
  document.getElementById('bannerAddDebtBtn').addEventListener('click', () => openModal(debtModal));
  
  // Statistikani 0 ga tushirish tugmasi
  document.getElementById('openResetModalBtn').addEventListener('click', () => openModal(resetConfirmModal));

  // Korzina tugmasi
  document.getElementById('openTrashModalBtn').addEventListener('click', () => {
    renderTrash();
    openModal(trashModal);
  });

  // Korzinani tozalash tugmasi
  document.getElementById('emptyTrashBtn').addEventListener('click', () => {
    if (appTrash.length === 0) {
      showToast("Chiqindi qutisi allaqachon bo'sh!");
      return;
    }
    appTrash = [];
    saveTrash();
    renderTrash();
    showToast("Chiqindi qutisi butunlay tozalandi!");
  });

  // 0 ga tushirishni tasdiqlash
  document.getElementById('confirmResetBtn').addEventListener('click', handleResetStatistics);

  // Tashqariga bosilganda yopish
  [expenseModal, incomeModal, debtModal, resetConfirmModal, trashModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAllModals();
      });
    }
  });

  // Esc klavishi
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });
}

function openModal(modal) {
  if (modal) modal.classList.add('active');
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
}

// ==========================================
// STATISTIKALARNI 0 GA TUSHIRISH (RESET)
// Barcha ma'lumotlar Chiqindi qutisiga ko'chiriladi va 1 hafta saqlanadi
// ==========================================

function handleResetStatistics() {
  // 1. Mavjud ma'lumotlar to'plami nusxasini (Snapshot) Chiqindi qutisiga saqlash
  const snapshot = {
    id: Date.now(),
    type: 'session_reset',
    title: "To'liq statistika va hisob-kitoblar arxivi",
    deletedAt: Date.now(),
    expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 1 hafta (7 kun)
    dateStr: new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
    data: {
      balance: appState.balance,
      monthlyIncome: appState.monthlyIncome,
      monthlyExpense: appState.monthlyExpense,
      activeDebtTotal: appState.activeDebtTotal,
      categories: { ...appState.categories },
      debts: [...appState.debts],
      transactions: [...appState.transactions]
    }
  };

  appTrash.unshift(snapshot);
  saveTrash();

  // 2. Barcha statistikalarni 0 ga tushirish
  appState.balance = 0;
  appState.monthlyIncome = 0;
  appState.monthlyExpense = 0;
  appState.activeDebtTotal = 0;
  appState.categories = {
    food: 0,
    taxi: 0,
    transport: 0,
    debt: 0,
    other: 0
  };
  appState.debts = [];
  appState.transactions = [];

  saveState();
  closeAllModals();
  renderAll();

  showToast("Barcha statistika 0 ga tushirildi va Chiqindi qutisiga ko'chirildi (1 hafta saqlanadi)!", 'danger');
}

// ==========================================
// CHIQINDI QUTISI (KORZINA) BOSHQARUVI
// ==========================================

function renderTrash() {
  const container = document.getElementById('trashListContainer');
  updateTrashBadge();

  // Eskirganlarni tozalash
  const now = Date.now();
  appTrash = appTrash.filter(item => item.expiresAt > now);
  saveTrash();

  if (appTrash.length === 0) {
    container.innerHTML = `
      <div class="empty-trash-box">
        <div style="font-size: 2.2rem; margin-bottom: 8px;">🗑️</div>
        Chiqindi qutisi bo'sh. Hech qanday o'chirilgan ma'lumot yo'q.
      </div>
    `;
    return;
  }

  container.innerHTML = appTrash.map(item => {
    const timeLeft = getRemainingDaysStr(item.expiresAt);

    if (item.type === 'session_reset') {
      const d = item.data;
      return `
        <div class="trash-card">
          <div class="trash-card-header">
            <div class="trash-card-title">
              <span>📁</span>
              <span>${item.title}</span>
            </div>
            <span class="trash-timer">⏳ ${timeLeft}</span>
          </div>
          <div class="trash-details">
            <div><strong>O'chirilgan vaqt:</strong> ${item.dateStr}</div>
            <div><strong>Balans:</strong> ${formatSom(d.balance)} • <strong>Tushum:</strong> ${formatSom(d.monthlyIncome)} • <strong>Xarajat:</strong> ${formatSom(d.monthlyExpense)}</div>
            <div><strong>Mikro qarzlar:</strong> ${d.debts.length} ta • <strong>Amaliyotlar tarixi:</strong> ${d.transactions.length} ta yozuv</div>
          </div>
          <div class="trash-card-footer">
            <button class="btn btn-sm btn-restore" onclick="restoreTrashItem(${item.id})">
              ↩️ Qayta tiklash
            </button>
            <button class="btn btn-sm btn-delete-perm" onclick="deleteTrashPerm(${item.id})">
              🗑️ Butunlay o'chirish
            </button>
          </div>
        </div>
      `;
    } else if (item.type === 'debt') {
      return `
        <div class="trash-card">
          <div class="trash-card-header">
            <div class="trash-card-title">
              <span>💳</span>
              <span>Mikro qarz: ${item.data.person}</span>
            </div>
            <span class="trash-timer">⏳ ${timeLeft}</span>
          </div>
          <div class="trash-details">
            <div><strong>Summa:</strong> ${formatSom(item.data.totalAmount)} (${item.data.note})</div>
          </div>
          <div class="trash-card-footer">
            <button class="btn btn-sm btn-restore" onclick="restoreTrashItem(${item.id})">
              ↩️ Qayta tiklash
            </button>
            <button class="btn btn-sm btn-delete-perm" onclick="deleteTrashPerm(${item.id})">
              🗑️ Butunlay o'chirish
            </button>
          </div>
        </div>
      `;
    } else if (item.type === 'transaction') {
      return `
        <div class="trash-card">
          <div class="trash-card-header">
            <div class="trash-card-title">
              <span>📝</span>
              <span>${item.data.title}</span>
            </div>
            <span class="trash-timer">⏳ ${timeLeft}</span>
          </div>
          <div class="trash-details">
            <div><strong>Summa:</strong> ${formatSom(item.data.amount)} (${item.data.tag})</div>
          </div>
          <div class="trash-card-footer">
            <button class="btn btn-sm btn-restore" onclick="restoreTrashItem(${item.id})">
              ↩️ Qayta tiklash
            </button>
            <button class="btn btn-sm btn-delete-perm" onclick="deleteTrashPerm(${item.id})">
              🗑️ Butunlay o'chirish
            </button>
          </div>
        </div>
      `;
    }
  }).join('');
}

// Qayta tiklash (Restore)
window.restoreTrashItem = function(id) {
  const index = appTrash.findIndex(item => item.id === id);
  if (index === -1) return;

  const item = appTrash[index];

  if (item.type === 'session_reset') {
    appState = { ...item.data, theme: appState.theme };
    saveState();
  } else if (item.type === 'debt') {
    appState.debts.unshift(item.data);
    const rem = item.data.totalAmount - item.data.paidAmount;
    if (rem > 0) appState.activeDebtTotal += rem;
    saveState();
  } else if (item.type === 'transaction') {
    appState.transactions.unshift(item.data);
    saveState();
  }

  appTrash.splice(index, 1);
  saveTrash();
  renderTrash();
  renderAll();
  showToast("Ma'lumotlar muvaffaqiyatli qayta tiklandi!", 'success');
};

// Butunlay o'chirish (Delete Permanently)
window.deleteTrashPerm = function(id) {
  appTrash = appTrash.filter(item => item.id !== id);
  saveTrash();
  renderTrash();
  showToast("Ma'lumot butunlay o'chirildi!");
};

// Qarzni alohida Chiqindiga o'chirish
window.deleteSingleDebt = function(debtId) {
  const index = appState.debts.findIndex(d => d.id === debtId);
  if (index === -1) return;

  const debt = appState.debts[index];
  const remaining = debt.totalAmount - debt.paidAmount;

  // Korzinaga ko'chirish
  appTrash.unshift({
    id: Date.now(),
    type: 'debt',
    title: `Mikro qarz: ${debt.person}`,
    deletedAt: Date.now(),
    expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000),
    data: debt
  });
  saveTrash();

  if (remaining > 0) {
    appState.activeDebtTotal -= remaining;
    if (appState.activeDebtTotal < 0) appState.activeDebtTotal = 0;
  }
  appState.debts.splice(index, 1);
  saveState();
  renderAll();
  showToast(`${debt.person} qarzi Chiqindi qutisiga ko'chirildi (1 hafta saqlanadi)!`, 'danger');
};

// ==========================================
// FORMA HARAKATLARI (SUBMIT HANDLERS)
// ==========================================

function initForms() {
  // 1. Yangi xarajat kiritish
  document.getElementById('expenseForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const category = document.getElementById('expCategory').value;
    const amount = parseInt(document.getElementById('expAmount').value, 10);
    const note = document.getElementById('expNote').value.trim();

    if (!amount || amount <= 0) return;

    appState.monthlyExpense += amount;
    appState.balance -= amount;
    appState.categories[category] = (appState.categories[category] || 0) + amount;

    const catMap = {
      food: { tag: "Ovqatlanish", icon: "🍔", color: "var(--color-food)", bg: "rgba(249, 115, 22, 0.15)" },
      taxi: { tag: "Taksi", icon: "🚕", color: "var(--color-taxi)", bg: "rgba(6, 182, 212, 0.15)" },
      transport: { tag: "Yo'l haqi", icon: "🚌", color: "var(--color-transport)", bg: "rgba(59, 130, 246, 0.15)" },
      other: { tag: "Boshqa", icon: "🛍️", color: "var(--color-other)", bg: "rgba(168, 85, 247, 0.15)" }
    };

    const catData = catMap[category] || catMap.other;

    appState.transactions.unshift({
      id: Date.now(),
      type: "expense",
      title: note,
      tag: catData.tag,
      time: "Hozir • Naqd/Karta",
      amount: -amount,
      icon: catData.icon,
      color: catData.color,
      bg: catData.bg
    });

    saveState();
    closeAllModals();
    document.getElementById('expenseForm').reset();
    renderAll();
    showToast(`${formatSom(amount)} ${catData.tag} xarajatiga saqlandi!`);
  });

  // 2. Oylik tushum qo'shish
  document.getElementById('incomeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = parseInt(document.getElementById('incAmount').value, 10);
    const source = document.getElementById('incSource').value.trim();

    if (!amount || amount <= 0) return;

    appState.monthlyIncome += amount;
    appState.balance += amount;

    appState.transactions.unshift({
      id: Date.now(),
      type: "income",
      title: source,
      tag: "Oylik tushum",
      time: "Hozir • Hisobga qo'shildi",
      amount: amount,
      icon: "💰",
      color: "var(--color-income)",
      bg: "rgba(16, 185, 129, 0.15)"
    });

    saveState();
    closeAllModals();
    document.getElementById('incomeForm').reset();
    renderAll();
    showToast(`${formatSom(amount)} tushum hisobingizga qo'shildi!`);
  });

  // 3. Mikro qarz qo'shish
  document.getElementById('debtForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const person = document.getElementById('debtPerson').value.trim();
    const amount = parseInt(document.getElementById('debtAmount').value, 10);
    const reason = document.getElementById('debtReason').value.trim();
    const dueDateVal = document.getElementById('debtDueDate').value;

    if (!amount || amount <= 0) return;

    const formattedDate = dueDateVal ? dueDateVal : "Muddatsiz";

    appState.activeDebtTotal += amount;
    appState.debts.unshift({
      id: Date.now(),
      person: person,
      avatar: person.charAt(0).toUpperCase() || "Q",
      note: reason,
      dueDate: formattedDate,
      totalAmount: amount,
      paidAmount: 0,
      status: "Kutilmoqda"
    });

    saveState();
    closeAllModals();
    document.getElementById('debtForm').reset();
    renderAll();
    showToast(`${person} dan ${formatSom(amount)} mikro qarz ro'yxatga olindi!`, 'debt');
  });
}

// ==========================================
// ASOSIY FUNKSIYA: "TO'LOV QILDIM" BOSILGANDA
// Qarz xarajatlarga to'lov bo'lib chiqadi!
// ==========================================

window.handleQuickPay = function(personName, amount) {
  const debt = appState.debts.find(d => d.person === personName);
  if (!debt) return;

  const remaining = debt.totalAmount - debt.paidAmount;
  const payAmount = Math.min(amount, remaining);

  if (payAmount <= 0) {
    showToast("Ushbu qarz allaqachon to'liq to'langan!");
    return;
  }

  // 1. Qarz qoldig'ini kamaytirish
  debt.paidAmount += payAmount;
  appState.activeDebtTotal -= payAmount;
  if (appState.activeDebtTotal < 0) appState.activeDebtTotal = 0;

  if (debt.paidAmount >= debt.totalAmount) {
    debt.status = "To'liq yopildi";
  } else {
    debt.status = "Qisman to'langan";
  }

  // 2. Balansdan ayirish va umumiy xarajatga qo'shish
  appState.balance -= payAmount;
  appState.monthlyExpense += payAmount;
  appState.categories.debt = (appState.categories.debt || 0) + payAmount;

  // 3. Xarajatlar ro'yxatiga mikro qarz to'lovi sifatida yangi tranzaksiya yozish!
  appState.transactions.unshift({
    id: Date.now(),
    type: "debt",
    title: `Mikro qarz to'lovi: ${debt.person}`,
    tag: "Qarz to'lovi",
    time: `Hozir • To'lov qilindi`,
    amount: -payAmount,
    icon: "💳",
    color: "var(--color-debt)",
    bg: "rgba(245, 158, 11, 0.15)"
  });

  saveState();
  renderAll();
  showToast(`${debt.person} uchun ${formatSom(payAmount)} to'landi va xarajatlarga kiritildi!`, 'debt');
};

// ==========================================
// UI NI CHIZISH (RENDER)
// ==========================================

function renderAll() {
  // 1. Yuqori kartochkalar
  document.getElementById('balanceDisplay').textContent = formatSom(appState.balance);
  document.getElementById('totalIncomeDisplay').textContent = formatSom(appState.monthlyIncome);
  document.getElementById('totalExpenseDisplay').textContent = formatSom(appState.monthlyExpense);
  document.getElementById('totalDebtDisplay').textContent = formatSom(appState.activeDebtTotal);

  // 2. Kategoriya kartochkalari
  document.getElementById('sumFood').textContent = formatSom(appState.categories.food);
  document.getElementById('sumTaxi').textContent = formatSom(appState.categories.taxi);
  document.getElementById('sumTransport').textContent = formatSom(appState.categories.transport);
  document.getElementById('sumDebtPaid').textContent = formatSom(appState.categories.debt);
  document.getElementById('sumOther').textContent = formatSom(appState.categories.other);

  // Foizlarni hisoblash
  const totalExp = appState.monthlyExpense || 1;
  const foodPct = Math.round((appState.categories.food / totalExp) * 100) || 0;
  const taxiPct = Math.round((appState.categories.taxi / totalExp) * 100) || 0;
  const transportPct = Math.round((appState.categories.transport / totalExp) * 100) || 0;
  const debtPct = Math.round((appState.categories.debt / totalExp) * 100) || 0;
  const otherPct = Math.round((appState.categories.other / totalExp) * 100) || 0;

  // Kategoriya progress barlarini dinamik yangilash
  const foodCard = document.querySelector('.category-card.cat-food');
  if (foodCard) {
    foodCard.querySelector('.pill-badge').textContent = `${foodPct}%`;
    foodCard.querySelector('.cat-progress-bar').style.width = `${foodPct}%`;
  }
  const taxiCard = document.querySelector('.category-card.cat-taxi');
  if (taxiCard) {
    taxiCard.querySelector('.pill-badge').textContent = `${taxiPct}%`;
    taxiCard.querySelector('.cat-progress-bar').style.width = `${taxiPct}%`;
  }
  const transportCard = document.querySelector('.category-card.cat-transport');
  if (transportCard) {
    transportCard.querySelector('.pill-badge').textContent = `${transportPct}%`;
    transportCard.querySelector('.cat-progress-bar').style.width = `${transportPct}%`;
  }
  const debtCard = document.querySelector('.category-card.cat-debt');
  if (debtCard) {
    debtCard.querySelector('.pill-badge').textContent = `${debtPct}%`;
    debtCard.querySelector('.cat-progress-bar').style.width = `${debtPct}%`;
  }
  const otherCard = document.querySelector('.category-card.cat-other');
  if (otherCard) {
    otherCard.querySelector('.pill-badge').textContent = `${otherPct}%`;
    otherCard.querySelector('.cat-progress-bar').style.width = `${otherPct}%`;
  }

  // 3. Mikro qarzlar ro'yxati
  renderDebts();

  // 4. Tranzaksiyalar ro'yxati
  renderTransactions();

  // 5. Korzina badge
  updateTrashBadge();
}

function renderDebts() {
  const container = document.getElementById('debtListContainer');
  const countBadge = document.getElementById('activeDebtCount');
  
  const activeDebts = appState.debts.filter(d => d.paidAmount < d.totalAmount);
  countBadge.textContent = `${activeDebts.length} ta faol qarz`;

  if (appState.debts.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 24px; color: var(--text-muted);">Qarzlar mavjud emas 🎉</div>`;
    return;
  }

  container.innerHTML = appState.debts.map(debt => {
    const remaining = debt.totalAmount - debt.paidAmount;
    const isPaid = remaining <= 0;
    
    return `
      <div class="debt-card" style="${isPaid ? 'opacity: 0.6;' : ''}">
        <div class="debt-avatar">${debt.avatar}</div>
        <div class="debt-meta">
          <div class="debt-person">
            ${debt.person}
            <span class="pill-badge" style="${isPaid ? 'color: var(--color-income);' : ''}">${debt.status}</span>
          </div>
          <div class="debt-note">${debt.note} • Muddat: ${debt.dueDate}</div>
        </div>
        <div class="debt-figures">
          <div class="debt-remain" style="${isPaid ? 'color: var(--color-income);' : ''}">${isPaid ? '0 so\'m' : formatSom(remaining)}</div>
          <div class="debt-total-sub">Jami: ${formatSom(debt.totalAmount)} ${debt.paidAmount > 0 ? `(${formatSom(debt.paidAmount)} to'langan)` : ''}</div>
        </div>
        <div class="debt-actions">
          ${!isPaid ? `
            <button class="btn-pay" onclick="handleQuickPay('${debt.person.replace(/'/g, "\\'")}', ${remaining})">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              To'lov qildim
            </button>
          ` : `
            <span style="font-size: 0.8rem; color: var(--color-income); font-weight: 700; align-self: center;">Yopildi ✓</span>
          `}
          <button class="btn-sm" style="color: #fb7185; border-color: rgba(244,63,94,0.3); padding: 8px 10px;" onclick="deleteSingleDebt(${debt.id})" title="Chiqindiga tashlash">
            🗑️
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function renderTransactions(filter = 'all') {
  const container = document.getElementById('transactionList');
  
  let filtered = appState.transactions;
  if (filter === 'expense') {
    filtered = appState.transactions.filter(t => t.type === 'expense');
  } else if (filter === 'income') {
    filtered = appState.transactions.filter(t => t.type === 'income');
  } else if (filter === 'debt') {
    filtered = appState.transactions.filter(t => t.type === 'debt');
  }

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 20px; color: var(--text-muted);">Ushbu toifada amaliyotlar topilmadi</div>`;
    return;
  }

  container.innerHTML = filtered.map(tx => {
    const isIncome = tx.amount > 0;
    const amountFormatted = (isIncome ? '+' : '') + formatSom(tx.amount);
    const amountClass = tx.type === 'income' ? 'income' : (tx.type === 'debt' ? 'debt-payment' : 'expense');

    return `
      <div class="tx-row" data-type="${tx.type}">
        <div class="tx-icon" style="background: ${tx.bg}; color: ${tx.color};">${tx.icon}</div>
        <div class="tx-details">
          <div class="tx-title">
            ${tx.title}
            <span class="tx-category-tag">${tx.tag}</span>
          </div>
          <div class="tx-time">${tx.time}</div>
        </div>
        <div class="tx-amount ${amountClass}">${amountFormatted}</div>
      </div>
    `;
  }).join('');
}

function initFilters() {
  const filterTabs = document.querySelectorAll('#txFilterTabs .tab-btn');
  filterTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      filterTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTransactions(btn.getAttribute('data-filter'));
    });
  });
}

// ==========================================
// KALKULYATOR LOGIKASI
// ==========================================

let calcMemory = '';
let calcCurrentVal = '0';
let calcWaitingForOperand = false;

window.calcNum = function(num) {
  if (calcWaitingForOperand) {
    calcCurrentVal = num;
    calcWaitingForOperand = false;
  } else {
    calcCurrentVal = calcCurrentVal === '0' ? num : calcCurrentVal + num;
  }
  updateCalcDisplay();
};

window.calcDot = function() {
  if (calcWaitingForOperand) {
    calcCurrentVal = '0.';
    calcWaitingForOperand = false;
  } else if (!calcCurrentVal.includes('.')) {
    calcCurrentVal += '.';
  }
  updateCalcDisplay();
};

window.calcOp = function(op) {
  calcMemory = `${calcCurrentVal} ${op}`;
  calcWaitingForOperand = true;
  updateCalcDisplay();
};

window.calcEquals = function() {
  if (!calcMemory) return;
  try {
    const expression = `${calcMemory} ${calcCurrentVal}`.replace(/×/g, '*').replace(/÷/g, '/');
    const result = Function(`'use strict'; return (${expression})`)();
    calcMemory = '';
    calcCurrentVal = String(Math.round(result));
    calcWaitingForOperand = true;
  } catch (e) {
    calcCurrentVal = 'Xato';
  }
  updateCalcDisplay();
};

window.calcClear = function() {
  calcCurrentVal = '0';
  calcMemory = '';
  calcWaitingForOperand = false;
  updateCalcDisplay();
};

window.calcBackspace = function() {
  if (calcCurrentVal.length > 1) {
    calcCurrentVal = calcCurrentVal.slice(0, -1);
  } else {
    calcCurrentVal = '0';
  }
  updateCalcDisplay();
};

function updateCalcDisplay() {
  document.getElementById('calcCurrent').textContent = calcCurrentVal;
  document.getElementById('calcPrev').textContent = calcMemory;
}

window.applyCalcToExpense = function(category) {
  const val = parseInt(calcCurrentVal, 10);
  if (!val || isNaN(val) || val <= 0) {
    showToast("Kalkulyatorda to'g'ri summa hisoblang!", 'debt');
    return;
  }

  const expModal = document.getElementById('expenseModal');
  document.getElementById('expCategory').value = category;
  document.getElementById('expAmount').value = val;
  document.getElementById('expNote').value = category === 'food' ? "Tushlik xarajati" : "Taksi yo'l haqi";
  
  openModal(expModal);
};

// Scroll to calculator
document.getElementById('scrollToCalcBtn').addEventListener('click', () => {
  document.getElementById('calculatorWidget').scrollIntoView({ behavior: 'smooth' });
});

// ==========================================
// ILOVANI ISHGA TUSHIRISH
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initModals();
  initForms();
  initFilters();
  renderAll();
});
