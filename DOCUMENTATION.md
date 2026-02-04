# EduGame Frontend - Dokumentatsiya

## Loyiha haqida

EduGame - bu ta'limiy o'yinlar platformasi. O'quvchilar turli fanlar bo'yicha savollarni o'yin formatida yechishadi. Platforma 3 ta o'yin turini qo'llab-quvvatlaydi va 13 ta fanni o'z ichiga oladi.

## Texnologiyalar

- **Framework**: Nuxt 4 (Vue 3)
- **Til**: TypeScript
- **Styling**: Scoped CSS
- **State Management**: Vue Composables

## Loyiha Strukturasi

```
frontend/
├── app/
│   ├── components/
│   │   └── games/              # O'yin komponentlari
│   │       ├── GameSelector.vue      # O'yin turini tanlash
│   │       ├── TeamSetup.vue         # Jamoa nomlarini kiritish
│   │       ├── QuizPanel.vue         # Savol-javob paneli
│   │       ├── GameBoard.vue         # Asosiy o'yin taxtasi
│   │       ├── TugOfWarArena.vue     # Arqon tortish arenasi
│   │       ├── PoleClimbingArena.vue # Ustun ko'tarish arenasi
│   │       ├── SackRaceArena.vue     # Qop poygasi arenasi
│   │       ├── CountdownOverlay.vue  # Sanash overlay
│   │       └── WinnerOverlay.vue     # G'olib overlay
│   │
│   ├── composables/            # Qayta ishlatiladigan mantiq
│   │   ├── useLanguage.ts      # Til boshqaruvi (UZ/RU/EN)
│   │   ├── useQuestions.ts     # Savollarni yuklash va tekshirish
│   │   └── useGameState.ts     # O'yin holati boshqaruvi
│   │
│   └── pages/
│       ├── index.vue           # Bosh sahifa (fanlar ro'yxati)
│       └── game/
│           └── [slug].vue      # O'yin sahifasi (dinamik)
│
├── public/
│   └── assets/
│       ├── themes/             # O'yin temalari rasmlari
│       │   ├── pantaj_pinang/  # Ustun ko'tarish rasmlari
│       │   └── balap_karung/   # Qop poygasi rasmlari
│       └── ui/                 # UI rasmlari
│           └── character.png   # Arqon tortish rasmi
│
└── nuxt.config.ts              # Nuxt konfiguratsiya
```

---

## O'yin Turlari

### 1. Arqon Tortish (Tug of War)
- **Fayl**: `TugOfWarArena.vue`
- **Mantiq**: Ikki jamoa arqonni o'z tomoniga tortadi
- **G'alaba sharti**: Arqonni chegaraga yetkazish (position ±300)
- **Vizual**: `character.png` - ikkala karakter arqon bilan

### 2. Ustun Ko'tarish (Pole Climbing)
- **Fayl**: `PoleClimbingArena.vue`
- **Mantiq**: Har bir jamoa alohida ustunda yuqoriga ko'tariladi
- **G'alaba sharti**: 7 ta to'g'ri javob
- **Rasmlar**:
  - `tiang.png` - ustun
  - `climbleft.png`, `climbright.png` - ko'tarilish holati
  - `standleft.png`, `standright.png` - turish holati

### 3. Qop Poygasi (Sack Race)
- **Fayl**: `SackRaceArena.vue`
- **Mantiq**: Karakterlar startdan finishgacha sakrab borishadi
- **G'alaba sharti**: 7 ta to'g'ri javob
- **Rasmlar**:
  - `track.png` - poyga yo'li
  - `blue_hop.png`, `red_hop.png` - sakrash holati
  - `blue_stand.png`, `red_stand.png` - turish holati

---

## Composables (Qayta ishlatiladigan mantiq)

### useLanguage.ts
Til boshqaruvi uchun composable.

```typescript
const { t, currentLang, setLanguage, languages } = useLanguage()

// Foydalanish:
t('title')              // Tarjima olish
setLanguage('ru')       // Tilni o'zgartirish
currentLang.value       // Joriy til ('uz' | 'ru' | 'en')
```

**Xususiyatlari**:
- 3 til qo'llab-quvvatlanadi: O'zbek, Rus, Ingliz
- localStorage'da saqlanadi
- Reaktiv - til o'zgarganda UI avtomatik yangilanadi

### useQuestions.ts
Savollarni backend'dan yuklash va tekshirish.

```typescript
const { questions, loading, error, loadQuestions, checkAnswer } = useQuestions()

// Savollarni yuklash
await loadQuestions('matematika', 'uz')

// Javobni tekshirish
const isCorrect = checkAnswer(question, selectedOption)
```

**API endpoint**: `GET /api/questions?game={slug}&lang={lang}`

**Savol formati**:
```json
{
  "question": "2 + 2 = ?",
  "h": "abc123",           // Hash qilingan to'g'ri javob
  "options": ["3", "4", "5", "6"]
}
```

### useGameState.ts
O'yin holatini boshqarish - barcha o'yinlar uchun umumiy mantiq.

```typescript
const {
  screen,           // 'game-select' | 'team-setup' | 'countdown' | 'playing' | 'finished'
  gameType,         // 'tugofwar' | 'poleclimbing' | 'sackrace'
  scores,           // { left: number, right: number }
  position,         // Arqon pozitsiyasi (-300 dan +300 gacha)
  progress,         // Arqon tortish uchun progress
  scoreProgress,    // Ustun/Qop uchun progress (ball asosida)
  isActive,         // O'yin faolmi
  // ... va boshqa metodlar
} = useGameState()
```

**Asosiy konfiguratsiya**:
```typescript
config = {
  step: 30,              // Har bir to'g'ri javob uchun qadam
  winLimit: 300,         // G'alaba chegarasi
  wrongStepFactor: 1/3   // Noto'g'ri javob jarima koeffitsienti
}
winScoreTarget = 7       // Ustun/Qop uchun g'alaba soni
```

---

## Komponentlar

### GameSelector.vue
O'yin turini tanlash modali.

**Props**: yo'q
**Events**:
- `@select="(type: GameType) => void"` - O'yin tanlanganda
- `@back` - Orqaga qaytish

### TeamSetup.vue
Jamoa nomlarini kiritish modali.

**Props**:
- `questionsLoaded: boolean` - Savollar yuklanganmi

**Events**:
- `@start="(leftName, rightName) => void"` - O'yinni boshlash
- `@back` - Orqaga qaytish

### QuizPanel.vue
Savol va javob variantlarini ko'rsatish paneli.

**Props**:
- `side: 'left' | 'right'` - Jamoa tomoni
- `teamName: string` - Jamoa nomi
- `score: number` - Joriy ball
- `currentQuestion: Question | null` - Joriy savol
- `locked: boolean` - Qulflangan (javob kutilmoqda)
- `isActive: boolean` - O'yin faolmi

**Events**:
- `@answer="(option: string) => void"` - Javob tanlanganda

**Exposed methods**:
- `showFeedback(isCorrect: boolean)` - To'g'ri/noto'g'ri animatsiya

### GameBoard.vue
Asosiy o'yin taxtasi - QuizPanel va Arena ni birlashtiradi.

**Props**:
- `gameType: GameType`
- `subjectTitle: string`
- `leftTeamName, rightTeamName: string`
- `position: number`
- `scores: { left, right }`
- `locks: { left, right }`
- `currentQuiz: { left, right }`
- `isActive: boolean`
- `formattedTime: string`
- `progress: { left, right }`

### Arena Komponentlari

#### TugOfWarArena.vue
```typescript
Props: {
  position: number    // -300 dan +300 gacha
  isActive?: boolean  // Tortish animatsiyasi uchun
}
```

#### PoleClimbingArena.vue
```typescript
Props: {
  leftProgress: number   // 0 dan 1 gacha
  rightProgress: number  // 0 dan 1 gacha
}
```

#### SackRaceArena.vue
```typescript
Props: {
  leftProgress: number   // 0 dan 1 gacha
  rightProgress: number  // 0 dan 1 gacha
}
```
Progress o'zgarganda karakter bir marta sakraydi (watch bilan kuzatiladi).

---

## O'yin Oqimi

```
1. Bosh sahifa (index.vue)
   └── Fan tanlash (13 ta fan)

2. O'yin sahifasi (game/[slug].vue)
   ├── GameSelector - O'yin turini tanlash
   │   └── 3 ta variant: Arqon, Ustun, Qop
   │
   ├── TeamSetup - Jamoa nomlarini kiritish
   │   └── Savollar fonoda yuklanadi
   │
   ├── CountdownOverlay - 3, 2, 1, Boshlang!
   │
   ├── GameBoard - O'yin jarayoni
   │   ├── QuizPanel (chap) - Chap jamoa savollari
   │   ├── Arena - O'yin vizuali
   │   └── QuizPanel (o'ng) - O'ng jamoa savollari
   │
   └── WinnerOverlay - G'olib e'lon qilish
       └── Qayta o'ynash yoki Bosh sahifa
```

---

## Yangi Fan Qo'shish

1. **Backend'da** yangi fan uchun savollar qo'shing
2. **index.vue** da `subjects` massiviga qo'shing:
```typescript
{
  slug: 'yangi-fan',
  title: 'Yangi Fan',
  desc: "Tavsif",
  icon: 'YF',
  variant: 'v-blue'
}
```
3. **game/[slug].vue** da `subjects` ob'ektiga qo'shing:
```typescript
'yangi-fan': 'Yangi Fan'
```

---

## Yangi O'yin Turi Qo'shish

1. **Yangi Arena komponenti yarating**: `app/components/games/NewGameArena.vue`

2. **GameType ga qo'shing** (`useGameState.ts`):
```typescript
export type GameType = 'tugofwar' | 'poleclimbing' | 'sackrace' | 'newgame'
```

3. **GameSelector.vue da qo'shing**:
```typescript
const games = [
  // ... mavjud o'yinlar
  { type: 'newgame', icon: '🎮', colorClass: 'color-purple' }
]
```

4. **GameBoard.vue da render qiling**:
```vue
<NewGameArena
  v-else-if="gameType === 'newgame'"
  :some-props="values"
/>
```

5. **Tarjimalarni qo'shing** (`useLanguage.ts`):
```typescript
games: {
  newgame: {
    name: "Yangi O'yin",
    desc: "O'yin tavsifi"
  }
}
```

---

## API Integratsiya

### Konfiguratsiya
`useQuestions.ts` da:
```typescript
const config = {
  apiBaseUrl: 'http://localhost:8000',
  apiKey: 'your-api-key'
}
```

### Endpoint
```
GET /api/questions?game={slug}&lang={lang}

Headers:
  X-API-Key: {apiKey}
  Accept: application/json

Response: Question[]
```

### Xavfsizlik
- Javoblar hash qilingan (`fastHash` funksiyasi)
- API kalit orqali autentifikatsiya
- Frontendda javoblar ochiq ko'rinmaydi

---

## Responsive Dizayn

Barcha komponentlar quyidagi breakpointlarga moslashgan:
- `> 900px` - Desktop
- `768px - 900px` - Tablet
- `500px - 768px` - Katta telefon
- `< 500px` - Kichik telefon

---

## Ishga tushirish

```bash
# Bog'liqliklarni o'rnatish
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## Muhim eslatmalar

1. **Auto-imports**: Nuxt composables va Vue funksiyalarni avtomatik import qiladi
2. **Rasm fayllar**: `/public/assets/` papkasida, URL `/assets/...` bilan boshlanadi
3. **State**: Har bir o'yin sessiyasi uchun yangi state yaratiladi
4. **Timer**: O'yin davomida vaqt hisoblanadi va g'olib ekranida ko'rsatiladi

---

## Muallif
EduGames.uz jamoasi

## Versiya
1.0.0
