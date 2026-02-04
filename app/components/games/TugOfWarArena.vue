<template>
  <div class="tug-arena">
    <div class="arena-bg">
      <!-- Title -->
      <div class="game-title">Arqon Tortish</div>

      <!-- Center line marker -->
      <div class="center-line"></div>

      <!-- Tug of War Characters with Rope -->
      <div class="tug-container" :style="tugStyle">
        <img
          src="/assets/ui/character.png"
          alt="Tug of War"
          class="tug-image"
          :class="{ pulling: isActive }"
        />
      </div>

      <!-- Game Info -->
      <div class="game-info">
        Savolga javob bering va arqonni torting!
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  position: number
  isActive?: boolean
}>()

// Game logic uses winLimit of 300, but visually we want max 120px movement
// This keeps the characters from going past the center line
const gameWinLimit = 300
const visualMaxOffset = 120

const tugStyle = computed(() => {
  // Normalize position from game range (-300 to 300) to visual range (-120 to 120)
  const normalizedPosition = (props.position / gameWinLimit) * visualMaxOffset
  const clamped = Math.max(-visualMaxOffset, Math.min(visualMaxOffset, normalizedPosition))
  return {
    transform: `translateX(${clamped}px)`
  }
})
</script>

<style scoped>
.tug-arena {
  flex: 1;
  display: flex;
  align-items: stretch;
  min-height: 400px;
  border-radius: 16px;
  overflow: hidden;
}

.arena-bg {
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(180deg, #E8F4FC 0%, #D4EAF7 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.game-title {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a365d;
}

/* Center line */
.center-line {
  position: absolute;
  top: 25%;
  bottom: 25%;
  left: 50%;
  width: 2px;
  background: repeating-linear-gradient(
    to bottom,
    #4a5568 0px,
    #4a5568 8px,
    transparent 8px,
    transparent 16px
  );
  transform: translateX(-50%);
  z-index: 1;
}

/* Tug container */
.tug-container {
  position: relative;
  z-index: 2;
  transition: transform 0.3s ease-out;
}

.tug-image {
  height: 180px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}

.tug-image.pulling {
  animation: pull-shake 0.15s ease-in-out infinite alternate;
}

@keyframes pull-shake {
  0% {
    transform: translateX(-2px);
  }
  100% {
    transform: translateX(2px);
  }
}

/* Game info */
.game-info {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: #4a5568;
  font-size: 0.95rem;
  white-space: nowrap;
}

/* Responsive */
@media (max-width: 900px) {
  .tug-image {
    height: 150px;
  }

  .game-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 768px) {
  .tug-image {
    height: 120px;
  }

  .game-title {
    font-size: 1.1rem;
    top: 15px;
  }

  .game-info {
    font-size: 0.8rem;
    bottom: 15px;
  }
}

@media (max-width: 500px) {
  .tug-image {
    height: 100px;
  }

  .game-title {
    font-size: 1rem;
  }
}
</style>
