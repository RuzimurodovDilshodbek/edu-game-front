<template>
  <div class="game-selector-overlay">
    <div class="game-selector-modal">
      <h2>{{ t('selectGame') }}</h2>

      <div class="game-cards">
        <button
          v-for="game in games"
          :key="game.type"
          class="game-card"
          :class="game.colorClass"
          @click="$emit('select', game.type)"
        >
          <div class="game-icon">{{ game.icon }}</div>
          <div class="game-info">
            <h3>{{ t(`games.${game.type}.name`) }}</h3>
            <p>{{ t(`games.${game.type}.desc`) }}</p>
          </div>
        </button>
      </div>

      <button class="back-btn" @click="$emit('back')">
        <span class="back-icon">&larr;</span>
        {{ t('backToHome') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GameType } from '~/composables/useGameState'

const { t } = useLanguage()

defineEmits<{
  select: [type: GameType]
  back: []
}>()

const games = [
  { type: 'tugofwar' as const, icon: '🪢', colorClass: 'color-blue' },
  { type: 'poleclimbing' as const, icon: '🧗', colorClass: 'color-green' },
  { type: 'sackrace' as const, icon: '🏃', colorClass: 'color-orange' }
]
</script>

<style scoped>
.game-selector-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.game-selector-modal {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  text-align: center;
}

.game-selector-modal h2 {
  margin-bottom: 1.5rem;
  color: #1a1a2e;
  font-size: 1.5rem;
}

.game-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.game-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  text-align: left;
}

.game-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.game-card.color-blue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.game-card.color-green {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.game-card.color-orange {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.game-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.game-info h3 {
  margin: 0 0 0.25rem;
  font-size: 1.2rem;
}

.game-info p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

.back-btn {
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid #ddd;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.back-btn:hover {
  border-color: #667eea;
  color: #667eea;
}
</style>
