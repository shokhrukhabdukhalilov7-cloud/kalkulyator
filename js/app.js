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
  customCategoryName: "Nomsiz xarajat",
  categories: {
    social: 400000,     // 1. Ijtimoiy tarmoq obunalari (I)
    food: 920000,       // 2. Ovqatlanish (O)
    debt: 400000,       // 3. Qarz to'lovlari (Q)
    taxi: 540000,       // 4. Taxi xizmati (T)
    transport: 200000,  // 5. Yo'l haqi (Y)
    custom: 200000      // 6. Nomsiz / Maxsus (Ohirida)
  },
  workIncomes: [
    {
      id: 1,
      startDate: "2026-10-05",
      endDate: "2026-10-11",
      amount: 3200000,
      totalHours: 42,
      ordersCount: 48,
      workDays: ["2026-10-05", "2026-10-06", "2026-10-07", "2026-10-08", "2026-10-09"],
      restDays: ["2026-10-10", "2026-10-11"],
      workDaysCount: 5,
      restDaysCount: 2,
      note: "5 kun ishlangan, 2 kun dam"
    },
    {
      id: 2,
      startDate: "2026-09-28",
      endDate: "2026-10-04",
      amount: 3800000,
      totalHours: 50,
      ordersCount: 56,
      workDays: ["2026-09-28", "2026-09-29", "2026-09-30", "2026-10-01", "2026-10-02", "2026-10-03"],
      restDays: ["2026-10-04"],
      workDaysCount: 6,
      restDaysCount: 1,
      note: "Faol hafta, 6 kun ish"
    }
  ],
  debts: [
    {
      id: 1,
      direction: 'lent',
      paymentMethod: 'card',
      person: "Akmalbek (Do'stim)",
      avatar: "A",
      date: "2026-10-06",
      note: "Tushlik va yo'l kira uchun",
      dueDate: "12-Oktabr",
      totalAmount: 150000,
      paidAmount: 0,
      status: "Kutilmoqda"
    },
    {
      id: 2,
      direction: 'lent',
      paymentMethod: 'cash',
      person: "Anvar aka (Qarindosh)",
      avatar: "A",
      date: "2026-10-05",
      note: "",
      dueDate: "15-Oktabr",
      totalAmount: 300000,
      paidAmount: 0,
      status: "Kutilmoqda"
    },
    {
      id: 3,
      direction: 'borrowed',
      paymentMethod: 'cash',
      person: "Mahalla do'koni",
      avatar: "M",
      date: "2026-10-04",
      note: "Oziq-ovqat mahsulotlari",
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
      title: "Telegram Premium & YouTube",
      tag: "Ijtimoiy tarmoq",
      time: "Bugun, 10:15 • Kartadan to'landi",
      amount: -120000,
      icon: "📱",
      color: "#a855f7",
      bg: "rgba(168, 85, 247, 0.15)"
    },
    {
      id: 103,
      type: "expense",
      title: "Yandex Go (Ishdan uyga)",
      tag: "Taxi xizmati",
      time: "Bugun, 09:15 • Naqd",
      amount: -35000,
      icon: "🚕",
      color: "var(--color-taxi)",
      bg: "rgba(6, 182, 212, 0.15)"
    },
    {
      id: 104,
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
      id: 105,
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
      id: 106,
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
      const parsed = JSON.parse(saved);
      // Agar yangi kategoriyalar bo'lmasa, andozadan to'ldirish
      if (!parsed.categories || !parsed.categories.social) {
        parsed.categories = { ...defaultState.categories, ...parsed.categories };
      }
      if (!parsed.customCategoryName) {
        parsed.customCategoryName = defaultState.customCategoryName;
      }
      if (!parsed.workIncomes) {
        parsed.workIncomes = JSON.parse(JSON.stringify(defaultState.workIncomes));
      } else {
        parsed.workIncomes = parsed.workIncomes.map(w => {
          if (!w.startDate && w.date) {
            const d = new Date(w.date);
            const day = d.getDay();
            const diff = day === 0 ? -6 : 1 - day;
            const mon = new Date(d);
            mon.setDate(d.getDate() + diff);
            const sun = new Date(mon);
            sun.setDate(mon.getDate() + 6);
            const toIso = dt => dt.toISOString().split('T')[0];
            return {
              id: w.id || Date.now(),
              startDate: toIso(mon),
              endDate: toIso(sun),
              amount: w.amount || 0,
              totalHours: 9,
              ordersCount: w.ordersCount || 0,
              workDays: [w.date],
              restDays: [],
              workDaysCount: 1,
              restDaysCount: 6,
              note: w.note || "Kunlik yozuvdan ko'chirildi"
            };
          }
          if (w.workDays && !w.workDaysCount) {
            w.workDaysCount = w.workDays.length;
            w.restDaysCount = 7 - w.workDaysCount;
          }
          return w;
        });
      }
      if (parsed.debts) {
        parsed.debts.forEach(d => {
          if (!d.paymentMethod) d.paymentMethod = (d.direction === 'lent' ? 'card' : 'cash');
        });
      }
      return parsed;
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
  const drawerBadge = document.getElementById('drawerTrashCountBadge');
  if (drawerBadge) {
    drawerBadge.textContent = appTrash.length;
  }
}

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
  return new Intl.NumberFormat('uz-UZ').format(amount || 0) + " so'm";
}

// O'zbekcha sana formati: Kun, Oy, Yil (masalan: 09-Oktabr, 2026-yil)
function formatDateUz(dateStr) {
  if (!dateStr || dateStr === "Ko'rsatilmagan" || dateStr === "Muddatsiz") return dateStr || "Ko'rsatilmagan";
  
  const monthsUz = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
  ];
  for (const mName of monthsUz) {
    if (dateStr.includes(mName)) return dateStr;
  }

  const parts = dateStr.split(/[-/.]/);
  if (parts.length === 3) {
    let y, m, d;
    if (parts[0].length === 4) {
      // YYYY-MM-DD
      y = parts[0];
      m = parseInt(parts[1], 10);
      d = parts[2].padStart(2, '0');
    } else if (parts[2].length === 4) {
      // DD-MM-YYYY
      d = parts[0].padStart(2, '0');
      m = parseInt(parts[1], 10);
      y = parts[2];
    } else {
      return dateStr;
    }

    if (m >= 1 && m <= 12) {
      const monthName = monthsUz[m - 1];
      return `${d}-${monthName}, ${y}-yil`;
    }
  }
  return dateStr;
}

// Ish davomiyligini hisoblash (Boshlanish va Tugash soatlaridan)
function calculateWorkDuration(startTime, endTime) {
  if (!startTime || !endTime) return '9 soat';
  const sParts = startTime.split(':').map(Number);
  const eParts = endTime.split(':').map(Number);
  if (sParts.length < 2 || eParts.length < 2) return '';

  let startMinutes = sParts[0] * 60 + sParts[1];
  let endMinutes = eParts[0] * 60 + eParts[1];
  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60; // Tungi smena yarim kechadan o'tgan
  }
  const diffMinutes = endMinutes - startMinutes;
  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;
  if (hours === 0 && mins === 0) return '0 daqiqa';
  let res = '';
  if (hours > 0) res += `${hours} soat`;
  if (mins > 0) res += ` ${mins} daq`;
  return res.trim();
}

// Sana kiritish uchun interaktiv yordamchi (Kun, Oy, Yil ko'rsatish va Bugun/Kecha tugmalari)
function setupDateInputEnhancements(dateInputId, hintId, todayBtnId, yesterdayBtnId) {
  const dateInput = document.getElementById(dateInputId);
  const hintEl = document.getElementById(hintId);
  const todayBtn = document.getElementById(todayBtnId);
  const yesterdayBtn = document.getElementById(yesterdayBtnId);

  function getTodayStr() {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }

  function getYesterdayStr() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  }

  function updateHint() {
    if (!dateInput || !hintEl) return;
    const val = dateInput.value;
    if (!val) {
      hintEl.textContent = "📅 Sana tanlanmagan";
      return;
    }
    const today = getTodayStr();
    const yesterday = getYesterdayStr();
    const formatted = formatDateUz(val);

    let prefix = "📅 Tanlangan sana: ";
    if (val === today) {
      prefix = "📅 Bugun: ";
      if (todayBtn) todayBtn.classList.add('active');
      if (yesterdayBtn) yesterdayBtn.classList.remove('active');
    } else if (val === yesterday) {
      prefix = "📅 Kecha: ";
      if (yesterdayBtn) yesterdayBtn.classList.add('active');
      if (todayBtn) todayBtn.classList.remove('active');
    } else {
      if (todayBtn) todayBtn.classList.remove('active');
      if (yesterdayBtn) yesterdayBtn.classList.remove('active');
    }

    hintEl.innerHTML = `${prefix}<strong>${formatted}</strong>`;
  }

  if (dateInput) {
    dateInput.addEventListener('input', updateHint);
    dateInput.addEventListener('change', updateHint);
  }

  if (todayBtn && dateInput) {
    todayBtn.addEventListener('click', () => {
      dateInput.value = getTodayStr();
      updateHint();
      triggerHaptic('light');
    });
  }

  if (yesterdayBtn && dateInput) {
    yesterdayBtn.addEventListener('click', () => {
      dateInput.value = getYesterdayStr();
      updateHint();
      triggerHaptic('light');
    });
  }

  updateHint();
  return updateHint;
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

// Vibratsiya / Haptic feedback (iPhone Safari WebKit & Android)
function triggerHaptic(type = 'light') {
  if (!navigator.vibrate) return;
  try {
    if (type === 'light') navigator.vibrate(12);
    else if (type === 'success') navigator.vibrate([15, 60, 15]);
    else if (type === 'warning') navigator.vibrate([30, 80, 40]);
  } catch (e) {
    // navigator.vibrate ruxsatsiz yoki mavjud emas bo'lsa xatolik chiqarmaydi
  }
}

// Brauzer va PWA tema rangini yangilash (iOS Status Bar & Android Navigation Bar)
function updateThemeMeta(theme) {
  const meta = document.getElementById('themeColorMeta') || document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', theme === 'dark' ? '#0a0d14' : '#f8fafc');
  }
}

// Joriy sanani chiroyli ko'rsatish
function initCurrentDate() {
  const dateEl = document.getElementById('dateText');
  if (!dateEl) return;
  const now = new Date();
  const monthsUz = [
    'Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun',
    'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'
  ];
  const day = now.getDate();
  const month = monthsUz[now.getMonth()];
  const year = now.getFullYear();
  dateEl.textContent = `${day}-${month}, ${year}`;
}

// ==========================================
// MAVZU (DARK / LIGHT)
// ==========================================

function initTheme() {
  const root = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('theme') || appState.theme || 'dark';
  
  root.setAttribute('data-theme', savedTheme);
  updateThemeMeta(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const newTheme = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', newTheme);
      appState.theme = newTheme;
      localStorage.setItem('theme', newTheme);
      updateThemeMeta(newTheme);
      triggerHaptic('light');
      saveState();
    });
  }
}

// ==========================================
// MODALLAR BOSHQARUVI
// ==========================================

function initModals() {
  const expenseModal = document.getElementById('expenseModal');
  const incomeModal = document.getElementById('incomeModal');
  const workIncomeModal = document.getElementById('workIncomeModal');
  const debtModal = document.getElementById('debtModal');
  const resetConfirmModal = document.getElementById('resetConfirmModal');
  const trashModal = document.getElementById('trashModal');
  const renameCatModal = document.getElementById('renameCatModal');

  const openExpBtn = document.getElementById('openExpenseModalBtn');
  if (openExpBtn) {
    openExpBtn.addEventListener('click', () => {
      const customGroup = document.getElementById('customCatGroup');
      if (customGroup) customGroup.style.display = 'none';
      openModal(expenseModal);
    });
  }

  // Daromadlar modalini ochish tugmalari
  const openWorkIncomeBtn = document.getElementById('openWorkIncomeModalBtn');
  if (openWorkIncomeBtn) {
    openWorkIncomeBtn.addEventListener('click', () => {
      resetWorkIncomeModal();
      openModal(workIncomeModal);
    });
  }

  const quickAddIncomeBtn = document.getElementById('quickAddIncomeBtn');
  if (quickAddIncomeBtn) {
    quickAddIncomeBtn.addEventListener('click', () => {
      resetWorkIncomeModal();
      openModal(workIncomeModal);
    });
  }

  const heroAddIncomeBtn = document.getElementById('heroAddIncomeBtn');
  if (heroAddIncomeBtn) {
    heroAddIncomeBtn.addEventListener('click', () => {
      resetWorkIncomeModal();
      openModal(workIncomeModal);
    });
  }

  const openIncBtn = document.getElementById('openIncomeModalBtn');
  if (openIncBtn) openIncBtn.addEventListener('click', () => openModal(incomeModal));

  // 3. Qarz berish tugmasi
  const openLendBtn = document.getElementById('openLendModalBtn');
  if (openLendBtn) {
    openLendBtn.addEventListener('click', () => {
      prepareDebtModal('lent');
      openModal(debtModal);
    });
  }

  // 4. Qarz olish tugmasi
  const openBorrowBtn = document.getElementById('openBorrowModalBtn');
  if (openBorrowBtn) {
    openBorrowBtn.addEventListener('click', () => {
      prepareDebtModal('borrowed');
      openModal(debtModal);
    });
  }

  // Bannerdagi qarz berish va olish tugmalari
  const bannerLendBtn = document.getElementById('bannerLendBtn');
  if (bannerLendBtn) {
    bannerLendBtn.addEventListener('click', () => {
      prepareDebtModal('lent');
      openModal(debtModal);
    });
  }

  const bannerBorrowBtn = document.getElementById('bannerBorrowBtn');
  if (bannerBorrowBtn) {
    bannerBorrowBtn.addEventListener('click', () => {
      prepareDebtModal('borrowed');
      openModal(debtModal);
    });
  }

  // Moslik uchun eski tugmalar
  const openDebtBtn = document.getElementById('openDebtModalBtn');
  if (openDebtBtn) {
    openDebtBtn.addEventListener('click', () => {
      prepareDebtModal('lent');
      openModal(debtModal);
    });
  }

  const bannerDebtBtn = document.getElementById('bannerAddDebtBtn');
  if (bannerDebtBtn) bannerDebtBtn.addEventListener('click', () => {
    prepareDebtModal('lent');
    openModal(debtModal);
  });
  
  // Statistikani 0 ga tushirish tugmasi
  const openResetBtn = document.getElementById('openResetModalBtn');
  if (openResetBtn) openResetBtn.addEventListener('click', () => openModal(resetConfirmModal));

  // Korzina tugmasi
  const openTrashBtn = document.getElementById('openTrashModalBtn');
  if (openTrashBtn) {
    openTrashBtn.addEventListener('click', () => {
      renderTrash();
      openModal(trashModal);
    });
  }

  // Nomsiz kategoriyani qayta nomlash tugmasi
  const renameBtn = document.getElementById('renameCustomCatBtn');
  if (renameBtn) {
    renameBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('renameInput').value = appState.customCategoryName || "Nomsiz xarajat";
      openModal(renameCatModal);
    });
  }

  // Korzinani tozalash tugmasi
  const emptyTrashBtn = document.getElementById('emptyTrashBtn');
  if (emptyTrashBtn) {
    emptyTrashBtn.addEventListener('click', () => {
      if (appTrash.length === 0) {
        showToast("Chiqindi qutisi allaqachon bo'sh!");
        return;
      }
      appTrash = [];
      saveTrash();
      renderTrash();
      showToast("Chiqindi qutisi butunlay tozalandi!");
    });
  }

  // 0 ga tushirishni tasdiqlash
  const confirmResetBtn = document.getElementById('confirmResetBtn');
  if (confirmResetBtn) confirmResetBtn.addEventListener('click', handleResetStatistics);

  // Tashqariga bosilganda yopish
  const aboutAppModal = document.getElementById('aboutAppModal');
  [expenseModal, incomeModal, workIncomeModal, debtModal, resetConfirmModal, trashModal, renameCatModal, aboutAppModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAllModals();
      });
    }
  });

  // Esc klavishi
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (typeof closeDrawer === 'function') closeDrawer();
      closeAllModals();
    }
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
      cumulativeEarnings: appState.cumulativeEarnings || 0,
      customCategoryName: appState.customCategoryName,
      categories: { ...appState.categories },
      debts: [...appState.debts],
      transactions: [...appState.transactions],
      workIncomes: [...(appState.workIncomes || [])]
    }
  };

  appTrash.unshift(snapshot);
  saveTrash();

  // Barcha statistikalarni 0 ga tushirish
  appState.balance = 0;
  appState.monthlyIncome = 0;
  appState.monthlyExpense = 0;
  appState.activeDebtTotal = 0;
  appState.cumulativeEarnings = 0;
  appState.categories = {
    social: 0,
    food: 0,
    debt: 0,
    taxi: 0,
    transport: 0,
    custom: 0
  };
  appState.debts = [];
  appState.transactions = [];
  appState.workIncomes = [];

  saveState();
  closeAllModals();
  renderAll();

  triggerHaptic('warning');
  showToast("Barcha statistika 0 ga tushirildi va Chiqindi qutisiga ko'chirildi (1 hafta saqlanadi)!", 'danger');
}

// ==========================================
// CHIQINDI QUTISI (KORZINA) BOSHQARUVI
// ==========================================

function renderTrash() {
  const container = document.getElementById('trashListContainer');
  updateTrashBadge();

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
            <div><strong>Summa:</strong> ${formatSom(item.data.totalAmount)} • <strong>To'lov turi:</strong> ${item.data.paymentMethod === 'card' ? '💳 Karta' : '💵 Naqd'} • <strong>Sana:</strong> ${formatDateUz(item.data.date)}</div>
            ${item.data.note ? `<div><strong>Izoh:</strong> ${item.data.note}</div>` : ''}
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
    } else if (item.type === 'work_income') {
      const d = item.data;
      return `
        <div class="trash-card">
          <div class="trash-card-header">
            <div class="trash-card-title">
              <span>💰</span>
              <span>${item.title}</span>
            </div>
            <span class="trash-timer">⏳ ${timeLeft}</span>
          </div>
          <div class="trash-details">
            <div><strong>Sana:</strong> ${formatDateUz(d.date)} • <strong>Ish vaqti:</strong> ${d.startTime || '--:--'} — ${d.endTime || '--:--'}</div>
            <div><strong>Buyurtmalar:</strong> ${d.ordersCount} ta • <strong>Daromad:</strong> +${formatSom(d.amount)}</div>
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
  } else if (item.type === 'work_income') {
    if (!appState.workIncomes) appState.workIncomes = [];
    appState.workIncomes.unshift(item.data);
    appState.balance += item.data.amount;
    appState.monthlyIncome += item.data.amount;
    saveState();
  } else if (item.type === 'transaction') {
    appState.transactions.unshift(item.data);
    saveState();
  }

  appTrash.splice(index, 1);
  saveTrash();
  renderTrash();
  renderAll();
  triggerHaptic('success');
  showToast("Ma'lumotlar muvaffaqiyatli qayta tiklandi!", 'success');
};

window.deleteTrashPerm = function(id) {
  appTrash = appTrash.filter(item => item.id !== id);
  saveTrash();
  renderTrash();
  triggerHaptic('warning');
  showToast("Ma'lumot butunlay o'chirildi!");
};

window.deleteSingleDebt = function(debtId) {
  const index = appState.debts.findIndex(d => d.id === debtId);
  if (index === -1) return;

  const debt = appState.debts[index];
  const remaining = debt.totalAmount - debt.paidAmount;

  appTrash.unshift({
    id: Date.now(),
    type: 'debt',
    title: `${debt.direction === 'lent' ? 'Yaqinga berilgan pul' : 'Qarz'}: ${debt.person}`,
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
  triggerHaptic('warning');
  showToast(`${debt.person} yozuvi Chiqindi qutisiga ko'chirildi (1 hafta saqlanadi)!`, 'danger');
};

// ==========================================
// FORMA HARAKATLARI (SUBMIT HANDLERS)
// ==========================================

function initForms() {
  const expCategorySelect = document.getElementById('expCategory');
  const customCatGroup = document.getElementById('customCatGroup');
  const customCatNameInput = document.getElementById('customCatNameInput');

  // Kategoriya o'zgarganda Nomsiz maydonini ko'rsatish
  expCategorySelect.addEventListener('change', () => {
    if (expCategorySelect.value === 'custom') {
      customCatGroup.style.display = 'flex';
      customCatNameInput.value = appState.customCategoryName || '';
      customCatNameInput.focus();
    } else {
      customCatGroup.style.display = 'none';
    }
  });

  // 1. Yangi xarajat kiritish
  document.getElementById('expenseForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const category = expCategorySelect.value;
    const amount = parseInt(document.getElementById('expAmount').value, 10);
    const note = document.getElementById('expNote').value.trim();

    if (!amount || amount <= 0) return;

    appState.monthlyExpense += amount;
    appState.balance -= amount;
    appState.categories[category] = (appState.categories[category] || 0) + amount;

    // Kategoriya konfiguratsiyasi (Alifbo bo'yicha)
    let catTag = "Xarajat";
    let catIcon = "🛍️";
    let catColor = "var(--brand-primary)";
    let catBg = "rgba(99, 102, 241, 0.15)";

    if (category === 'social') {
      catTag = "Ijtimoiy tarmoq";
      catIcon = "📱";
      catColor = "#a855f7";
      catBg = "rgba(168, 85, 247, 0.15)";
    } else if (category === 'food') {
      catTag = "Ovqatlanish";
      catIcon = "🍔";
      catColor = "var(--color-food)";
      catBg = "rgba(249, 115, 22, 0.15)";
    } else if (category === 'debt') {
      catTag = "Qarz to'lovi";
      catIcon = "💳";
      catColor = "var(--color-debt)";
      catBg = "rgba(245, 158, 11, 0.15)";
    } else if (category === 'taxi') {
      catTag = "Taxi xizmati";
      catIcon = "🚕";
      catColor = "var(--color-taxi)";
      catBg = "rgba(6, 182, 212, 0.15)";
    } else if (category === 'transport') {
      catTag = "Yo'l haqi";
      catIcon = "🚌";
      catColor = "var(--color-transport)";
      catBg = "rgba(59, 130, 246, 0.15)";
    } else if (category === 'custom') {
      const userCustomName = customCatNameInput.value.trim();
      if (userCustomName) {
        appState.customCategoryName = userCustomName;
      }
      catTag = appState.customCategoryName || "Nomsiz xarajat";
      catIcon = "✏️";
      catColor = "#14b8a6";
      catBg = "rgba(20, 184, 166, 0.15)";
    }

    appState.transactions.unshift({
      id: Date.now(),
      type: "expense",
      title: note,
      tag: catTag,
      time: "Hozir • Naqd/Karta",
      amount: -amount,
      icon: catIcon,
      color: catColor,
      bg: catBg
    });

    saveState();
    closeAllModals();
    document.getElementById('expenseForm').reset();
    customCatGroup.style.display = 'none';
    renderAll();
    triggerHaptic('success');
    showToast(`${formatSom(amount)} ${catTag} xarajatiga saqlandi!`);
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
    triggerHaptic('success');
    showToast(`${formatSom(amount)} tushum hisobingizga qo'shildi!`);
  });

  // 3. Mikro qarz / Yaqinga berilgan pul qo'shish
  setupDebtModalControls();

  document.getElementById('debtForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const direction = document.querySelector('input[name="debtDirection"]:checked')?.value || 'lent';
    const isLent = direction === 'lent';
    const paymentMethod = document.querySelector('input[name="debtPaymentMethod"]:checked')?.value || 'card';
    const person = document.getElementById('debtPerson').value.trim();
    const dateVal = document.getElementById('debtDate').value || new Date().toISOString().split('T')[0];
    const amount = parseInt(document.getElementById('debtAmount').value, 10);
    const reason = document.getElementById('debtReason').value.trim(); // Izoh (majburiy emas)
    const dueDateVal = document.getElementById('debtDueDate').value;
    const affectBalance = document.getElementById('debtAffectBalance')?.checked ?? true;

    if (!person) {
      showToast("Iltimos, ismni kiriting!", 'warning');
      return;
    }

    if (!amount || amount <= 0) {
      showToast("Iltimos, to'g'ri summani kiriting!", 'warning');
      return;
    }

    const formattedDueDate = dueDateVal ? dueDateVal : "Muddatsiz";
    const paymentMethodTitle = paymentMethod === 'card' ? "Plastik karta" : "Naqd pul";
    const methodIcon = paymentMethod === 'card' ? "💳" : "💵";

    if (affectBalance) {
      if (isLent) {
        // Yaqinga pul berildi - balansdan chiqadi
        appState.balance -= amount;
        appState.transactions.unshift({
          id: Date.now(),
          type: "expense",
          title: `Yaqinga pul berildi: ${person}`,
          tag: paymentMethodTitle,
          time: `Bugun • ${paymentMethod === 'card' ? 'Kartadan' : 'Naqd'} berildi`,
          amount: -amount,
          icon: methodIcon,
          color: "var(--color-debt)",
          bg: "rgba(245, 158, 11, 0.15)"
        });
      } else {
        // Qarz olindi - balansga qo'shiladi
        appState.balance += amount;
        appState.transactions.unshift({
          id: Date.now(),
          type: "income",
          title: `Qarz olindi: ${person}`,
          tag: paymentMethodTitle,
          time: `Bugun • ${paymentMethod === 'card' ? 'Kartaga' : 'Naqd'} olindi`,
          amount: amount,
          icon: methodIcon,
          color: "var(--color-income)",
          bg: "rgba(16, 185, 129, 0.15)"
        });
      }
    }

    appState.debts.unshift({
      id: Date.now(),
      direction: direction,
      paymentMethod: paymentMethod,
      person: person,
      avatar: person.charAt(0).toUpperCase() || (isLent ? "Y" : "Q"),
      date: dateVal,
      note: reason, // Izoh ixtiyoriy
      dueDate: formattedDueDate,
      totalAmount: amount,
      paidAmount: 0,
      status: "Kutilmoqda"
    });

    saveState();
    closeAllModals();
    document.getElementById('debtForm').reset();
    prepareDebtModal('lent');
    renderAll();
    triggerHaptic('success');
    if (isLent) {
      showToast(`${person} ga ${formatSom(amount)} (${paymentMethodTitle}) berilgan pul ro'yxatga olindi!`, 'success');
    } else {
      showToast(`${person} dan ${formatSom(amount)} (${paymentMethodTitle}) qarz ro'yxatga olindi!`, 'debt');
    }
  });

  // 4. Nomsiz kategoriyani qayta nomlash
  const renameForm = document.getElementById('renameCatForm');
  if (renameForm) {
    renameForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newName = document.getElementById('renameInput').value.trim();
      if (!newName) return;
      appState.customCategoryName = newName;
      saveState();
      closeAllModals();
      renderAll();
      triggerHaptic('success');
      showToast(`Kategoriya nomi "${newName}" ga o'zgartirildi!`);
    });
  }

  // 5. Ish faoliyati va daromad formasi
  initWorkIncomeForm();
}

// ==========================================
// QARZ & YAQINLARGA BERILGAN PULLAR BOSHQARUVI
// ==========================================

let currentDebtFilter = 'all';

function setDebtPaymentMethod(method = 'card') {
  const cardOpt = document.getElementById('debtMethodCardOption');
  const cashOpt = document.getElementById('debtMethodCashOption');
  const cardRadio = document.querySelector('input[name="debtPaymentMethod"][value="card"]');
  const cashRadio = document.querySelector('input[name="debtPaymentMethod"][value="cash"]');

  if (method === 'card') {
    if (cardOpt) cardOpt.classList.add('active');
    if (cashOpt) cashOpt.classList.remove('active');
    if (cardRadio) cardRadio.checked = true;
  } else {
    if (cashOpt) cashOpt.classList.add('active');
    if (cardOpt) cardOpt.classList.remove('active');
    if (cashRadio) cashRadio.checked = true;
  }
  updateDebtBalanceLabel();
}

function updateDebtBalanceLabel() {
  const direction = document.querySelector('input[name="debtDirection"]:checked')?.value || 'lent';
  const method = document.querySelector('input[name="debtPaymentMethod"]:checked')?.value || 'card';
  const balanceLabel = document.getElementById('debtAffectBalanceLabel');
  if (!balanceLabel) return;

  const methodText = method === 'card' ? 'plastik kartadan' : 'naqd puldan';
  const methodInText = method === 'card' ? 'plastik kartaga' : 'naqd pulga';

  if (direction === 'lent') {
    balanceLabel.textContent = `Joriy balansdan yechilsin (${methodText} pul berildi)`;
  } else {
    balanceLabel.textContent = `Joriy balansga qo'shilsin (${methodInText} pul olindi)`;
  }
}

function updateDebtDueDateHint() {
  const dueInput = document.getElementById('debtDueDate');
  const dueHint = document.getElementById('debtDueDateDisplayHint');
  if (!dueInput || !dueHint) return;
  if (dueInput.value) {
    dueHint.style.display = 'flex';
    dueHint.innerHTML = `⏳ Qaytarish va'dasi: <strong>${formatDateUz(dueInput.value)}</strong>`;
  } else {
    dueHint.style.display = 'none';
  }
}

function updateDebtModalType(type) {
  const lentOption = document.getElementById('debtTypeLentOption');
  const borrowedOption = document.getElementById('debtTypeBorrowedOption');
  const personLabel = document.getElementById('debtPersonLabel');
  const dateLabel = document.getElementById('debtDateLabel');
  const paymentMethodLabel = document.getElementById('debtPaymentMethodLabel');
  const personInput = document.getElementById('debtPerson');
  const submitBtn = document.getElementById('debtSubmitBtn');
  const modalTitle = document.getElementById('debtModalTitleText');

  if (type === 'lent') {
    if (modalTitle) modalTitle.textContent = "🤝 Yaqinimga Qarz Berish";
    if (lentOption) lentOption.classList.add('active');
    if (borrowedOption) borrowedOption.classList.remove('active');
    const radio = document.querySelector('input[name="debtDirection"][value="lent"]');
    if (radio) radio.checked = true;
    if (personLabel) personLabel.textContent = "Kimga berildi (Ismi):";
    if (personInput) personInput.placeholder = "Masalan: Sardor, Akmalbek, Tog'am...";
    if (dateLabel) dateLabel.textContent = "Berilgan sana (Kun, Oy, Yil):";
    if (paymentMethodLabel) paymentMethodLabel.textContent = "Berish puli turi (Karta yoki Naqd):";
    if (submitBtn) submitBtn.textContent = "Yozib qo'yish";
  } else {
    if (modalTitle) modalTitle.textContent = "📥 Qarz Olish";
    if (borrowedOption) borrowedOption.classList.add('active');
    if (lentOption) lentOption.classList.remove('active');
    const radio = document.querySelector('input[name="debtDirection"][value="borrowed"]');
    if (radio) radio.checked = true;
    if (personLabel) personLabel.textContent = "Kimdan olindi (Ismi yoki Do'kon):";
    if (personInput) personInput.placeholder = "Masalan: Mahalla do'koni, Akmal...";
    if (dateLabel) dateLabel.textContent = "Olingan sana (Kun, Oy, Yil):";
    if (paymentMethodLabel) paymentMethodLabel.textContent = "Qarz olingan shakl (Karta yoki Naqd):";
    if (submitBtn) submitBtn.textContent = "Qarzni saqlash";
  }
  updateDebtBalanceLabel();
}

function prepareDebtModal(defaultType = 'lent') {
  const dateInput = document.getElementById('debtDate');
  if (dateInput && !dateInput.value) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }
  updateDebtModalType(defaultType);
  setDebtPaymentMethod('card');
  const updateHint = setupDateInputEnhancements('debtDate', 'debtDateDisplayHint', 'debtDateTodayBtn', 'debtDateYesterdayBtn');
  if (updateHint) updateHint();
  updateDebtDueDateHint();
}

function setupDebtModalControls() {
  const lentOption = document.getElementById('debtTypeLentOption');
  const borrowedOption = document.getElementById('debtTypeBorrowedOption');
  const cardOption = document.getElementById('debtMethodCardOption');
  const cashOption = document.getElementById('debtMethodCashOption');

  if (lentOption) {
    lentOption.addEventListener('click', () => {
      updateDebtModalType('lent');
      triggerHaptic('light');
    });
  }
  if (borrowedOption) {
    borrowedOption.addEventListener('click', () => {
      updateDebtModalType('borrowed');
      triggerHaptic('light');
    });
  }
  if (cardOption) {
    cardOption.addEventListener('click', () => {
      setDebtPaymentMethod('card');
      triggerHaptic('light');
    });
  }
  if (cashOption) {
    cashOption.addEventListener('click', () => {
      setDebtPaymentMethod('cash');
      triggerHaptic('light');
    });
  }

  setupDateInputEnhancements('debtDate', 'debtDateDisplayHint', 'debtDateTodayBtn', 'debtDateYesterdayBtn');

  const dueInput = document.getElementById('debtDueDate');
  if (dueInput) {
    dueInput.addEventListener('input', updateDebtDueDateHint);
    dueInput.addEventListener('change', updateDebtDueDateHint);
  }
}

// Nomsiz xarajatga tezkor o'tish
window.openExpenseForCustom = function() {
  const expModal = document.getElementById('expenseModal');
  const expCategorySelect = document.getElementById('expCategory');
  const customCatGroup = document.getElementById('customCatGroup');
  const customCatNameInput = document.getElementById('customCatNameInput');

  expCategorySelect.value = 'custom';
  customCatGroup.style.display = 'flex';
  customCatNameInput.value = appState.customCategoryName || '';
  openModal(expModal);
  document.getElementById('expAmount').focus();
};

// 1. Yaqin kishi pulni qaytarganda (Lent -> Repaid)
window.handleReceiveRepayment = function(debtId) {
  const debt = appState.debts.find(d => d.id === debtId);
  if (!debt) return;

  const remaining = debt.totalAmount - debt.paidAmount;
  if (remaining <= 0) {
    showToast("Ushbu summa allaqachon to'liq qaytarilgan!");
    return;
  }

  debt.paidAmount = debt.totalAmount;
  debt.status = "To'liq qaytarildi";

  // Balansga qaytgan pul qo'shiladi
  appState.balance += remaining;
  appState.monthlyIncome += remaining;

  appState.transactions.unshift({
    id: Date.now(),
    type: "income",
    title: `Qarz qaytarildi: ${debt.person}`,
    tag: "Qaytarilgan pul",
    time: `Hozir • Qaytarildi`,
    amount: remaining,
    icon: "🤝",
    color: "var(--color-income)",
    bg: "rgba(16, 185, 129, 0.15)"
  });

  saveState();
  renderAll();
  triggerHaptic('success');
  showToast(`${debt.person} ${formatSom(remaining)} pulni qaytardi! Balansga qo'shildi.`, 'success');
};

// 2. Olingan qarz to'langanda (Borrowed -> Paid)
window.handleQuickPay = function(identifier, amount) {
  let debt;
  if (typeof identifier === 'number') {
    debt = appState.debts.find(d => d.id === identifier);
  } else {
    debt = appState.debts.find(d => d.person === identifier);
  }
  if (!debt) return;

  const remaining = debt.totalAmount - debt.paidAmount;
  const payAmount = amount ? Math.min(amount, remaining) : remaining;

  if (payAmount <= 0) {
    showToast("Ushbu qarz allaqachon to'liq to'langan!");
    return;
  }

  debt.paidAmount += payAmount;
  if (debt.paidAmount >= debt.totalAmount) {
    debt.status = "To'liq yopildi";
  } else {
    debt.status = "Qisman to'langan";
  }

  appState.balance -= payAmount;
  appState.monthlyExpense += payAmount;
  appState.categories.debt = (appState.categories.debt || 0) + payAmount;

  appState.transactions.unshift({
    id: Date.now(),
    type: "debt",
    title: `Qarz to'lovi: ${debt.person}`,
    tag: "Qarz to'lovi",
    time: `Hozir • To'lov qilindi`,
    amount: -payAmount,
    icon: "💳",
    color: "var(--color-debt)",
    bg: "rgba(245, 158, 11, 0.15)"
  });

  saveState();
  renderAll();
  triggerHaptic('success');
  showToast(`${debt.person} uchun ${formatSom(payAmount)} to'landi va xarajatlarga kiritildi!`, 'debt');
};

// ==========================================
// DAROMADLAR VA BAJARILGAN BUYURTMALAR LOGIKASI (HAFTALIK HISOBOT & KALENDAR)
// ==========================================

const UZ_MONTH_NAMES = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
];

// Dushanba sanasini hisoblash
function getMondayDate(dateInput) {
  let d;
  if (!dateInput) {
    d = new Date();
  } else if (typeof dateInput === 'string') {
    const parts = dateInput.split('-').map(Number);
    if (parts.length === 3) {
      d = new Date(parts[0], parts[1] - 1, parts[2]);
    } else {
      d = new Date(dateInput);
    }
  } else {
    d = new Date(dateInput);
  }
  const day = d.getDay(); // 0: Yakshanba, 1: Dushanba ... 6: Shanba
  const diff = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diff);
  return d;
}

function toIsoDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getWeek7Days(mondayDate) {
  const dayNames = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba", "Yakshanba"];
  const dayShorts = ["Du", "Se", "Cho", "Pay", "Ju", "Sha", "Ya"];
  const list = [];
  for (let i = 0; i < 7; i++) {
    const cur = new Date(mondayDate);
    cur.setDate(mondayDate.getDate() + i);
    list.push({
      dateStr: toIsoDate(cur),
      dayName: dayNames[i],
      dayShort: dayShorts[i],
      dayNum: cur.getDate(),
      monthNum: cur.getMonth() + 1,
      index: i
    });
  }
  return list;
}

// 7.09.2026 dan oldingi haftalar ko'rsatilmaydi
const MIN_WORK_INCOME_DATE = '2026-09-07';

// Modalda tanlangan ish kunlari to'plami
let modalWorkDays = new Set();

// Hafta farqini hisoblash (Joriy haftaga nisbatan nechta hafta oldin/keyin)
function getWeekOffset(mondayInput) {
  const curMon = getMondayDate(new Date());
  const targetMon = getMondayDate(mondayInput);
  const t1 = new Date(curMon.getFullYear(), curMon.getMonth(), curMon.getDate()).getTime();
  const t2 = new Date(targetMon.getFullYear(), targetMon.getMonth(), targetMon.getDate()).getTime();
  const diffDays = Math.round((t1 - t2) / (1000 * 60 * 60 * 24));
  return Math.round(diffDays / 7);
}

// Nisbiy hafta matni (badge uchun)
function getWeekRelativeText(offset) {
  if (offset === 0) return "📌 Joriy hafta";
  if (offset === 1) return "⏪ 1 hafta oldin (o'tgan hafta)";
  if (offset > 1) return `⏪ ${offset} hafta oldin`;
  if (offset === -1) return "⏩ Keyingi hafta";
  return `⏩ ${Math.abs(offset)} hafta keyin`;
}

// 7-Sentabrdan bugungacha bo'lgan haftalar tezkor chipslari
function renderQuickWeeksChips(activeMondayStr) {
  const container = document.getElementById('quickWeeksChipsContainer');
  if (!container) return;

  const curMon = getMondayDate(new Date());
  const activeMonStr = toIsoDate(getMondayDate(activeMondayStr));

  // Faqat 7.09.2026 dan joriy haftagacha bo'lgan haftalar
  const chipsList = [];
  let d = new Date(curMon);
  let offset = 0;
  while (toIsoDate(d) >= MIN_WORK_INCOME_DATE) {
    chipsList.push({
      mondayStr: toIsoDate(d),
      offset: offset
    });
    d.setDate(d.getDate() - 7);
    offset++;
  }

  const chipsHtml = chipsList.map(item => {
    const mondayStr = item.mondayStr;
    const offset = item.offset;
    const isActive = mondayStr === activeMonStr;

    // Mavjud kiritilgan daromad bormi?
    const existing = (appState.workIncomes || []).find(rec => rec.startDate === mondayStr);

    let label = '';
    if (offset === 0) {
      label = '📌 Joriy';
    } else if (offset === 1) {
      label = '⏪ 1 h. oldin';
    } else {
      label = `⏪ ${offset} h. oldin`;
    }

    const dotHtml = existing ? `<span class="chip-status-dot" title="Saqlangan: +${formatSom(existing.amount)}"></span>` : '';

    return `
      <button type="button" 
        class="quick-week-chip ${isActive ? 'active' : ''} ${existing ? 'has-record' : ''}" 
        onclick="selectWeekDate('${mondayStr}')"
        title="${getWeekRelativeText(offset)} (${formatDateUz(mondayStr)})${existing ? ' — ✅ Saqlangan: +' + formatSom(existing.amount) : ' — 🆕 Kiritilmagan'}">
        ${label} ${dotHtml}
      </button>
    `;
  }).join('');

  container.innerHTML = chipsHtml;

  // Faol chipni avtomatik markazga scroll qilish
  setTimeout(() => {
    const activeChip = container.querySelector('.quick-week-chip.active');
    if (activeChip) {
      activeChip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, 50);
}

// 7-Sentabrdan bugungacha bo'lgan haftalar dropdown ro'yxati
function populatePastWeeksDropdown(activeMondayStr) {
  const select = document.getElementById('workIncomePastWeeksSelect');
  if (!select) return;

  const curMon = getMondayDate(new Date());
  const activeMonStr = toIsoDate(getMondayDate(activeMondayStr));
  let options = `<option value="">📋 7-Sentabrdan bugungacha bo'lgan haftalar ro'yxati...</option>`;

  let d = new Date(curMon);
  let offset = 0;
  while (toIsoDate(d) >= MIN_WORK_INCOME_DATE) {
    const mondayStr = toIsoDate(d);
    const sunday = new Date(d);
    sunday.setDate(d.getDate() + 6);
    const sundayStr = toIsoDate(sunday);

    const existing = (appState.workIncomes || []).find(item => item.startDate === mondayStr);
    const relText = offset === 0 ? "📌 Joriy hafta" : (offset === 1 ? "⏪ 1 hafta oldin" : `⏪ ${offset} hafta oldin`);
    const statusText = existing ? `[✅ Saqlangan: +${formatSom(existing.amount)}]` : `[🆕 Kiritilmagan]`;

    const isSel = mondayStr === activeMonStr ? 'selected' : '';
    options += `<option value="${mondayStr}" ${isSel}>${relText} • (${formatDateUz(mondayStr)} — ${formatDateUz(sundayStr)}) ${statusText}</option>`;

    d.setDate(d.getDate() - 7);
    offset++;
  }

  select.innerHTML = options;
  select.value = activeMonStr;
}

// Hafta sanasini tanlash va forma holatini moslash
window.selectWeekDate = function(mondayInput, preserveData = false) {
  const dateInput = document.getElementById('workIncomeWeekDate');
  let baseMonday = getMondayDate(mondayInput);
  let mondayStr = toIsoDate(baseMonday);

  const curMon = getMondayDate(new Date());
  const maxMonStr = toIsoDate(curMon);

  // 7-Sentabr 2026-yildan oldingi haftalarni cheklash
  if (mondayStr < MIN_WORK_INCOME_DATE) {
    mondayStr = MIN_WORK_INCOME_DATE;
    baseMonday = getMondayDate(MIN_WORK_INCOME_DATE);
  } else if (mondayStr > maxMonStr) {
    mondayStr = maxMonStr;
    baseMonday = curMon;
  }

  if (dateInput) {
    dateInput.value = mondayStr;
    dateInput.min = MIN_WORK_INCOME_DATE;
    dateInput.max = maxMonStr;
  }

  // Stepper tugmalarini chegaralarda boshqarish
  const prevWeekBtn = document.getElementById('workIncomePrevWeekBtn');
  const nextWeekBtn = document.getElementById('workIncomeNextWeekBtn');
  if (prevWeekBtn) {
    if (mondayStr <= MIN_WORK_INCOME_DATE) {
      prevWeekBtn.style.opacity = '0.4';
      prevWeekBtn.style.pointerEvents = 'none';
      prevWeekBtn.title = "7-Sentabr 2026-yildan oldingi davrga o'tib bo'lmaydi";
    } else {
      prevWeekBtn.style.opacity = '1';
      prevWeekBtn.style.pointerEvents = 'auto';
      prevWeekBtn.title = "1 hafta orqaga o'tish";
    }
  }
  if (nextWeekBtn) {
    if (mondayStr >= maxMonStr) {
      nextWeekBtn.style.opacity = '0.4';
      nextWeekBtn.style.pointerEvents = 'none';
      nextWeekBtn.title = "Bugungi haftadan keyingi davrga o'tib bo'lmaydi";
    } else {
      nextWeekBtn.style.opacity = '1';
      nextWeekBtn.style.pointerEvents = 'auto';
      nextWeekBtn.title = "1 hafta oldinga o'tish";
    }
  }

  const offset = getWeekOffset(mondayStr);
  const relativeBadge = document.getElementById('workIncomeRelativeBadge');
  const relText = getWeekRelativeText(offset);
  if (relativeBadge) {
    relativeBadge.textContent = relText;
    if (offset === 0) {
      relativeBadge.classList.add('is-current');
    } else {
      relativeBadge.classList.remove('is-current');
    }
  }

  const existingItem = (appState.workIncomes || []).find(i => i.startDate === mondayStr);
  const statusBanner = document.getElementById('workIncomeWeekStatusBanner');
  const statusIcon = document.getElementById('workIncomeStatusIcon');
  const entryStatus = document.getElementById('workIncomeWeekEntryStatus');
  const titleEl = document.getElementById('workIncomeModalTitleText');
  const submitBtn = document.getElementById('workIncomeSubmitBtn');
  const editIdInput = document.getElementById('editWorkIncomeId');

  if (existingItem) {
    if (editIdInput) editIdInput.value = existingItem.id;
    if (titleEl) titleEl.textContent = `Haftalik Daromadni Tahrirlash (${relText})`;
    if (submitBtn) submitBtn.textContent = "💾 O'zgarishlarni saqlash";

    if (statusBanner) {
      statusBanner.classList.add('is-existing');
      statusBanner.classList.remove('is-new');
    }
    if (statusIcon) statusIcon.textContent = "✅";
    if (entryStatus) {
      entryStatus.innerHTML = `<strong>Ushbu haftaga daromad kiritilgan</strong> (+${formatSom(existingItem.amount)}, ${existingItem.ordersCount || 0} ta buyurtma, ${existingItem.totalHours || 0} soat). Tahrirlash rejimida.`;
    }

    if (!preserveData) {
      const amtEl = document.getElementById('workIncomeAmount');
      const hrsEl = document.getElementById('workIncomeHours');
      const ordEl = document.getElementById('workIncomeOrders');
      const noteEl = document.getElementById('workIncomeNote');

      if (amtEl) amtEl.value = existingItem.amount;
      if (hrsEl) hrsEl.value = existingItem.totalHours || 40;
      if (ordEl) ordEl.value = existingItem.ordersCount || 0;
      if (noteEl) noteEl.value = existingItem.note || '';

      modalWorkDays.clear();
      (existingItem.workDays || []).forEach(d => modalWorkDays.add(d));
    }
  } else {
    if (editIdInput) editIdInput.value = '';
    if (titleEl) titleEl.textContent = `Haftalik Daromad Kiritish (${relText})`;
    if (submitBtn) submitBtn.textContent = "💾 Haftalik daromadni saqlash";

    if (statusBanner) {
      statusBanner.classList.add('is-new');
      statusBanner.classList.remove('is-existing');
    }
    if (statusIcon) statusIcon.textContent = "🆕";
    if (entryStatus) {
      entryStatus.textContent = "Ushbu haftaga hali daromad kiritilmagan. Yangi hisobot yaratilmoqda.";
    }

    if (!preserveData) {
      const amtEl = document.getElementById('workIncomeAmount');
      const hrsEl = document.getElementById('workIncomeHours');
      const ordEl = document.getElementById('workIncomeOrders');
      const noteEl = document.getElementById('workIncomeNote');

      if (amtEl) amtEl.value = '';
      if (hrsEl) hrsEl.value = '40';
      if (ordEl) ordEl.value = '';
      if (noteEl) noteEl.value = '';

      // Standart 5 kunlik ish haftasi (Du-Ju)
      const days = getWeek7Days(baseMonday);
      modalWorkDays.clear();
      for (let i = 0; i < 5; i++) {
        if (days[i]) modalWorkDays.add(days[i].dateStr);
      }
    }
  }

  renderQuickWeeksChips(mondayStr);
  populatePastWeeksDropdown(mondayStr);
  renderModalCalendar();
  updateWorkIncomeLivePreview();
};

function renderModalCalendar() {
  const grid = document.getElementById('weeklyCalendarDaysGrid');
  const dateInput = document.getElementById('workIncomeWeekDate');
  const hintEl = document.getElementById('workIncomeWeekRangeHint');
  if (!grid || !dateInput) return;

  const baseMonday = getMondayDate(dateInput.value);
  const mondayStr = toIsoDate(baseMonday);
  
  if (dateInput.value !== mondayStr) {
    dateInput.value = mondayStr;
  }

  const days = getWeek7Days(baseMonday);
  const sunday = days[6];

  if (hintEl) {
    hintEl.innerHTML = `📅 <strong>7 kunlik davr:</strong> ${formatDateUz(mondayStr)} — ${formatDateUz(sunday.dateStr)}`;
  }

  grid.innerHTML = days.map(d => {
    const isWork = modalWorkDays.has(d.dateStr);
    const mName = UZ_MONTH_NAMES[d.monthNum - 1] || '';
    const mShort = mName.slice(0, 3);
    return `
      <div class="cal-day-card ${isWork ? 'is-work' : 'is-rest'}" onclick="toggleModalCalendarDay('${d.dateStr}')" title="${d.dayName} (${d.dateStr}) — ${isWork ? 'Ishlangan' : 'Dam olingan'}">
        <span class="cal-day-name">${d.dayShort}</span>
        <span class="cal-day-date">${d.dayNum}-${mShort}</span>
        <span class="cal-day-badge">${isWork ? '💼 Ish kuni' : '🏖️ Dam kuni'}</span>
      </div>
    `;
  }).join('');

  const workCount = modalWorkDays.size;
  const restCount = 7 - workCount;
  setElText('modalWorkDaysCount', workCount);
  setElText('modalRestDaysCount', restCount);

  updateWorkIncomeLivePreview();
}

window.toggleModalCalendarDay = function(dateStr) {
  if (modalWorkDays.has(dateStr)) {
    modalWorkDays.delete(dateStr);
  } else {
    modalWorkDays.add(dateStr);
  }
  renderModalCalendar();
  triggerHaptic('light');
};

function setModalWorkDaysPreset(count) {
  const dateInput = document.getElementById('workIncomeWeekDate');
  if (!dateInput) return;
  const monday = getMondayDate(dateInput.value);
  const days = getWeek7Days(monday);
  modalWorkDays.clear();
  for (let i = 0; i < count; i++) {
    if (days[i]) modalWorkDays.add(days[i].dateStr);
  }
  renderModalCalendar();
  triggerHaptic('light');
}

function updateWorkIncomeLivePreview() {
  const amountEl = document.getElementById('workIncomeAmount');
  const hoursEl = document.getElementById('workIncomeHours');
  const ordersEl = document.getElementById('workIncomeOrders');

  const amount = Number(amountEl ? amountEl.value : 0) || 0;
  const hours = Number(hoursEl ? hoursEl.value : 0) || 0;
  const orders = Number(ordersEl ? ordersEl.value : 0) || 0;

  const workCount = modalWorkDays.size;
  const restCount = 7 - workCount;

  setElText('liveIncomeTotalSum', formatSom(amount));
  setElText('liveIncomeDaysRatio', `${workCount} kun ish / ${restCount} kun dam`);
  setElText('liveIncomeTotalHours', `${hours} soat`);
  setElText('liveIncomeOrdersCount', `${orders} ta`);

  const hourlyRate = hours > 0 ? Math.round(amount / hours) : 0;
  setElText('liveIncomeHourlyRate', hourlyRate > 0 ? `${formatSom(hourlyRate)}/soat` : "0 so'm/soat");

  const perOrder = orders > 0 ? Math.round(amount / orders) : 0;
  setElText('liveIncomeOrderRate', perOrder > 0 ? `${formatSom(perOrder)}/ta` : "0 so'm/ta");
}

function resetWorkIncomeModal() {
  const form = document.getElementById('workIncomeForm');
  if (form) form.reset();
  const editIdInput = document.getElementById('editWorkIncomeId');
  if (editIdInput) editIdInput.value = '';

  const thisMonday = getMondayDate(new Date());
  selectWeekDate(toIsoDate(thisMonday), false);
}

// Daromadni saqlash (oddiy submit yoki ketma-ket oldingi haftaga o'tish bilan)
function saveCurrentWorkIncome(options = { closeModal: true, stepToPrev: false }) {
  const dateInput = document.getElementById('workIncomeWeekDate');
  if (!dateInput) return false;

  const editId = document.getElementById('editWorkIncomeId').value;
  const monday = getMondayDate(dateInput.value);
  const startDate = toIsoDate(monday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const endDate = toIsoDate(sunday);

  const amount = Number(document.getElementById('workIncomeAmount').value) || 0;
  const totalHours = Number(document.getElementById('workIncomeHours').value) || 0;
  const orders = Number(document.getElementById('workIncomeOrders').value) || 0;
  const note = document.getElementById('workIncomeNote').value.trim();

  if (amount <= 0) {
    showToast("Iltimos, 7 kunda topilgan daromad summasini kiriting!");
    return false;
  }

  const days = getWeek7Days(monday);
  const workDays = [];
  const restDays = [];
  days.forEach(d => {
    if (modalWorkDays.has(d.dateStr)) {
      workDays.push(d.dateStr);
    } else {
      restDays.push(d.dateStr);
    }
  });

  if (editId) {
    const item = (appState.workIncomes || []).find(i => i.id === Number(editId));
    if (item) {
      const diffAmount = amount - (item.amount || 0);
      item.startDate = startDate;
      item.endDate = endDate;
      item.amount = amount;
      item.totalHours = totalHours;
      item.ordersCount = orders;
      item.workDays = workDays;
      item.restDays = restDays;
      item.workDaysCount = workDays.length;
      item.restDaysCount = restDays.length;
      item.note = note;

      appState.balance += diffAmount;
      appState.monthlyIncome += diffAmount;
      if (diffAmount > 0) {
        appState.cumulativeEarnings = (appState.cumulativeEarnings || getCumulativeEarnings()) + diffAmount;
      }
      showToast("Haftalik daromad ma'lumotlari yangilandi!", 'success');
    }
  } else {
    // Agar ushbu sanaga allaqachon yozuv mavjud bo'lsa, uni dublikat qilmasdan yangilash
    const existingIndex = (appState.workIncomes || []).findIndex(i => i.startDate === startDate);
    if (existingIndex !== -1) {
      const item = appState.workIncomes[existingIndex];
      const diffAmount = amount - (item.amount || 0);
      item.startDate = startDate;
      item.endDate = endDate;
      item.amount = amount;
      item.totalHours = totalHours;
      item.ordersCount = orders;
      item.workDays = workDays;
      item.restDays = restDays;
      item.workDaysCount = workDays.length;
      item.restDaysCount = restDays.length;
      item.note = note;

      appState.balance += diffAmount;
      appState.monthlyIncome += diffAmount;
      if (diffAmount > 0) {
        appState.cumulativeEarnings = (appState.cumulativeEarnings || getCumulativeEarnings()) + diffAmount;
      }
      showToast("Mavjud hafta ma'lumotlari yangilandi!", 'success');
    } else {
      const newItem = {
        id: Date.now(),
        startDate,
        endDate,
        amount,
        totalHours,
        ordersCount: orders,
        workDays,
        restDays,
        workDaysCount: workDays.length,
        restDaysCount: restDays.length,
        note,
        createdAt: Date.now()
      };

      if (!appState.workIncomes) appState.workIncomes = [];
      appState.workIncomes.unshift(newItem);

      appState.balance += amount;
      appState.monthlyIncome += amount;
      appState.cumulativeEarnings = (appState.cumulativeEarnings || getCumulativeEarnings()) + amount;

      appState.transactions.unshift({
        id: Date.now() + 1,
        type: 'income',
        title: `Haftalik ish daromadi (${orders} ta buyurtma, ${workDays.length} ish kuni)`,
        tag: 'Haftalik daromad',
        time: `${formatDateUz(startDate)} — ${formatDateUz(endDate)} • ${totalHours} soat`,
        amount: amount,
        icon: '💰',
        color: 'var(--color-income)',
        bg: 'rgba(16, 185, 129, 0.15)'
      });

      showToast(`+${formatSom(amount)} yangi haftalik daromad saqlandi!`, 'success');
    }
  }

  saveState();
  renderAll();
  triggerHaptic('success');

  if (options.stepToPrev) {
    const curMon = getMondayDate(startDate);
    curMon.setDate(curMon.getDate() - 7);
    const prevMonStr = toIsoDate(curMon);
    if (prevMonStr < MIN_WORK_INCOME_DATE) {
      showToast("7-Sentabr 2026-yil eng boshlang'ich hafta hisoblanadi. Undan oldingi davr mavjud emas.", 'info');
      selectWeekDate(MIN_WORK_INCOME_DATE, false);
    } else {
      selectWeekDate(prevMonStr, false);
      showToast(`Oldingi haftaga o'tildi (${formatDateUz(prevMonStr)})`, 'info');
    }
  } else if (options.closeModal) {
    closeAllModals();
    resetWorkIncomeModal();
  }
  return true;
}

function initWorkIncomeForm() {
  const form = document.getElementById('workIncomeForm');
  if (!form) return;

  const dateInput = document.getElementById('workIncomeWeekDate');
  const prevWeekBtn = document.getElementById('workIncomePrevWeekBtn');
  const nextWeekBtn = document.getElementById('workIncomeNextWeekBtn');
  const pastSelect = document.getElementById('workIncomePastWeeksSelect');
  const saveAndPrevBtn = document.getElementById('workIncomeSaveAndPrevBtn');

  const sel5Btn = document.getElementById('calSelect5DaysBtn');
  const sel6Btn = document.getElementById('calSelect6DaysBtn');
  const selAllBtn = document.getElementById('calSelectAllBtn');
  const clearBtn = document.getElementById('calClearAllBtn');
  const autoHoursBtn = document.getElementById('hoursAutoCalcBtn');

  // Stepper: 1 hafta orqaga
  if (prevWeekBtn) {
    prevWeekBtn.addEventListener('click', () => {
      const curMon = getMondayDate(dateInput ? dateInput.value : new Date());
      curMon.setDate(curMon.getDate() - 7);
      const targetStr = toIsoDate(curMon);
      if (targetStr < MIN_WORK_INCOME_DATE) {
        showToast("7-Sentabr 2026-yildan oldingi davrga o'tib bo'lmaydi!", 'warning');
        return;
      }
      selectWeekDate(targetStr);
      triggerHaptic('light');
    });
  }

  // Stepper: 1 hafta oldinga
  if (nextWeekBtn) {
    nextWeekBtn.addEventListener('click', () => {
      const curMon = getMondayDate(dateInput ? dateInput.value : new Date());
      const maxMon = toIsoDate(getMondayDate(new Date()));
      curMon.setDate(curMon.getDate() + 7);
      const targetStr = toIsoDate(curMon);
      if (targetStr > maxMon) {
        showToast("Bugungi kundan keyingi haftaga o'tib bo'lmaydi!", 'warning');
        return;
      }
      selectWeekDate(targetStr);
      triggerHaptic('light');
    });
  }

  // 7-Sentabrdan bugungacha bo'lgan haftalar tanlanganda
  if (pastSelect) {
    pastSelect.addEventListener('change', (e) => {
      if (e.target.value) {
        selectWeekDate(e.target.value);
        triggerHaptic('light');
      }
    });
  }

  // Sana o'zgartirilganda (kalendar picker orqali)
  if (dateInput) {
    dateInput.addEventListener('change', () => {
      let monStr = toIsoDate(getMondayDate(dateInput.value));
      const maxMon = toIsoDate(getMondayDate(new Date()));
      if (monStr < MIN_WORK_INCOME_DATE) {
        monStr = MIN_WORK_INCOME_DATE;
        showToast("Faqat 7-Sentabr 2026-yildan boshlab kiritish mumkin!", 'warning');
      } else if (monStr > maxMon) {
        monStr = maxMon;
        showToast("Bugungi kundan keyingi haftani tanlab bo'lmaydi!", 'warning');
      }
      selectWeekDate(monStr, true);
    });
  }

  // 7 kunlik kalendar preset tugmalari
  if (sel5Btn) sel5Btn.addEventListener('click', () => setModalWorkDaysPreset(5));
  if (sel6Btn) sel6Btn.addEventListener('click', () => setModalWorkDaysPreset(6));
  if (selAllBtn) selAllBtn.addEventListener('click', () => setModalWorkDaysPreset(7));
  if (clearBtn) clearBtn.addEventListener('click', () => setModalWorkDaysPreset(0));

  if (autoHoursBtn) {
    autoHoursBtn.addEventListener('click', () => {
      const hoursInp = document.getElementById('workIncomeHours');
      const calcHours = modalWorkDays.size * 8;
      if (hoursInp) hoursInp.value = calcHours;
      updateWorkIncomeLivePreview();
      triggerHaptic('light');
      showToast(`${modalWorkDays.size} ish kuni uchun 8 soatdan = ${calcHours} soat belgilandi!`);
    });
  }

  // Quick Amount chips
  document.querySelectorAll('.amount-quick-chips button[data-add]').forEach(btn => {
    btn.addEventListener('click', () => {
      const addVal = Number(btn.getAttribute('data-add')) || 0;
      const amtInput = document.getElementById('workIncomeAmount');
      if (amtInput) {
        amtInput.value = (Number(amtInput.value) || 0) + addVal;
        updateWorkIncomeLivePreview();
        triggerHaptic('light');
      }
    });
  });

  // Quick Hours chips
  document.querySelectorAll('.amount-quick-chips button[data-hour]').forEach(btn => {
    btn.addEventListener('click', () => {
      const hVal = Number(btn.getAttribute('data-hour')) || 0;
      const hoursInput = document.getElementById('workIncomeHours');
      if (hoursInput) {
        hoursInput.value = hVal;
        updateWorkIncomeLivePreview();
        triggerHaptic('light');
      }
    });
  });

  ['workIncomeAmount', 'workIncomeHours', 'workIncomeOrders'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', updateWorkIncomeLivePreview);
      el.addEventListener('change', updateWorkIncomeLivePreview);
    }
  });

  // Ketma-ket haftalarni kiritish: Saqlab, oldingi haftaga o'tish
  if (saveAndPrevBtn) {
    saveAndPrevBtn.addEventListener('click', () => {
      saveCurrentWorkIncome({ closeModal: false, stepToPrev: true });
    });
  }

  // Standart saqlash
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    saveCurrentWorkIncome({ closeModal: true, stepToPrev: false });
  });

  // 7-Sentabr 2026 dan oldingi barcha eski yozuvlarni tozalash
  if (appState && appState.workIncomes) {
    appState.workIncomes = appState.workIncomes.filter(i => (i.startDate || '') >= MIN_WORK_INCOME_DATE);
  }

  // Dastlabki yuklashda dropdown va chipslarni darhol to'ldirish
  populatePastWeeksDropdown(toIsoDate(getMondayDate(new Date())));
  renderQuickWeeksChips(toIsoDate(getMondayDate(new Date())));
}

function renderWorkIncomes() {
  const container = document.getElementById('incomesListContainer');
  if (!container) return;

  const curMonStr = toIsoDate(getMondayDate(new Date()));

  // Faqat 7.09.2026 sentabrdan boshlab bugungacha bo'lgan haftalarni ko'rsatish
  const incomes = (appState.workIncomes || []).filter(item => {
    const sDate = item.startDate || '';
    return sDate >= MIN_WORK_INCOME_DATE && sDate <= curMonStr;
  });

  // Yangidan eskisiga qarab (eng yangi hafta tepada) xronologik tartiblash
  incomes.sort((a, b) => {
    const da = new Date(a.startDate || 0).getTime();
    const db = new Date(b.startDate || 0).getTime();
    return db - da;
  });

  const totalAmount = incomes.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalHours = incomes.reduce((sum, item) => sum + (Number(item.totalHours) || 0), 0);
  const totalOrders = incomes.reduce((sum, item) => sum + (Number(item.ordersCount) || 0), 0);
  const totalWorkDays = incomes.reduce((sum, item) => sum + (Number(item.workDaysCount || (item.workDays ? item.workDays.length : 0)) || 0), 0);
  const totalRestDays = incomes.reduce((sum, item) => sum + (Number(item.restDaysCount || (item.restDays ? item.restDays.length : 0)) || 0), 0);
  const latestWeeklyIncome = incomes.length > 0 ? (Number(incomes[0].amount) || 0) : 0;

  setElText('heroTotalIncomeAmount', formatSom(totalAmount));
  setElText('heroWeeklyIncomeAmount', formatSom(latestWeeklyIncome));
  setElText('heroTotalHoursCount', `${totalHours} soat`);
  setElText('heroTotalOrdersCount', `${totalOrders} ta`);
  setElText('heroWorkRestDaysRatio', `${totalWorkDays} ish / ${totalRestDays} dam`);
  setElText('incomeSessionsCount', `${incomes.length} ta hafta`);

  setElText('kpiTotalIncome', formatSom(totalAmount));
  setElText('kpiWeeklyIncome', formatSom(latestWeeklyIncome));
  setElText('kpiTotalHours', `${totalHours} soat`);
  setElText('kpiTotalOrders', `${totalOrders} ta`);
  setElText('kpiTotalWorkDays', `${totalWorkDays} kun`);
  setElText('kpiTotalRestDays', `${totalRestDays} kun`);
  setElText('incomesStreamCountBadge', `${incomes.length} ta hafta (7-Sen — Bugun)`);

  if (incomes.length === 0) {
    container.innerHTML = `
      <div class="empty-incomes-box" style="text-align: center; padding: 36px 16px; background: var(--bg-surface-elevated); border: 1px dashed var(--border-subtle); border-radius: var(--radius-lg);">
        <div style="font-size: 2.2rem; margin-bottom: 10px;">📅</div>
        <div style="font-size: 1rem; font-weight: 700; color: var(--text-main); margin-bottom: 4px;">7-Sentabr 2026-yildan bugungacha kiritilgan haftalik daromadlar yo'q</div>
        <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 14px;">
          <strong>"+ Haftalik daromad kiritish"</strong> tugmasini bosib birinchi haftalik hisobotni saqlang!
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = incomes.map(item => {
    const offset = getWeekOffset(item.startDate);
    const relativeBadge = getWeekRelativeText(offset);
    const workCount = item.workDaysCount || (item.workDays ? item.workDays.length : 0);
    const restCount = item.restDaysCount || (7 - workCount);
    const hourlyRate = (item.totalHours && item.totalHours > 0) ? Math.round(item.amount / item.totalHours) : 0;
    const perOrderRate = (item.ordersCount && item.ordersCount > 0) ? Math.round(item.amount / item.ordersCount) : 0;

    // 7 kunlik polosa ko'rinishi
    const monday = getMondayDate(item.startDate);
    const weekDays = getWeek7Days(monday);
    const workSet = new Set(item.workDays || []);

    const stripHtml = weekDays.map(d => {
      const isWork = workSet.has(d.dateStr);
      return `
        <div class="strip-day-chip ${isWork ? 'work' : 'rest'}" title="${d.dayName} (${d.dateStr}) — ${isWork ? 'Ish kuni' : 'Dam olish kuni'}">
          <strong>${d.dayShort}</strong>
          <span>${isWork ? '💼 Ish' : '🏖️ Dam'}</span>
        </div>
      `;
    }).join('');

    return `
      <div class="income-week-card" id="income-item-${item.id}">
        <div class="income-week-header">
          <div class="income-week-title-wrap">
            <div class="week-icon-badge">📅</div>
            <div>
              <div class="income-week-range">
                ${formatDateUz(item.startDate)} — ${formatDateUz(item.endDate)}
                <span class="income-week-tag ${offset === 0 ? 'is-current' : ''}">${relativeBadge}</span>
              </div>
              <div class="income-week-sub">7 kunlik hisobot davri</div>
            </div>
          </div>
          <div class="income-week-sum-wrap">
            <div class="income-week-label">7 kunda topgan pul</div>
            <div class="income-week-amount">+${formatSom(item.amount)}</div>
          </div>
        </div>

        <div class="income-week-days-strip">
          ${stripHtml}
        </div>

        <div class="income-week-metrics-bar">
          <div class="income-metric-chip work-chip">
            <span>💼 Ishlangan: <strong>${workCount} kun</strong></span>
          </div>
          <div class="income-metric-chip rest-chip">
            <span>🏖️ Dam olingan: <strong>${restCount} kun</strong></span>
          </div>
          <div class="income-metric-chip hours-chip">
            <span>⏰ Ish soati: <strong>${item.totalHours || 0} soat</strong></span>
            ${hourlyRate > 0 ? `<span>(${formatSom(hourlyRate)}/soat)</span>` : ''}
          </div>
          <div class="income-metric-chip orders-chip">
            <span>📦 Buyurtmalar: <strong>${item.ordersCount || 0} ta</strong></span>
            ${perOrderRate > 0 ? `<span>(${formatSom(perOrderRate)}/ta)</span>` : ''}
          </div>
        </div>

        ${item.note ? `<div class="income-week-note">💬 ${item.note}</div>` : ''}

        <div class="income-week-footer">
          <span class="income-week-timestamp">Qayd etildi: ${new Date(item.createdAt || item.id).toLocaleDateString()}</span>
          <div class="income-week-actions">
            <button class="btn btn-sm btn-icon-action" onclick="editWorkIncome(${item.id})" title="Tahrirlash">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="btn btn-sm btn-icon-action delete" onclick="deleteWorkIncome(${item.id})" title="O'chirish">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.editWorkIncome = function(id) {
  const item = (appState.workIncomes || []).find(i => i.id === id);
  if (!item) return;

  selectWeekDate(item.startDate, false);

  document.getElementById('editWorkIncomeId').value = item.id;
  document.getElementById('workIncomeAmount').value = item.amount;
  document.getElementById('workIncomeHours').value = item.totalHours || 40;
  document.getElementById('workIncomeOrders').value = item.ordersCount || 0;
  document.getElementById('workIncomeNote').value = item.note || '';

  modalWorkDays.clear();
  (item.workDays || []).forEach(d => modalWorkDays.add(d));

  renderModalCalendar();
  updateWorkIncomeLivePreview();
  openModal(document.getElementById('workIncomeModal'));
};

window.deleteWorkIncome = function(id) {
  const index = (appState.workIncomes || []).findIndex(i => i.id === id);
  if (index === -1) return;

  const item = appState.workIncomes[index];

  appTrash.unshift({
    id: Date.now(),
    type: 'work_income',
    title: `Haftalik daromad: +${formatSom(item.amount)} (${item.ordersCount || 0} ta buyurtma, ${item.workDaysCount || 0} ish kuni)`,
    deletedAt: Date.now(),
    expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000),
    data: item
  });
  saveTrash();

  appState.balance -= item.amount;
  if (appState.balance < 0) appState.balance = 0;
  appState.monthlyIncome -= item.amount;
  if (appState.monthlyIncome < 0) appState.monthlyIncome = 0;

  appState.workIncomes.splice(index, 1);
  saveState();
  renderAll();
  triggerHaptic('warning');
  showToast("Haftalik daromad Chiqindi qutisiga ko'chirildi (1 hafta saqlanadi)!", 'danger');
};

// ==========================================
// UI NI CHIZISH (RENDER)
// ==========================================

function getCumulativeEarnings() {
  const workIncomesTotal = (appState.workIncomes || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const baseline = Math.max(appState.cumulativeEarnings || 0, workIncomesTotal, (appState.monthlyIncome || 0));
  appState.cumulativeEarnings = baseline;
  return appState.cumulativeEarnings;
}

function renderAll() {
  // 1. Yuqori kartochkalar
  document.getElementById('balanceDisplay').textContent = formatSom(appState.balance);
  document.getElementById('totalIncomeDisplay').textContent = formatSom(appState.monthlyIncome);
  document.getElementById('totalExpenseDisplay').textContent = formatSom(appState.monthlyExpense);

  // 1.1 Yangi ko'rsatkich: Jami Ishlab Topilgan Umumiy Pul (Cumulative Lifetime Earnings)
  const cumulativeEl = document.getElementById('cumulativeEarningsDisplay');
  if (cumulativeEl) {
    cumulativeEl.textContent = formatSom(getCumulativeEarnings());
  }

  // Qarzlar qoldig'i (berilgan va olingan)
  const lentRemaining = appState.debts
    .filter(d => (d.direction === 'lent') && (d.totalAmount > d.paidAmount))
    .reduce((sum, d) => sum + (d.totalAmount - d.paidAmount), 0);
  const borrowedRemaining = appState.debts
    .filter(d => (d.direction !== 'lent') && (d.totalAmount > d.paidAmount))
    .reduce((sum, d) => sum + (d.totalAmount - d.paidAmount), 0);
  appState.activeDebtTotal = lentRemaining + borrowedRemaining;

  const totalDebtEl = document.getElementById('totalDebtDisplay');
  if (totalDebtEl) totalDebtEl.textContent = formatSom(appState.activeDebtTotal);
  
  const debtSubEl = document.getElementById('activeDebtSubText');
  if (debtSubEl) {
    if (lentRemaining > 0 && borrowedRemaining > 0) {
      debtSubEl.textContent = `🤝 Berilgan: ${formatSom(lentRemaining)} • 📥 Olingan: ${formatSom(borrowedRemaining)}`;
    } else if (lentRemaining > 0) {
      debtSubEl.textContent = `🤝 Yaqinlarga: ${formatSom(lentRemaining)}`;
    } else if (borrowedRemaining > 0) {
      debtSubEl.textContent = `📥 Qarz olingan: ${formatSom(borrowedRemaining)}`;
    } else {
      debtSubEl.textContent = "Barcha qarzlar yopilgan";
    }
  }

  // 2. Kategoriya kartochkalari (Alifbo bo'yicha)
  document.getElementById('sumSocial').textContent = formatSom(appState.categories.social);
  document.getElementById('sumFood').textContent = formatSom(appState.categories.food);
  document.getElementById('sumDebtPaid').textContent = formatSom(appState.categories.debt);
  document.getElementById('sumTaxi').textContent = formatSom(appState.categories.taxi);
  document.getElementById('sumTransport').textContent = formatSom(appState.categories.transport);
  document.getElementById('sumCustom').textContent = formatSom(appState.categories.custom);

  // Nomsiz kategoriya nomini ko'rsatish
  const customName = appState.customCategoryName || "Nomsiz xarajat";
  document.getElementById('customCatTitle').textContent = customName;
  const legendLabel = document.getElementById('legendCustomLabel');
  if (legendLabel) legendLabel.textContent = customName;

  // Foizlarni hisoblash
  const totalExp = appState.monthlyExpense || 1;
  const socialPct = Math.round(((appState.categories.social || 0) / totalExp) * 100) || 0;
  const foodPct = Math.round(((appState.categories.food || 0) / totalExp) * 100) || 0;
  const debtPct = Math.round(((appState.categories.debt || 0) / totalExp) * 100) || 0;
  const taxiPct = Math.round(((appState.categories.taxi || 0) / totalExp) * 100) || 0;
  const transportPct = Math.round(((appState.categories.transport || 0) / totalExp) * 100) || 0;
  const customPct = Math.round(((appState.categories.custom || 0) / totalExp) * 100) || 0;

  // Progress barlar va foizlarni yangilash
  updateCatUI('pctSocial', 'barSocial', socialPct);
  updateCatUI('pctFood', 'barFood', foodPct);
  updateCatUI('pctDebt', 'barDebt', debtPct);
  updateCatUI('pctTaxi', 'barTaxi', taxiPct);
  updateCatUI('pctTransport', 'barTransport', transportPct);
  updateCatUI('pctCustom', 'barCustom', customPct);

  // Donut diagramma foizlari
  setElText('legendPctSocial', `${socialPct}%`);
  setElText('legendPctFood', `${foodPct}%`);
  setElText('legendPctDebt', `${debtPct}%`);
  setElText('legendPctTaxi', `${taxiPct}%`);
  setElText('legendPctTransport', `${transportPct}%`);
  setElText('legendPctCustom', `${customPct}%`);

  // Donut doiraviy vizualini yangilash
  updateDonutVisual(socialPct, foodPct, debtPct, taxiPct, transportPct, customPct);

  // 3. Mikro qarzlar ro'yxati
  renderDebts();

  // 4. Tranzaksiyalar ro'yxati
  renderTransactions();

  // 5. Ish va daromadlar ro'yxati
  renderWorkIncomes();

  // 6. Korzina badge
  updateTrashBadge();
}

function updateCatUI(pctId, barId, pct) {
  const pctEl = document.getElementById(pctId);
  if (pctEl) pctEl.textContent = `${pct}%`;
  const barEl = document.getElementById(barId);
  if (barEl) barEl.style.width = `${pct}%`;
}

function setElText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function updateDonutVisual(sPct, fPct, dPct, txPct, trPct, cPct) {
  const donut = document.querySelector('.donut-visual');
  if (!donut) return;

  let acc = 0;
  const sEnd = acc + sPct; acc = sEnd;
  const fEnd = acc + fPct; acc = fEnd;
  const dEnd = acc + dPct; acc = dEnd;
  const txEnd = acc + txPct; acc = txEnd;
  const trEnd = acc + trPct; acc = trEnd;
  const cEnd = 100;

  donut.style.background = `conic-gradient(
    #a855f7 0% ${sEnd}%,
    var(--color-food) ${sEnd}% ${fEnd}%,
    var(--color-debt) ${fEnd}% ${dEnd}%,
    var(--color-taxi) ${dEnd}% ${txEnd}%,
    var(--color-transport) ${txEnd}% ${trEnd}%,
    #14b8a6 ${trEnd}% ${cEnd}%
  )`;

  const totalLabel = document.querySelector('.donut-total-val');
  if (totalLabel) {
    const valMln = appState.monthlyExpense / 1000000;
    const mln = parseFloat(valMln.toFixed(2));
    totalLabel.textContent = `${mln} mln`;
  }
}

function renderDebts(filter = currentDebtFilter) {
  const container = document.getElementById('debtListContainer');
  const countBadge = document.getElementById('activeDebtCount');
  if (!container) return;

  const activeDebts = appState.debts.filter(d => d.paidAmount < d.totalAmount);
  if (countBadge) {
    countBadge.textContent = `${activeDebts.length} ta faol`;
  }

  let list = appState.debts;
  if (filter === 'lent') {
    list = appState.debts.filter(d => d.direction === 'lent');
  } else if (filter === 'borrowed') {
    list = appState.debts.filter(d => d.direction !== 'lent');
  }

  if (list.length === 0) {
    const emptyMsg = filter === 'lent'
      ? "Yaqinlarga berilgan qarzlar yo'q 🎉"
      : (filter === 'borrowed' ? "Olingan qarzlar yo'q 🎉" : "Qarzlar va berilgan pullar mavjud emas 🎉");
    container.innerHTML = `<div style="text-align: center; padding: 24px; color: var(--text-muted);">${emptyMsg}</div>`;
    return;
  }

  container.innerHTML = list.map(debt => {
    const isLent = debt.direction === 'lent';
    const remaining = debt.totalAmount - debt.paidAmount;
    const isPaid = remaining <= 0;
    const initial = (debt.person || "?").trim().charAt(0).toUpperCase() || (isLent ? "Y" : "Q");
    
    const statusText = debt.status || (isPaid ? (isLent ? "To'liq qaytarildi" : "To'liq yopildi") : "Kutilmoqda");
    const statusColor = isPaid ? 'var(--color-income)' : (isLent ? '#34d399' : 'var(--color-debt)');

    const dateFormatted = debt.date ? formatDateUz(debt.date) : "Ko'rsatilmagan";
    const paymentMethod = debt.paymentMethod || 'cash';
    const isCard = paymentMethod === 'card';
    const paymentBadge = isCard
      ? '<span class="pill-badge pill-card">💳 Karta</span>'
      : '<span class="pill-badge pill-cash">💵 Naqd</span>';
    const paymentLabel = isCard ? 'Plastik karta' : 'Naqd pul';

    const noteText = debt.note && debt.note.trim() ? ` • 💬 Izoh: ${debt.note}` : '';
    const dueText = debt.dueDate && debt.dueDate !== "Muddatsiz" ? ` • ⏳ Qaytarish: <strong>${formatDateUz(debt.dueDate)}</strong>` : '';

    return `
      <div class="debt-card ${isLent ? 'lent' : 'borrowed'}" style="${isPaid ? 'opacity: 0.6;' : ''}">
        <div class="debt-avatar" style="${isLent ? 'background: rgba(16, 185, 129, 0.18); color: #34d399;' : ''}">${debt.avatar || initial}</div>
        <div class="debt-meta">
          <div class="debt-person">
            ${debt.person}
            ${paymentBadge}
            <span class="pill-badge" style="color: ${statusColor};">
              ${isLent ? '🤝 Berildi' : '📥 Olindi'}: ${statusText}
            </span>
          </div>
          <div class="debt-note">
            📅 ${isLent ? 'Berilgan sana' : 'Sana'}: <strong>${dateFormatted}</strong> • <span class="debt-paytype-tag">${paymentLabel}</span>${noteText}${dueText}
          </div>
        </div>
        <div class="debt-figures">
          <div class="debt-remain" style="${isPaid ? 'color: var(--color-income);' : (isLent ? 'color: #34d399;' : '')}">
            ${isPaid ? '0 so\'m' : formatSom(remaining)}
          </div>
          <div class="debt-total-sub">
            Jami: ${formatSom(debt.totalAmount)} ${debt.paidAmount > 0 ? `(${formatSom(debt.paidAmount)} ${isLent ? 'qaytarildi' : 'to\'langan'})` : ''}
          </div>
        </div>
        <div class="debt-actions">
          ${!isPaid ? (
            isLent ? `
              <button class="btn-repay-collected" onclick="handleReceiveRepayment(${debt.id})" title="Yaqiningiz pulni qaytarganda bosing">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Pulni qaytardi
              </button>
            ` : `
              <button class="btn-pay" onclick="handleQuickPay(${debt.id}, ${remaining})">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                To'lov qildim
              </button>
            `
          ) : `
            <span style="font-size: 0.8rem; color: var(--color-income); font-weight: 700; align-self: center;">${isLent ? 'Qaytarildi ✓' : 'Yopildi ✓'}</span>
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

  const debtFilterBtns = document.querySelectorAll('#debtFilterTabs .debt-filter-btn');
  debtFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      debtFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDebtFilter = btn.getAttribute('data-debt-filter') || 'all';
      renderDebts(currentDebtFilter);
    });
  });
}

// ==========================================
// KALKULYATOR LOGIKASI
// ==========================================

let calcMemory = '';
let calcCurrentVal = '0';
let calcWaitingForOperand = false;

// Sonlarni telefon kalkulyatori kabi to'g'ri va aniq formatlash (qoldiq/kasr sonlar, ortiqcha 0 larsiz)
function formatCalcResult(num) {
  if (num === null || num === undefined || isNaN(num) || !isFinite(num)) {
    return 'Xato';
  }
  // JavaScript suzuvchi nuqta xatolarini (0.1 + 0.2 = 0.30000000000000004) to'g'rilash
  const precisionNum = Number(num.toPrecision(12));
  const rounded = parseFloat(precisionNum.toFixed(8));
  return String(rounded);
}

function flashCalcKey(key) {
  const btn = document.querySelector(`.calc-btn[data-key="${key}"]`);
  if (btn) {
    btn.classList.add('key-pressed');
    setTimeout(() => btn.classList.remove('key-pressed'), 140);
  }
}

window.calcNum = function(num) {
  triggerHaptic('light');
  flashCalcKey(String(num));

  if (calcCurrentVal === 'Xato') {
    calcCurrentVal = '0';
  }

  const strNum = String(num);

  if (calcWaitingForOperand) {
    calcCurrentVal = strNum === '000' ? '0' : strNum;
    calcWaitingForOperand = false;
  } else {
    if (calcCurrentVal === '0') {
      calcCurrentVal = strNum === '000' ? '0' : strNum;
    } else {
      calcCurrentVal += strNum;
    }
  }
  updateCalcDisplay();
};

window.calcDot = function() {
  triggerHaptic('light');
  flashCalcKey('.');

  if (calcCurrentVal === 'Xato') {
    calcCurrentVal = '0';
    calcWaitingForOperand = false;
  }

  if (calcWaitingForOperand) {
    calcCurrentVal = '0.';
    calcWaitingForOperand = false;
  } else if (!calcCurrentVal.includes('.')) {
    calcCurrentVal += '.';
  }
  updateCalcDisplay();
};

window.calcOp = function(op) {
  triggerHaptic('light');
  flashCalcKey(op);

  if (calcCurrentVal === 'Xato') {
    calcCurrentVal = '0';
    calcMemory = '';
    calcWaitingForOperand = false;
    updateCalcDisplay();
    return;
  }

  // Foiz (%) amali telefon kalkulyatoridek darhol hisoblanadi
  if (op === '%') {
    if (calcMemory) {
      const parts = calcMemory.trim().split(' ');
      if (parts.length >= 2 && !isNaN(parts[0])) {
        const base = parseFloat(parts[0]);
        const current = parseFloat(calcCurrentVal) || 0;
        const operator = parts[1];
        if (operator === '+' || operator === '−' || operator === '-') {
          calcCurrentVal = formatCalcResult((base * current) / 100);
        } else {
          calcCurrentVal = formatCalcResult(current / 100);
        }
      } else {
        calcCurrentVal = formatCalcResult((parseFloat(calcCurrentVal) || 0) / 100);
      }
    } else {
      calcCurrentVal = formatCalcResult((parseFloat(calcCurrentVal) || 0) / 100);
    }
    updateCalcDisplay();
    return;
  }

  // Operator belgilarini chiroyli ko'rsatish
  let displayOp = op;
  if (op === '*') displayOp = '×';
  else if (op === '/') displayOp = '÷';
  else if (op === '-') displayOp = '−';

  // Agar oldingi operatsiya bo'lsa va yangi son kiritilgan bo'lsa, zanjir bo'yicha oraliq natijani hisoblaymiz (telefondagidek)
  if (calcMemory && !calcWaitingForOperand) {
    try {
      const expression = `${calcMemory} ${calcCurrentVal}`
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-');
      const intermediate = Function(`'use strict'; return (${expression})`)();
      calcCurrentVal = formatCalcResult(intermediate);
    } catch (e) {
      calcCurrentVal = 'Xato';
      calcMemory = '';
      updateCalcDisplay();
      return;
    }
  }

  calcMemory = `${calcCurrentVal} ${displayOp}`;
  calcWaitingForOperand = true;
  updateCalcDisplay();
};

window.calcEquals = function() {
  triggerHaptic('light');
  flashCalcKey('Enter');

  if (!calcMemory) return;

  try {
    const expression = `${calcMemory} ${calcCurrentVal}`
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-');

    // 0 ga bo'lish tekshiruvi
    const cleanExpr = expression.replace(/\s+/g, '');
    if (/\/0(?!\d|\.)/.test(cleanExpr)) {
      calcCurrentVal = 'Xato';
      calcMemory = '';
      calcWaitingForOperand = true;
      updateCalcDisplay();
      return;
    }

    const result = Function(`'use strict'; return (${expression})`)();
    calcMemory = '';
    calcCurrentVal = formatCalcResult(result);
    calcWaitingForOperand = true;
  } catch (e) {
    calcCurrentVal = 'Xato';
    calcMemory = '';
  }
  updateCalcDisplay();
};

window.calcClear = function() {
  triggerHaptic('light');
  flashCalcKey('Escape');
  calcCurrentVal = '0';
  calcMemory = '';
  calcWaitingForOperand = false;
  updateCalcDisplay();
};

window.calcBackspace = function() {
  triggerHaptic('light');
  flashCalcKey('Backspace');

  if (calcCurrentVal === 'Xato' || calcWaitingForOperand) {
    calcCurrentVal = '0';
    calcWaitingForOperand = false;
  } else if (calcCurrentVal.length > 1) {
    calcCurrentVal = calcCurrentVal.slice(0, -1);
    if (calcCurrentVal === '-' || calcCurrentVal === '') {
      calcCurrentVal = '0';
    }
  } else {
    calcCurrentVal = '0';
  }
  updateCalcDisplay();
};

function updateCalcDisplay() {
  const currentEl = document.getElementById('calcCurrent');
  const prevEl = document.getElementById('calcPrev');
  if (currentEl) currentEl.textContent = calcCurrentVal;
  if (prevEl) prevEl.textContent = calcMemory;
}

window.applyCalcToExpense = function(category) {
  triggerHaptic('light');
  const val = Math.round(parseFloat(calcCurrentVal));
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

// ==========================================
// SPA TAB-BASED NAVIGATSIYA & OYNALAR ALMASHINISHI
// 1. Asosiy (Dashboard)
// 2. Daromadlar
// 3. Xarajatlar
// 4. Qarzlar
// 5. Kalkulyator
// ==========================================

let currentActiveTab = 'dashboard';

window.switchTab = function(tabName) {
  if (!tabName) return;
  triggerHaptic('light');
  currentActiveTab = tabName;

  // 1. Barcha tab viewlarni yashirish va tanlangan oynani faollashtirish
  const views = document.querySelectorAll('.tab-view');
  views.forEach(v => v.classList.remove('active'));

  const tabMap = {
    dashboard: 'tabDashboard',
    incomes: 'tabIncomes',
    expenses: 'tabExpenses',
    debts: 'tabDebts',
    calculator: 'tabCalculator'
  };

  const targetId = tabMap[tabName] || `tab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`;
  const targetView = document.getElementById(targetId);
  if (targetView) {
    targetView.classList.add('active');
  }

  // 2. Drawer menyudagi faol tabni belgilash
  document.querySelectorAll('.drawer-nav-item').forEach(item => {
    const itemTab = item.getAttribute('data-tab');
    item.classList.toggle('active', itemTab === tabName);
  });

  // 3. Headerdagi joriy oyna yorlig'ini (badge) yangilash
  const namesUz = {
    dashboard: 'Asosiy',
    incomes: 'Daromadlar',
    expenses: 'Xarajatlar',
    debts: 'Qarzlar',
    calculator: 'Kalkulyator'
  };
  const badge = document.getElementById('currentTabBadge');
  if (badge) {
    badge.textContent = namesUz[tabName] || tabName;
  }

  // 4. Sahifani yuqoriga o'tkazish
  window.scrollTo({ top: 0, behavior: 'instant' });
};

// Eski kodlar va havolalar bilan to'liq moslik uchun yordamchilar
function scrollToCalculator() {
  triggerHaptic('light');
  switchTab('calculator');
}

const scrollToCalcBtn = document.getElementById('scrollToCalcBtn');
if (scrollToCalcBtn) {
  scrollToCalcBtn.addEventListener('click', () => switchTab('calculator'));
}

window.scrollToSection = function(sectionId) {
  triggerHaptic('light');
  if (sectionId === 'incomeSection') {
    switchTab('incomes');
  } else if (sectionId === 'analysisSection') {
    switchTab('expenses');
  } else if (sectionId === 'debtSection') {
    switchTab('debts');
  } else if (sectionId === 'calculatorWidget') {
    switchTab('calculator');
  } else if (sectionId === 'historySection') {
    switchTab('dashboard');
    const target = document.getElementById('historySection');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    const target = document.getElementById(sectionId);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// ==========================================
// GAMBURGER YON MENYU (SIDEBAR / DRAWER) BOSHQARUVI
// ==========================================

window.openDrawer = function(e) {
  if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
  triggerHaptic('light');
  const drawer = document.getElementById('appDrawer');
  const overlay = document.getElementById('drawerOverlay');
  if (drawer) drawer.classList.add('active');
  if (overlay) overlay.classList.add('active');

  const drawerBadge = document.getElementById('drawerTrashCountBadge');
  if (drawerBadge) drawerBadge.textContent = (typeof appTrash !== 'undefined' && appTrash) ? appTrash.length : 0;

  updateDrawerThemeDisplay();
};

window.closeDrawer = function(e) {
  if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
  const drawer = document.getElementById('appDrawer');
  const overlay = document.getElementById('drawerOverlay');
  if (drawer) drawer.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
};

window.toggleDrawer = function(e) {
  if (e) {
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
    if (typeof e.preventDefault === 'function') e.preventDefault();
  }
  const drawer = document.getElementById('appDrawer');
  if (drawer && drawer.classList.contains('active')) {
    closeDrawer(e);
  } else {
    openDrawer(e);
  }
};

function updateDrawerThemeDisplay() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const iconEl = document.getElementById('drawerThemeIcon');
  const textEl = document.getElementById('drawerThemeText');
  if (iconEl) iconEl.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
  if (textEl) textEl.textContent = currentTheme === 'dark' ? 'Kunduzgi rejimga o\'tish' : 'Tungi rejimga o\'tish';
}

window.toggleThemeFromDrawer = function() {
  triggerHaptic('light');
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.click();
  } else {
    const root = document.documentElement;
    const current = root.getAttribute('data-theme') || 'dark';
    const newTheme = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', newTheme);
    appState.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    updateThemeMeta(newTheme);
    saveState();
  }
  updateDrawerThemeDisplay();
  closeDrawer();
};

window.openTrashFromDrawer = function() {
  closeDrawer();
  renderTrash();
  openModal(document.getElementById('trashModal'));
};

window.openResetFromDrawer = function() {
  closeDrawer();
  openModal(document.getElementById('resetConfirmModal'));
};

window.openAboutAppModal = function() {
  closeDrawer();
  openModal(document.getElementById('aboutAppModal'));
};

// Kompyuter va noutbuk jismoniy klaviaturasi (Numpad) qo'llab-quvvatlash
function initKeyboardSupport() {
  window.addEventListener('keydown', (e) => {
    // Foydalanuvchi matn yoki summa kiritayotgan bo'lsa, xalaqit bermaymiz
    const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

    // Faol modal bo'lsa, Esc bosilganda uni yopamiz
    const activeModal = document.querySelector('.modal-overlay.active');
    if (activeModal) {
      if (e.key === 'Escape') closeAllModals();
      return;
    }

    if (e.key >= '0' && e.key <= '9') {
      window.calcNum(e.key);
    } else if (e.key === '.') {
      window.calcDot();
    } else if (e.key === '+' || e.key === '-') {
      window.calcOp(e.key);
    } else if (e.key === '*') {
      window.calcOp('*');
    } else if (e.key === '/') {
      e.preventDefault();
      window.calcOp('/');
    } else if (e.key === '%') {
      e.preventDefault();
      window.calcOp('%');
    } else if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      window.calcEquals();
    } else if (e.key === 'Backspace') {
      window.calcBackspace();
    } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
      window.calcClear();
    }
  });
}

// Yon menyu (Drawer) tugmalarini ulash
function initNavigationEvents() {
  const drawerToggleBtn = document.getElementById('drawerToggleBtn');
  if (drawerToggleBtn) {
    drawerToggleBtn.onclick = function(e) {
      toggleDrawer(e);
    };
  }

  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  if (drawerCloseBtn) {
    drawerCloseBtn.onclick = function(e) {
      closeDrawer(e);
    };
  }

  const drawerOverlay = document.getElementById('drawerOverlay');
  if (drawerOverlay) {
    drawerOverlay.onclick = function(e) {
      closeDrawer(e);
    };
  }

  // Drawer ichidagi asosiy sahifalar tugmalari
  document.querySelectorAll('.drawer-nav-item').forEach(item => {
    item.onclick = function(e) {
      if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
      const tab = item.getAttribute('data-tab');
      if (tab) {
        switchTab(tab);
        closeDrawer(e);
      }
    };
  });
}

// ==========================================
// ILOVANI ISHGA TUSHIRISH
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCurrentDate();
  initModals();
  initForms();
  initFilters();
  initKeyboardSupport();
  initNavigationEvents();
  renderAll();
});
