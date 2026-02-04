const STORAGE_KEY = 'gameLang'
const DEFAULT_LANG = 'uz'

const translations = {
  uz: {
    title: "Interaktiv o'yinlar",
    selectGame: "O'yin turini tanlang",
    selectSubject: "Fan tanlang",
    startGame: "O'yinni boshlash",
    teamLeft: "Chap jamoa",
    teamRight: "O'ng jamoa",
    leftTeamDefault: "Chap jamoa",
    rightTeamDefault: "O'ng jamoa",
    questionsNotLoaded: "Savollar yuklanmadi",
    noQuestions: "Savollar topilmadi",
    winnerMessage: "G'alaba!",
    correctAnswers: "To'g'ri javoblar",
    time: "Vaqt",
    playAgain: "Qayta o'ynash",
    backToHome: "Bosh sahifa",
    games: {
      tugofwar: {
        name: "Arqon tortish",
        desc: "Savollarga to'g'ri javob berib, arqonni o'z tomoningizga torting"
      },
      poleclimbing: {
        name: "Ustun ko'tarish",
        desc: "Har bir to'g'ri javob bilan yuqoriga ko'tariling"
      },
      sackrace: {
        name: "Qop poygasi",
        desc: "To'g'ri javob berib, marraga birinchi yeting"
      }
    },
    countdown: {
      1: "1",
      2: "2",
      3: "3",
      go: "Boshlang!"
    }
  },
  ru: {
    title: "Интерактивные игры",
    selectGame: "Выберите тип игры",
    selectSubject: "Выберите предмет",
    startGame: "Начать игру",
    teamLeft: "Левая команда",
    teamRight: "Правая команда",
    leftTeamDefault: "Левая команда",
    rightTeamDefault: "Правая команда",
    questionsNotLoaded: "Вопросы не загружены",
    noQuestions: "Вопросы не найдены",
    winnerMessage: "Победа!",
    correctAnswers: "Правильных ответов",
    time: "Время",
    playAgain: "Играть снова",
    backToHome: "На главную",
    games: {
      tugofwar: {
        name: "Перетягивание каната",
        desc: "Ответьте правильно на вопросы, чтобы перетянуть канат на свою сторону"
      },
      poleclimbing: {
        name: "Лазание по столбу",
        desc: "С каждым правильным ответом поднимайтесь выше"
      },
      sackrace: {
        name: "Бег в мешках",
        desc: "Отвечайте правильно и первыми достигните финиша"
      }
    },
    countdown: {
      1: "1",
      2: "2",
      3: "3",
      go: "Старт!"
    }
  },
  en: {
    title: "Interactive Games",
    selectGame: "Select Game Type",
    selectSubject: "Select Subject",
    startGame: "Start Game",
    teamLeft: "Left Team",
    teamRight: "Right Team",
    leftTeamDefault: "Left Team",
    rightTeamDefault: "Right Team",
    questionsNotLoaded: "Questions not loaded",
    noQuestions: "No questions found",
    winnerMessage: "Victory!",
    correctAnswers: "Correct answers",
    time: "Time",
    playAgain: "Play Again",
    backToHome: "Back to Home",
    games: {
      tugofwar: {
        name: "Tug of War",
        desc: "Answer questions correctly to pull the rope to your side"
      },
      poleclimbing: {
        name: "Pole Climbing",
        desc: "Climb higher with each correct answer"
      },
      sackrace: {
        name: "Sack Race",
        desc: "Answer correctly and be the first to reach the finish"
      }
    },
    countdown: {
      1: "1",
      2: "2",
      3: "3",
      go: "Go!"
    }
  }
}

type Lang = 'uz' | 'ru' | 'en'

export function useLanguage() {
  const currentLang = useState<Lang>('language', () => {
    if (import.meta.client) {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang
      return saved && ['uz', 'ru', 'en'].includes(saved) ? saved : DEFAULT_LANG
    }
    return DEFAULT_LANG
  })

  function setLanguage(lang: Lang) {
    currentLang.value = lang
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, lang)
    }
  }

  function t(key: string): string {
    const keys = key.split('.')
    let value: any = translations[currentLang.value]
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key
      }
    }
    return typeof value === 'string' ? value : key
  }

  function getCountdown(num: number | 'go'): string {
    const key = num === 'go' ? 'go' : String(num)
    return t(`countdown.${key}`)
  }

  return {
    currentLang: readonly(currentLang),
    setLanguage,
    t,
    getCountdown,
    languages: ['uz', 'ru', 'en'] as const
  }
}
