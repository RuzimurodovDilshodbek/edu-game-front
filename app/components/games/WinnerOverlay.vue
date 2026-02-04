<template>
  <div class="winner-overlay">
    <div class="confetti-container">
      <div
        v-for="i in 50"
        :key="i"
        class="confetti"
        :style="confettiStyle(i)"
      ></div>
    </div>

    <div class="winner-modal">
      <div class="trophy">🏆</div>
      <h2 class="winner-name" :class="winnerSide">{{ winnerName }}</h2>
      <p class="winner-message">{{ t('winnerMessage') }}</p>

      <div class="stats">
        <div class="stat">
          <span class="stat-label">{{ t('correctAnswers') }}</span>
          <span class="stat-value">{{ winnerScore }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">{{ t('time') }}</span>
          <span class="stat-value">{{ time }}</span>
        </div>
      </div>

      <div class="actions">
        <button class="play-again-btn" @click="$emit('playAgain')">
          {{ t('playAgain') }}
        </button>
        <button class="home-btn" @click="$emit('goHome')">
          {{ t('backToHome') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useLanguage()

defineProps<{
  winnerName: string
  winnerScore: number
  winnerSide: 'left' | 'right'
  time: string
}>()

defineEmits<{
  playAgain: []
  goHome: []
}>()

const colors = ['#0088cc', '#e74c3c', '#f39c12', '#2ecc71', '#9b59b6']

function confettiStyle(index: number) {
  const color = colors[index % colors.length]
  const left = Math.random() * 100
  const delay = Math.random() * 2
  const duration = 2 + Math.random() * 2

  return {
    left: `${left}%`,
    backgroundColor: color,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}
</script>

<style scoped>
.winner-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.confetti-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  top: -20px;
  animation: fall linear infinite;
}

@keyframes fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

.winner-modal {
  background: white;
  border-radius: 24px;
  padding: 2.5rem;
  text-align: center;
  max-width: 400px;
  width: 90%;
  position: relative;
  z-index: 1;
  animation: popIn 0.5s ease-out;
}

@keyframes popIn {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.trophy {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.winner-name {
  font-size: 2rem;
  margin: 0 0 0.5rem;
}

.winner-name.left {
  color: #0088cc;
}

.winner-name.right {
  color: #e74c3c;
}

.winner-message {
  color: #666;
  margin-bottom: 1.5rem;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.stat {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1a1a2e;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.play-again-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.play-again-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.home-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #ddd;
  background: white;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.home-btn:hover {
  border-color: #667eea;
  color: #667eea;
}
</style>
