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
2. **Daromadlar & Bajarilgan Buyurtmalar**:
   - ⏱️ **Ish vaqti**: Ish boshlangan va tugagan vaqtni tanlash hamda ish davomiyligini avtomatik hisoblash.
   - 📦 **Bajarilgan buyurtmalar soni**: Kunlik bajarilgan buyurtmalar hisobi.
   - 💵 **Topilgan daromad**: Kunlik sof daromad summasi, soatlik o'rtacha tushum va 1 ta buyurtmaga to'g'ri kelgan daromad ko'rsatkichlari.
   - 📝 **Tahrirlash va O'chirish**: Har bir kiritilgan ish daromadini tahrirlash yoki Korzinaga o'tkazish.
3. **Oylik tushumlar**:
   - Asosiy oylik maosh, avans va qo'shimcha daromadlarni hisobga olish.
4. **Qarzlar & Yaqinlarga berilgan pullar (Omonat) moduli**:
   - 🤝 **Yaqinlarga berilgan pullar hisobi**: Yaqinlar pul so'raganda **berilgan sana**, **ismi**, **summasi** va **ixtiyoriy izoh** (`izoh majburiy emas!`) bilan ro'yxatga olish.
   - 🔄 **Ikki tomonlama boshqaruv**: *"🤝 Yaqinimga berdim"* va *"📥 Qarz oldim"* yo'nalishlarini tanlash imkoniyati.
   - ✅ **"Pulni qaytardi"** tugmasi: Yaqin inson pulni qaytarganda, ushbu tugma orqali mablag' qaytadan shaxsiy balansga tushum sifatida qaytadi va status *"To'liq qaytarildi"* deb belgilanadi.
   - 💳 **"To'lov qildim"** tugmasi: Olingan qarzni qaytarganda mablag' avtomatik tarzda umumiy xarajatlarga kiritiladi.
   - 📑 **Qulay filtrlar**: *"Barchasi"*, *"🤝 Yaqinlarga berilgan pullar"* va *"📥 Olingan qarzlar"* ko'rinishida saralash.
5. **Statistikalarni 0 ga tushirish & Tasdiqlash dialogi**:
   - Maxsus tugma orqali barcha statistikani 0 ga tushirish.
   - O'chirishdan oldin ogohlantiruvchi oyna chiqadi: *"Siz rostdan barcha statistikalarni 0 ga tushirasizmi?"* (Ha / Yo'q).
   - "Yo'q" bosilsa amal bekor qilinadi. "Ha" bosilsa barcha ko'rsatkichlar 0 ga tushadi.
6. **Chiqindi qutisi (Korzina) & 1 haftalik Auto-delete**:
   - 0 ga tushirilgan yoki o'chirilgan barcha ma'lumotlar Chiqindi qutisiga tushadi.
   - Har bir arxiv **1 hafta (7 kun)** davomida saqlanadi va muddat tugashi bilan avtomatik o'chadi (`auto delete`).
   - Chiqindi qutisidan istalgan vaqtda ma'lumotlarni **"Qayta tiklash" (Restore)** mumkin.
7. **O'rnatilgan tezkor kalkulyator**:
   - Saytning yon panelida matematik hisob-kitoblar uchun interaktiv kalkulyator mavjud.
   - Chiqqan natijani 1 tugma bilan bevosita xarajatlar sifatida kiritish mumkin.
8. **Zamonaviy UI/UX**:
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
