const translations = {
  uz: {
    pageTitle: "Arqon Tortish: Informatika",
    gameSubtitle: "To'g'ri javob - arqon siz tomonga tortiladi.\nNoto'g'ri javob - arqon raqib tomonga siljiydi va darhol yangi savol chiqadi.",
    modalTitle: "JAMOALARNI TAYYORLANG",
    team1Label: "1-JAMOA (KO'K)",
    team2Label: "2-JAMOA (QIZIL)",
    teamPlaceholder: "Jamoa nomi",
    startBtn: "O'yinni boshlash",
    playAgain: "Qayta o'ynash",
    homeBtn: "Home",
    leftTeamDefault: "1-Jamoa",
    rightTeamDefault: "2-Jamoa",
    winnerMessage: "G'olib bo'ldi!",
    correctAnswers: "to'g'ri javob",
    time: "vaqt",
    devToolsWarning: "Developer tools aniqlandi! O'yin to'xtatildi.",
    countdown: { 3: "3", 2: "2", 1: "1", go: "BOSHLANDI!" }
  },
  ru: {
    pageTitle: "Peretyagivanie kanata: Informatika",
    gameSubtitle: "Pravilnyi otvet - kanat tyanetsya k vashey storone.\nNepravilnyi - k soperniku, i srazu poyavlyaetsya novyi vopros.",
    modalTitle: "PODGOTOVTE KOMANDY",
    team1Label: "KOMANDA 1 (SINYA)",
    team2Label: "KOMANDA 2 (KRASNAYA)",
    teamPlaceholder: "Nazvanie komandy",
    startBtn: "Nachat igru",
    playAgain: "Igrat snova",
    homeBtn: "Home",
    leftTeamDefault: "Komanda 1",
    rightTeamDefault: "Komanda 2",
    winnerMessage: "Pobeda!",
    correctAnswers: "pravilnykh otvetov",
    time: "vremya",
    devToolsWarning: "Instrumenty razrabotchika obnaruzheny! Igra ostanovlena.",
    countdown: { 3: "3", 2: "2", 1: "1", go: "NACHALI!" }
  },
  en: {
    pageTitle: "Tug of War: Informatics",
    gameSubtitle: "Correct answer pulls the rope toward your team.\nWrong answer pulls it toward the opponent and a new question appears immediately.",
    modalTitle: "PREPARE YOUR TEAMS",
    team1Label: "TEAM 1 (BLUE)",
    team2Label: "TEAM 2 (RED)",
    teamPlaceholder: "Team name",
    startBtn: "Start game",
    playAgain: "Play again",
    homeBtn: "Home",
    leftTeamDefault: "Team 1",
    rightTeamDefault: "Team 2",
    winnerMessage: "Winner!",
    correctAnswers: "correct answers",
    time: "time",
    devToolsWarning: "Developer tools detected! Game paused.",
    countdown: { 3: "3", 2: "2", 1: "1", go: "GO!" }
  }
};

const gameTitles = {
  "matematika": { uz: "Arqon Tortish: Matematika", ru: "Peretyagivanie kanata: Matematika", en: "Tug of War: Math" },
  "tezkor-matematika": { uz: "Arqon Tortish: Tezkor matematika", ru: "Peretyagivanie kanata: Bystra matematika", en: "Tug of War: Quick Math" },
  "rus-tili": { uz: "Arqon Tortish: Rus tili", ru: "Peretyagivanie kanata: Russkiy yazyk", en: "Tug of War: Russian" },
  "ingliz-tili": { uz: "Arqon Tortish: Ingliz tili", ru: "Peretyagivanie kanata: Angliyskiy yazyk", en: "Tug of War: English" },
  "kimyo": { uz: "Arqon Tortish: Kimyo", ru: "Peretyagivanie kanata: Himiya", en: "Tug of War: Chemistry" },
  "informatika": { uz: "Arqon Tortish: Informatika", ru: "Peretyagivanie kanata: Informatika", en: "Tug of War: Informatics" },
  "biologiya": { uz: "Arqon Tortish: Biologiya", ru: "Peretyagivanie kanata: Biologiya", en: "Tug of War: Biology" },
  "tarix": { uz: "Arqon Tortish: Tarix", ru: "Peretyagivanie kanata: Istoriya", en: "Tug of War: History" },
  "ona-tili": { uz: "Arqon Tortish: Ona tili", ru: "Peretyagivanie kanata: Rodnoy yazyk", en: "Tug of War: Native Language" },
  "adabiyot": { uz: "Arqon Tortish: Adabiyot", ru: "Peretyagivanie kanata: Literatura", en: "Tug of War: Literature" },
  "geografiya": { uz: "Arqon Tortish: Geografiya", ru: "Peretyagivanie kanata: Geografiya", en: "Tug of War: Geography" },
  "fizika": { uz: "Arqon Tortish: Fizika", ru: "Peretyagivanie kanata: Fizika", en: "Tug of War: Physics" },
  "turk-tili": { uz: "Arqon Tortish: Turk tili", ru: "Peretyagivanie kanata: Turetskiy yazyk", en: "Tug of War: Turkish" }
};

class I18n {
  constructor() {
    this.currentLang = localStorage.getItem('gameLang') || 'uz';
    this.init();
  }

  init() {
    this.setupLanguageButtons();
    this.updateLanguage(this.currentLang);
  }

  setupLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.updateLanguage(btn.getAttribute('data-lang'));
      });
      if (btn.getAttribute('data-lang') === this.currentLang) {
        btn.classList.add('active');
      }
    });
  }

  updateLanguage(lang) {
    if (!translations[lang]) return;

    this.currentLang = lang;
    localStorage.setItem('gameLang', lang);
    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    this.translatePage();
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  }

  translatePage() {
    const t = translations[this.currentLang];

    const cfg = window.__GAME_CONFIG__ || {};
    const match = window.location.pathname.match(/\/game\/([^/]+)\//);
    const slug = cfg.gameSlug || (match ? match[1] : "");
    const titleOverride = slug && gameTitles[slug] ? gameTitles[slug][this.currentLang] : null;
    const pageTitle = titleOverride || t.pageTitle;

    document.title = pageTitle;

    const setContent = (id, text, upper = false) => {
      const el = document.getElementById(id);
      if (el) el.textContent = upper ? text.toUpperCase() : text;
    };

    setContent('pageTitle', pageTitle);
    setContent('gameTitle', pageTitle, true);
    setContent('gameSubtitle', t.gameSubtitle);
    setContent('modalTitle', t.modalTitle);
    setContent('team1Label', t.team1Label);
    setContent('team2Label', t.team2Label);
    setContent('startBtnText', t.startBtn, true);
    setContent('playAgainText', t.playAgain, true);
    setContent('homeBtnText', t.homeBtn, true);
    setContent('winnerMessage', t.winnerMessage);
    setContent('correctAnswersLabel', t.correctAnswers);
    setContent('timeLabel', t.time);

    const setPlaceholder = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.placeholder = text;
    };

    setPlaceholder('teamLeftName', t.teamPlaceholder);
    setPlaceholder('teamRightName', t.teamPlaceholder);
  }

  t(key) {
    return translations[this.currentLang]?.[key] || key;
  }

  getCountdown(num) {
    return translations[this.currentLang]?.countdown?.[num] || String(num);
  }
}

const i18n = new I18n();
window.i18n = i18n;
