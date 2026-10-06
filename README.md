# 💰 Moliya, Kundalik Xarajatlar & Mikro Qarzlar Menejeri

Zamonaviy va qulay moliya tahlilchisi hamda kalkulyator veb-ilovasi.

## 🚀 Asosiy imkoniyatlar:
1. **Kundalik xarajatlar tahlili (Alifbo bo'yicha tartiblangan)**:
   - 📱 **Ijtimoiy tarmoq obunalari** (Telegram Premium, YouTube, ChatGPT, Netflix...)
   - 🍔 **Ovqatlanish** (tushlik, kofe, bozor)
   - 💳 **Qarz to'lovlari** (to'langan mikro qarzlar)
   - 🚕 **Taxi xizmati** (Yandex, mashina yo'l haqi)
   - 🚌 **Yo'l haqi** (avtobus, metro, ATTO kartasi)
   - ✏️ **Nomsiz / Maxsus kategoriya** (nomini foydalanuvchi o'zi qo'yadi va xarajatni yozadi!)
2. **Oylik tushumlar**:
   - Asosiy oylik maosh, avans va qo'shimcha daromadlarni hisobga olish.
3. **Mikro qarzlar moduli**:
   - Olingan mikro qarzlarni alohida kartochkalarda ro'yxatga olish.
   - **"To'lov qildim"** tugmasi orqali qarzni to'lash: bunda to'langan summa avtomatik ravishda umumiy xarajatlarga mikro qarz to'lovi sifatida kiritiladi va qarz qoldig'i kamayadi.
4. **Statistikalarni 0 ga tushirish & Tasdiqlash dialogi**:
   - Maxsus tugma orqali barcha statistikani 0 ga tushirish.
   - O'chirishdan oldin ogohlantiruvchi oyna chiqadi: *"Siz rostdan barcha statistikalarni 0 ga tushirasizmi?"* (Ha / Yo'q).
   - "Yo'q" bosilsa amal bekor qilinadi. "Ha" bosilsa barcha ko'rsatkichlar 0 ga tushadi.
5. **Chiqindi qutisi (Korzina) & 1 haftalik Auto-delete**:
   - 0 ga tushirilgan yoki o'chirilgan barcha ma'lumotlar Chiqindi qutisiga tushadi.
   - Har bir arxiv **1 hafta (7 kun)** davomida saqlanadi va muddat tugashi bilan avtomatik o'chadi (`auto delete`).
   - Chiqindi qutisidan istalgan vaqtda ma'lumotlarni **"Qayta tiklash" (Restore)** mumkin.
6. **O'rnatilgan tezkor kalkulyator**:
   - Saytning yon panelida matematik hisob-kitoblar uchun interaktiv kalkulyator mavjud.
   - Chiqqan natijani 1 tugma bilan bevosita xarajatlar sifatida kiritish mumkin.
7. **Zamonaviy UI/UX**:
   - Qorong'i (Dark) va yorug' (Light) rejimlar.
   - Glassmorphism effekti, zamonaviy shriftlar va moslashuvchan (responsive) dizayn.
   - Ma'lumotlar brauzer xotirasida (`localStorage`) saqlanadi.

## 📱 Universal qurilmalar va platformalar qo'llab-quvvatlashi:
1. **Apple iPhone (iPhone 11 dan 18 Pro Max gacha, iOS Safari & PWA)**:
   - `viewport-fit=cover` va CSS `env(safe-area-inset-*)` yordamida Dynamic Island va Notch uchun to'liq moslashuvchanlik.
   - iOS Safari'dagi avto-masshtablash (auto-zoom) xatosini bartaraf qilish uchun barcha forma maydonlari 16px shrift bilan sozlangan.
   - Mobil qurilmalarda zamonaviy **Bottom Sheet** modal oynalar va pastki tezkor navigatsiya paneli (**Quick Dock**).
   - Taktil his tuyg'usi (Haptic feedback) qo'shilgan.
2. **Samsung & zamonaviy Android 14+ qurilmalar**:
   - `inputmode="numeric"` orqali summa kiritishda avtomatik to'g'ridan-to'g'ri raqamli klaviatura ochiladi.
   - `100dvh` (Dynamic Viewport Height) orqali klaviatura ochilganda yoki brauzer manzillar paneli siljiganda ekran buzilmaydi.
   - Android navigatsiya paneli va status bari ranglarini sinxronlashtirish (`theme-color`).
3. **Kompyuter va Noutbuklar (Windows, macOS, Linux)**:
   - Jismoniy klaviatura va Numpad yordamida kalkulyatorni boshqarish (`0-9`, `+`, `-`, `*`, `/`, `Enter`, `Backspace`, `Escape` / `C`).
   - Bosilgan tugma vizual yonib turuvchi micro-animatsiyaga ega.
   - Katta ekranlarda yon panel (Sticky Sidebar) va zamonaviy skroll panel.

## 💻 Qanday ochish mumkin:
Brauzeringizda to'g'ridan-to'g'ri `index.html` faylini oching yoki mahalliy server orqali kiring:
```bash
http://localhost:8080/index.html
```
