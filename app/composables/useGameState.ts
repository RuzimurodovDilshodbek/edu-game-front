export type GameType = 'tugofwar' | 'poleclimbing' | 'sackrace'
export type GameScreen = 'game-select' | 'team-setup' | 'countdown' | 'playing' | 'finished'
export type Side = 'left' | 'right'

interface GameConfig {
  step: number
  winLimit: number
  countdownStart: number
  wrongStepFactor: number
}

interface Scores {
  left: number
  right: number
}

interface CurrentQuiz {
  left: { question: string; h: string; options: string[] } | null
  right: { question: string; h: string; options: string[] } | null
}

interface Locks {
  left: boolean
  right: boolean
}

interface QuestionOrder {
  left: number[]
  right: number[]
  leftIndex: number
  rightIndex: number
}

export function useGameState() {
  const config: GameConfig = {
    step: 30,        // Smaller steps = longer game, smoother movement
    winLimit: 300,   // 10 correct answers to win (300/30=10)
    countdownStart: 3,
    wrongStepFactor: 1 / 3
  }

  const screen = ref<GameScreen>('game-select')
  const gameType = ref<GameType>('tugofwar')
  const subjectSlug = ref('')

  const position = ref(0)
  const isActive = ref(false)

  const leftTeamName = ref('')
  const rightTeamName = ref('')

  const scores = ref<Scores>({ left: 0, right: 0 })
  const locks = ref<Locks>({ left: false, right: false })
  const currentQuiz = ref<CurrentQuiz>({ left: null, right: null })

  const startTime = ref<number | null>(null)
  const elapsedTime = ref(0)

  const winner = ref<Side | null>(null)
  const winnerName = ref('')
  const winnerScore = ref(0)

  const questionOrder = ref<QuestionOrder>({
    left: [],
    right: [],
    leftIndex: 0,
    rightIndex: 0
  })

  function setGameType(type: GameType) {
    gameType.value = type
  }

  function setSubject(slug: string) {
    subjectSlug.value = slug
  }

  function setTeamNames(left: string, right: string) {
    leftTeamName.value = left || 'Chap jamoa'
    rightTeamName.value = right || "O'ng jamoa"
  }

  function resetGame() {
    position.value = 0
    isActive.value = false
    scores.value = { left: 0, right: 0 }
    locks.value = { left: false, right: false }
    currentQuiz.value = { left: null, right: null }
    startTime.value = null
    elapsedTime.value = 0
    winner.value = null
    winnerName.value = ''
    winnerScore.value = 0
  }

  function prepareQuestionOrder(questions: any[]) {
    const n = questions.length
    if (!n) return

    const indices = Array.from({ length: n }, (_, i) => i)

    // Shuffle for left side
    const leftIndices = [...indices]
    for (let i = leftIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[leftIndices[i], leftIndices[j]] = [leftIndices[j], leftIndices[i]]
    }

    // Shuffle for right side
    const rightIndices = [...indices]
    for (let i = rightIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[rightIndices[i], rightIndices[j]] = [rightIndices[j], rightIndices[i]]
    }

    questionOrder.value = {
      left: leftIndices,
      right: rightIndices,
      leftIndex: 0,
      rightIndex: 0
    }
  }

  function getNextQuestion(side: Side, questions: any[]): any | null {
    const n = questions.length
    if (!n) return null

    const keyIndex = `${side}Index` as 'leftIndex' | 'rightIndex'
    const order = questionOrder.value

    if (order[keyIndex] >= order[side].length) {
      // Reshuffle when all questions used
      const indices = Array.from({ length: n }, (_, i) => i)
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[indices[i], indices[j]] = [indices[j], indices[i]]
      }
      order[side] = indices
      order[keyIndex] = 0
    }

    const idx = order[side][order[keyIndex]]
    order[keyIndex] += 1

    return questions[idx] || null
  }

  function processAnswer(side: Side, isCorrect: boolean, questions: any[]) {
    if (isCorrect) {
      scores.value[side] += 1
      // Only update position for tug of war
      if (gameType.value === 'tugofwar') {
        if (side === 'left') {
          position.value -= config.step
        } else {
          position.value += config.step
        }
      }
    } else {
      // Only penalize position in tug of war
      if (gameType.value === 'tugofwar') {
        const backStep = config.step * config.wrongStepFactor
        if (side === 'left') {
          position.value += backStep
        } else {
          position.value -= backStep
        }
      }
    }

    // Check win condition based on game type
    if (gameType.value === 'tugofwar') {
      // Tug of war wins by rope position
      if (Math.abs(position.value) >= config.winLimit) {
        endGame(questions)
        return true
      }
    } else {
      // Pole climbing and sack race win by reaching target score
      if (scores.value.left >= winScoreTarget || scores.value.right >= winScoreTarget) {
        endGame(questions)
        return true
      }
    }

    // Check if all questions answered
    const totalQuestions = questions.length
    if (scores.value.left >= totalQuestions || scores.value.right >= totalQuestions) {
      endGame(questions)
      return true
    }

    return false
  }

  function endGame(questions: any[]) {
    isActive.value = false

    let winnerSide: Side

    if (gameType.value === 'tugofwar') {
      // Tug of war: winner based on rope position
      if (scores.value.left >= questions.length) {
        winnerSide = 'left'
      } else if (scores.value.right >= questions.length) {
        winnerSide = 'right'
      } else {
        winnerSide = position.value < 0 ? 'left' : 'right'
      }
    } else {
      // Pole climbing / Sack race: winner is first to reach target score
      if (scores.value.left >= winScoreTarget) {
        winnerSide = 'left'
      } else if (scores.value.right >= winScoreTarget) {
        winnerSide = 'right'
      } else {
        // If neither reached target, higher score wins
        winnerSide = scores.value.left >= scores.value.right ? 'left' : 'right'
      }
    }

    winner.value = winnerSide
    winnerName.value = winnerSide === 'left' ? leftTeamName.value : rightTeamName.value
    winnerScore.value = scores.value[winnerSide]
    screen.value = 'finished'
  }

  function startPlaying() {
    isActive.value = true
    startTime.value = Date.now()
    screen.value = 'playing'
  }

  function lockSide(side: Side) {
    locks.value[side] = true
  }

  function unlockSide(side: Side) {
    locks.value[side] = false
  }

  function setCurrentQuiz(side: Side, quiz: any) {
    currentQuiz.value[side] = quiz
  }

  function updateElapsedTime() {
    if (startTime.value) {
      elapsedTime.value = Date.now() - startTime.value
    }
  }

  function formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
  }

  const formattedTime = computed(() => formatTime(elapsedTime.value))

  // Progress calculations for different game types
  // For tug of war - based on rope position
  const progress = computed(() => {
    const p = (position.value + config.winLimit) / (2 * config.winLimit)
    return {
      left: Math.max(0, 0.5 - p) * 2,
      right: Math.max(0, p - 0.5) * 2
    }
  })

  // For pole climbing and sack race - based on individual scores
  const winScoreTarget = 7 // Number of correct answers to win
  const scoreProgress = computed(() => {
    return {
      left: Math.min(1, scores.value.left / winScoreTarget),
      right: Math.min(1, scores.value.right / winScoreTarget)
    }
  })

  return {
    config,
    screen,
    gameType,
    subjectSlug,
    position,
    isActive,
    leftTeamName,
    rightTeamName,
    scores,
    locks,
    currentQuiz,
    startTime,
    elapsedTime,
    winner,
    winnerName,
    winnerScore,
    formattedTime,
    progress,
    scoreProgress,
    winScoreTarget,
    setGameType,
    setSubject,
    setTeamNames,
    resetGame,
    prepareQuestionOrder,
    getNextQuestion,
    processAnswer,
    startPlaying,
    lockSide,
    unlockSide,
    setCurrentQuiz,
    updateElapsedTime
  }
}
