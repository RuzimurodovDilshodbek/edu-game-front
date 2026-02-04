<template>
  <div class="game-board">
    <header class="game-header">
      <button class="home-btn" @click="handleGoHome">
        <span>&larr;</span>
      </button>
      <div class="game-title">
        <h1>{{ subjectTitle }}</h1>
        <span class="game-type-badge">{{ t(`games.${gameType}.name`) }}</span>
      </div>
      <div class="timer">{{ formattedTime }}</div>
    </header>

    <div class="game-content">
      <QuizPanel
        ref="leftPanel"
        side="left"
        :team-name="leftTeamName"
        :score="scores.left"
        :current-question="currentQuiz.left"
        :locked="locks.left"
        :is-active="isActive"
        @answer="(opt) => handleAnswer('left', opt)"
      />

      <div class="arena-container">
        <TugOfWarArena
          v-if="gameType === 'tugofwar'"
          :position="position"
          :is-active="isActive"
        />
        <PoleClimbingArena
          v-else-if="gameType === 'poleclimbing'"
          :left-progress="progress.left"
          :right-progress="progress.right"
        />
        <SackRaceArena
          v-else-if="gameType === 'sackrace'"
          :left-progress="progress.left"
          :right-progress="progress.right"
        />
      </div>

      <QuizPanel
        ref="rightPanel"
        side="right"
        :team-name="rightTeamName"
        :score="scores.right"
        :current-question="currentQuiz.right"
        :locked="locks.right"
        :is-active="isActive"
        @answer="(opt) => handleAnswer('right', opt)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GameType, Side } from '~/composables/useGameState'
import QuizPanel from './QuizPanel.vue'
import TugOfWarArena from './TugOfWarArena.vue'
import PoleClimbingArena from './PoleClimbingArena.vue'
import SackRaceArena from './SackRaceArena.vue'

const { t } = useLanguage()

const props = defineProps<{
  gameType: GameType
  subjectSlug: string
  subjectTitle: string
  leftTeamName: string
  rightTeamName: string
  position: number
  scores: { left: number; right: number }
  locks: { left: boolean; right: boolean }
  currentQuiz: { left: any; right: any }
  isActive: boolean
  formattedTime: string
  progress: { left: number; right: number }
}>()

const emit = defineEmits<{
  answer: [side: Side, option: string, isCorrect: boolean]
  goHome: []
}>()

const leftPanel = ref<InstanceType<typeof QuizPanel> | null>(null)
const rightPanel = ref<InstanceType<typeof QuizPanel> | null>(null)

const { checkAnswer } = useQuestions()

function handleAnswer(side: Side, option: string) {
  const quiz = props.currentQuiz[side]
  if (!quiz) return

  const isCorrect = checkAnswer(quiz, option)

  // Show feedback on panel
  const panel = side === 'left' ? leftPanel.value : rightPanel.value
  panel?.showFeedback(isCorrect)

  emit('answer', side, option, isCorrect)
}

function handleGoHome() {
  emit('goHome')
}
</script>

<style scoped>
.game-board {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
  box-sizing: border-box;
}

.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin-bottom: 1rem;
}

.home-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.2s;
}

.home-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.game-title {
  text-align: center;
  color: white;
}

.game-title h1 {
  margin: 0;
  font-size: 1.5rem;
}

.game-type-badge {
  font-size: 0.85rem;
  opacity: 0.9;
}

.timer {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-family: monospace;
}

.game-content {
  flex: 1;
  display: flex;
  gap: 1rem;
  min-height: 0;
}

.arena-container {
  flex: 1;
  display: flex;
  align-items: stretch;
}

@media (max-width: 900px) {
  .game-content {
    flex-direction: column;
  }

  .arena-container {
    order: -1;
    min-height: 200px;
  }
}
</style>
