<template>
  <div class="home-page">
    <aside class="social-rail">
      <button class="social-btn" aria-label="Telegram">Tg</button>
      <button class="social-btn" aria-label="Instagram">Ig</button>
      <button class="social-btn" aria-label="YouTube">Yt</button>
      <button class="social-btn" aria-label="Code">Dev</button>
      <button class="social-btn" aria-label="Lock">Lock</button>
    </aside>

    <section class="home-card">
      <header class="home-header">
        <div>
          <h1>{{ t('title') }}</h1>
          <span class="pill">EduGames.uz</span>
        </div>
        <div class="lang-group">
          <button
            v-for="lang in languages"
            :key="lang"
            class="lang-btn"
            :class="{ 'is-active': currentLang === lang }"
            @click="setLanguage(lang)"
          >
            {{ lang.toUpperCase() }}
          </button>
        </div>
      </header>

      <div class="card-grid">
        <NuxtLink
          v-for="item in subjects"
          :key="item.slug"
          :to="`/game/${item.slug}/`"
          class="subject-card"
          :class="item.variant"
        >
          <div class="subject-icon">{{ item.icon }}</div>
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t, currentLang, setLanguage, languages } = useLanguage()

const subjects = [
  { slug: 'matematika', title: 'Matematika', desc: "Tez hisoblash, algebra va geometriya.", icon: 'M', variant: 'v-orange' },
  { slug: 'rus-tili', title: 'Rus tili', desc: "Grammatika, lug'at va amaliy mashqlar.", icon: 'RU', variant: 'v-blue' },
  { slug: 'ingliz-tili', title: 'Ingliz tili', desc: "Grammar, vocabulary va conversation.", icon: 'EN', variant: 'v-orange' },
  { slug: 'kimyo', title: 'Kimyo', desc: "Atom, molekula, reaksiyalar bo'yicha savollar.", icon: 'K', variant: 'v-teal' },
  { slug: 'informatika', title: 'Informatika', desc: "Dasturlash, algoritmlar va texnologiya.", icon: 'IT', variant: 'v-green' },
  { slug: 'biologiya', title: 'Biologiya', desc: "Anatomiya, o'simliklar va ekologiya.", icon: 'B', variant: 'v-olive' },
  { slug: 'tarix', title: 'Tarix', desc: "Qadimiy voqealar, shaxslar va madaniyat.", icon: 'T', variant: 'v-blue' },
  { slug: 'ona-tili', title: 'Ona tili', desc: "Grammatika va qiziqarli testlar.", icon: 'OT', variant: 'v-orange' },
  { slug: 'adabiyot', title: 'Adabiyot', desc: "She'rlar, asarlar va yozuvchilar.", icon: 'A', variant: 'v-blue' },
  { slug: 'geografiya', title: 'Geografiya', desc: "Mamlakatlar, shaharlar va tabiat.", icon: 'G', variant: 'v-green' },
  { slug: 'fizika', title: 'Fizika', desc: "Kuch, energiya va tabiiy qonunlar.", icon: 'F', variant: 'v-purple' },
  { slug: 'turk-tili', title: 'Turk tili', desc: "So'z boyligi, grammatika va muloqot.", icon: 'TR', variant: 'v-pink' },
  { slug: 'tezkor-matematika', title: 'Tezkor matematika', desc: "Tezkor hisoblash mashqlari.", icon: 'TM', variant: 'v-pink' },
]
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

:root {
  --clr-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --clr-card: #ffffff;
  --clr-text: #1a1a2e;
  --clr-muted: #64748b;
  --shadow-soft: 0 4px 24px rgba(0,0,0,0.08);
  --radius-card: 20px;
  --radius-btn: 12px;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  background: var(--clr-bg);
  min-height: 100vh;
  color: var(--clr-text);
}

.home-page {
  display: flex;
  min-height: 100vh;
  padding: 1.5rem;
  gap: 1.5rem;
}

.social-rail {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.5rem;
}

.social-btn {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-btn);
  border: none;
  background: rgba(255,255,255,0.15);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.social-btn:hover { background: rgba(255,255,255,0.25); }

.home-card {
  flex: 1;
  background: var(--clr-card);
  border-radius: var(--radius-card);
  padding: clamp(1.25rem, 3vw, 2rem);
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.home-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
}
.home-header h1 {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(1.5rem, 4vw, 2rem);
  color: var(--clr-text);
}
.pill {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.25rem;
}

.lang-group {
  display: flex;
  gap: 0.5rem;
}
.lang-btn {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-btn);
  border: 2px solid #e2e8f0;
  background: transparent;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.lang-btn.is-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-color: transparent;
}
.lang-btn:hover:not(.is-active) {
  border-color: #667eea;
  color: #667eea;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}

.subject-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 16px;
  text-decoration: none;
  color: #fff;
  transition: transform 0.2s, box-shadow 0.2s;
}
.subject-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0,0,0,0.15);
}
.subject-card h3 { font-size: 1.1rem; margin-bottom: 0.25rem; }
.subject-card p { opacity: 0.9; font-size: 0.85rem; }
.subject-icon {
  width: 52px;
  height: 52px;
  background: rgba(255,255,255,0.2);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.v-orange  { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.v-blue    { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.v-green   { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
.v-teal    { background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%); }
.v-olive   { background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%); }
.v-purple  { background: linear-gradient(135deg, #7f00ff 0%, #e100ff 100%); }
.v-pink    { background: linear-gradient(135deg, #ff0844 0%, #ffb199 100%); }

@media (max-width: 600px) {
  .home-page { flex-direction: column; padding: 1rem; }
  .social-rail { flex-direction: row; justify-content: center; }
}
</style>
