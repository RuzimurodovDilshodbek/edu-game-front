<template>
  <div class="quiz-panel" :class="[side, { correct: showCorrect, wrong: showWrong }]">
    <div class="team-header">
      <span class="team-name">{{ teamName }}</span>
      <span class="score">{{ score }}</span>
    </div>

    <div class="problem-box">
      <div class="problem-text" ref="problemTextRef">
        {{ currentQuestion?.question || t('noQuestions') }}
      </div>
    </div>

    <div class="quiz-keypad">
      <button
        v-for="(option, idx) in shuffledOptions"
        :key="idx"
        class="quiz-btn"
        :class="{
          correct: selectedOption === option && showCorrect,
          wrong: selectedOption === option && showWrong,
          shake: selectedOption === option && showWrong
        }"
        :disabled="locked || !isActive"
        @click="handleAnswer(option)"
      >
        {{ option }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useLanguage()

const props = defineProps<{
  side: 'left' | 'right'
  teamName: string
  score: number
  currentQuestion: { question: string; h: string; options: string[] } | null
  locked: boolean
  isActive: boolean
}>()

const emit = defineEmits<{
  answer: [option: string]
}>()

const selectedOption = ref<string | null>(null)
const showCorrect = ref(false)
const showWrong = ref(false)
const shuffledOptions = ref<string[]>([])

function shuffleOptions() {
  if (!props.currentQuestion?.options) {
    shuffledOptions.value = []
    return
  }
  const options = [...props.currentQuestion.options]
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[options[i], options[j]] = [options[j], options[i]]
  }
  shuffledOptions.value = options
}

watch(() => props.currentQuestion, () => {
  selectedOption.value = null
  showCorrect.value = false
  showWrong.value = false
  shuffleOptions()
}, { immediate: true })

function handleAnswer(option: string) {
  if (props.locked || !props.isActive) return
  selectedOption.value = option
  emit('answer', option)
}

function showFeedback(isCorrect: boolean) {
  if (isCorrect) {
    showCorrect.value = true
    setTimeout(() => {
      showCorrect.value = false
    }, 800)
  } else {
    showWrong.value = true
    setTimeout(() => {
      showWrong.value = false
    }, 1000)
  }
}

defineExpose({ showFeedback })
</script>

<style scoped>
.quiz-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  min-width: 280px;
  transition: box-shadow 0.3s;
}

.quiz-panel.left {
  border-left: 4px solid #0088cc;
}

.quiz-panel.right {
  border-right: 4px solid #e74c3c;
}

.quiz-panel.correct {
  box-shadow: 0 0 20px rgba(46, 204, 113, 0.5);
}

.quiz-panel.wrong {
  box-shadow: 0 0 20px rgba(231, 76, 60, 0.5);
}

.team-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #eee;
}

.left .team-header {
  border-bottom-color: #0088cc;
}

.right .team-header {
  border-bottom-color: #e74c3c;
}

.team-name {
  font-weight: 600;
  font-size: 1.1rem;
}

.left .team-name {
  color: #0088cc;
}

.right .team-name {
  color: #e74c3c;
}

.score {
  font-size: 1.5rem;
  font-weight: bold;
}

.left .score {
  color: #0088cc;
}

.right .score {
  color: #e74c3c;
}

.problem-box {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1rem;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.problem-text {
  font-size: 1.25rem;
  font-weight: 500;
  text-align: center;
  word-break: break-word;
}

.quiz-keypad {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.quiz-btn {
  padding: 0.75rem;
  border: 2px solid #ddd;
  background: white;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  word-break: break-word;
}

.quiz-btn:hover:not(:disabled) {
  border-color: #667eea;
  background: #f0f2ff;
}

.quiz-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quiz-btn.correct {
  background: #2ecc71;
  border-color: #27ae60;
  color: white;
}

.quiz-btn.wrong {
  background: #e74c3c;
  border-color: #c0392b;
  color: white;
}

.quiz-btn.shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
}
</style>
