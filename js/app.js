// ==========================================
// MOLIYA VA MIKRO QARZLAR ILovASI - ASOSIY LOGIKA
// ==========================================

// Global Ma'lumotlar Bazasining Dastlabki Holati (State)
const appState = {
  theme: localStorage.getItem('theme') || 'dark',
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

// ==========================================
// YORDAMCHI FUNKSIYALAR (FORMATTERS & TOAST)
// ==========================================

function formatSom(amount) {
  return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm";
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'debt' ? '💳' : (type === 'success' ? '✅' : '🔔');
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================
// MAVZU (DARK / LIGHT MODE)
// ==========================================

function initTheme() {
  const root = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  root.setAttribute('data-theme', appState.theme);

  themeToggleBtn.addEventListener('click', () => {
    appState.theme = appState.theme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', appState.theme);
    localStorage.setItem('theme', appState.theme);
  });
}

// ==========================================
// MODALLAR BOSHQARUVI
// ==========================================

function initModals() {
  const expenseModal = document.getElementById('expenseModal');
  const incomeModal = document.getElementById('incomeModal');
  const debtModal = document.getElementById('debtModal');

  document.getElementById('openExpenseModalBtn').addEventListener('click', () => openModal(expenseModal));
  document.getElementById('openIncomeModalBtn').addEventListener('click', () => openModal(incomeModal));
  document.getElementById('openDebtModalBtn').addEventListener('click', () => openModal(debtModal));
  document.getElementById('bannerAddDebtBtn').addEventListener('click', () => openModal(debtModal));

  // Tashqariga bosganda yopish
  [expenseModal, incomeModal, debtModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAllModals();
      }
    });
  });

  // Esc bosganda yopish
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });
}

function openModal(modal) {
  modal.classList.add('active');
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
}

// ==========================================
// FORMA HARAKATLARI (SUBMIT HANDLERS)
// ==========================================

function initForms() {
  // 1. Yangi xarajat qo'shish
  document.getElementById('expenseForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const category = document.getElementById('expCategory').value;
    const amount = parseInt(document.getElementById('expAmount').value, 10);
    const note = document.getElementById('expNote').value.trim();

    if (!amount || amount <= 0) return;

    // Balans va xarajatni yangilash
    appState.monthlyExpense += amount;
    appState.balance -= amount;
    appState.categories[category] = (appState.categories[category] || 0) + amount;

    // Tranzaksiya qo'shish
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
  // Qarzni topish
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

  renderAll();
  showToast(`${debt.person} uchun ${formatSom(payAmount)} to'landi va xarajatlarga kiritildi!`, 'debt');
};

// ==========================================
// UI NI CHIZISH (RENDER)
// ==========================================

function renderAll() {
  // 1. Yuqori ko'rsatkichlar
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

  // 3. Mikro qarzlar ro'yxatini chiqarish
  renderDebts();

  // 4. Tranzaksiyalar ro'yxatini chiqarish
  renderTransactions();
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
            <span style="font-size: 0.8rem; color: var(--color-income); font-weight: 700;">Yopildi ✓</span>
          `}
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

// Tranzaksiya filtrlari tablari
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
// INTERAKTIV KALKULYATOR LOGIKASI
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

// Kalkulyatordan xarajatga to'g'ridan-to'g'ri o'tkazish
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
