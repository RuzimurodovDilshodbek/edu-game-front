<template>
  <div class="game-page">
    <!-- Game Type Selection -->
    <GameSelector
      v-if="screen === 'game-select'"
      @select="handleGameSelect"
      @back="navigateToHome"
    />

    <!-- Team Setup -->
    <TeamSetup
      v-if="screen === 'team-setup'"
      :questions-loaded="questionsLoaded"
      @start="handleStartGame"
      @back="screen = 'game-select'"
    />

    <!-- Countdown -->
    <CountdownOverlay
      v-if="screen === 'countdown'"
      :count="countdownValue"
    />

    <!-- Game Board -->
    <GameBoard
      v-if="screen === 'playing' || screen === 'countdown'"
      :game-type="gameType"
      :subject-slug="slug"
      :subject-title="subjectTitle"
      :left-team-name="leftTeamName"
      :right-team-name="rightTeamName"
      :position="position"
      :scores="scores"
      :locks="locks"
      :current-quiz="currentQuiz"
      :is-active="isActive"
      :formatted-time="formattedTime"
      :progress="gameProgress"
      @answer="handleAnswer"
      @go-home="navigateToHome"
    />

    <!-- Winner Overlay -->
    <WinnerOverlay
      v-if="screen === 'finished'"
      :winner-name="winnerName"
      :winner-score="winnerScore"
      :winner-side="winner || 'left'"
      :time="formattedTime"
      @play-again="handlePlayAgain"
      @go-home="navigateToHome"
    />
  </div>
</template>

<script setup lang="ts">
import type { GameType, Side } from '~/composables/useGameState'
import GameSelector from '~/components/games/GameSelector.vue'
import TeamSetup from '~/components/games/TeamSetup.vue'
import CountdownOverlay from '~/components/games/CountdownOverlay.vue'
import GameBoard from '~/components/games/GameBoard.vue'
import WinnerOverlay from '~/components/games/WinnerOverlay.vue'

const route = useRoute()
const router = useRouter()
const { currentLang } = useLanguage()

const slug = computed(() => route.params.slug as string)

const subjects: Record<string, string> = {
  'matematika': 'Matematika',
  'rus-tili': 'Rus tili',
  'ingliz-tili': 'Ingliz tili',
  'kimyo': 'Kimyo',
  'informatika': 'Informatika',
  'biologiya': 'Biologiya',
  'tarix': 'Tarix',
  'ona-tili': 'Ona tili',
  'adabiyot': 'Adabiyot',
  'geografiya': 'Geografiya',
  'fizika': 'Fizika',
  'turk-tili': 'Turk tili',
  'tezkor-matematika': 'Tezkor matematika'
}

const subjectTitle = computed(() => subjects[slug.value] || slug.value)

// Game state
const {
  screen,
  gameType,
  position,
  isActive,
  leftTeamName,
  rightTeamName,
  scores,
  locks,
  currentQuiz,
  winner,
  winnerName,
  winnerScore,
  formattedTime,
  progress,
  scoreProgress,
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
} = useGameState()

// Use scoreProgress for pole climbing and sack race, progress for tug of war
const gameProgress = computed(() => {
  if (gameType.value === 'tugofwar') {
    return progress.value
  }
  return scoreProgress.value
})

// Questions
const { questions, loading, loadQuestions, checkAnswer } = useQuestions()

const questionsLoaded = computed(() => questions.value.length > 0 && !loading.value)

// Countdown
const countdownValue = ref<number | 'go'>(3)
let countdownInterval: ReturnType<typeof setInterval> | null = null
let timerInterval: ReturnType<typeof setInterval> | null = null

// Initialize
onMounted(() => {
  setSubject(slug.value)
  loadQuestionsForSubject()
})

// Watch for language changes
watch(currentLang, () => {
  loadQuestionsForSubject()
})

async function loadQuestionsForSubject() {
  await loadQuestions(slug.value, currentLang.value)
}

function handleGameSelect(type: GameType) {
  setGameType(type)
  screen.value = 'team-setup'
}

function handleStartGame(left: string, right: string) {
  if (!questionsLoaded.value) return

  setTeamNames(left, right)
  resetGame()
  prepareQuestionOrder(questions.value)
  startCountdown()
}

function startCountdown() {
  screen.value = 'countdown'
  countdownValue.value = 3

  countdownInterval = setInterval(() => {
    if (typeof countdownValue.value === 'number' && countdownValue.value > 1) {
      countdownValue.value--
    } else if (countdownValue.value === 1) {
      countdownValue.value = 'go'
    } else {
      if (countdownInterval) {
        clearInterval(countdownInterval)
        countdownInterval = null
      }
      startGamePlay()
    }
  }, 1000)
}

function startGamePlay() {
  startPlaying()

  // Generate initial questions
  generateQuiz('left')
  generateQuiz('right')

  // Start timer
  timerInterval = setInterval(() => {
    if (isActive.value) {
      updateElapsedTime()
    }
  }, 100)
}

function generateQuiz(side: Side) {
  const quiz = getNextQuestion(side, questions.value)
  setCurrentQuiz(side, quiz)
}

function handleAnswer(side: Side, option: string, isCorrect: boolean) {
  if (!isActive.value || locks.value[side]) return

  lockSide(side)

  const gameEnded = processAnswer(side, isCorrect, questions.value)

  const delay = isCorrect ? 800 : 1000

  setTimeout(() => {
    unlockSide(side)
    if (isActive.value && !gameEnded) {
      generateQuiz(side)
    }
  }, delay)

  if (gameEnded) {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }
}

function handlePlayAgain() {
  resetGame()
  screen.value = 'team-setup'
}

function navigateToHome() {
  cleanup()
  router.push('/')
}

function cleanup() {
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
.game-page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
