<template>
  <div class="sack-arena">
    <div class="arena-bg">
      <!-- Sky -->
      <div class="sky"></div>

      <!-- Track with racers -->
      <div class="track-container">
        <!-- Track background image -->
        <img
          src="/assets/themes/balap_karung/track.png"
          alt="Track"
          class="track-image"
        />

        <!-- Racers on track -->
        <div class="racers">
          <!-- Blue racer (left team) -->
          <div class="racer-wrapper blue-racer" :style="blueRacerStyle">
            <img
              :src="blueCharacterImage"
              alt="Blue Racer"
              class="racer-image"
              :class="{ hopping: leftProgress > 0.02 }"
            />
          </div>

          <!-- Red racer (right team) -->
          <div class="racer-wrapper red-racer" :style="redRacerStyle">
            <img
              :src="redCharacterImage"
              alt="Red Racer"
              class="racer-image"
              :class="{ hopping: rightProgress > 0.02 }"
            />
          </div>
        </div>
      </div>

      <!-- Game Info -->
      <div class="game-info">
        To'g'ri javob bering va marraga yeting! (10 ta sakrash g'alaba)
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  leftProgress: number
  rightProgress: number
}>()

// Race distance in percentage
const raceDistance = 70 // percentage of track width

// Character images based on movement state
const blueCharacterImage = computed(() => {
  return props.leftProgress > 0.02
    ? '/assets/themes/balap_karung/blue_hop.png'
    : '/assets/themes/balap_karung/blue_stand.png'
})

const redCharacterImage = computed(() => {
  return props.rightProgress > 0.02
    ? '/assets/themes/balap_karung/red_hop.png'
    : '/assets/themes/balap_karung/red_stand.png'
})

// Racer position styles
const blueRacerStyle = computed(() => ({
  left: `${5 + props.leftProgress * raceDistance}%`,
  transition: 'left 0.3s ease-out'
}))

const redRacerStyle = computed(() => ({
  left: `${5 + props.rightProgress * raceDistance}%`,
  transition: 'left 0.3s ease-out'
}))
</script>

<style scoped>
.sack-arena {
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
  background: linear-gradient(180deg,
    #87CEEB 0%,
    #B0E0E6 40%,
    #98FB98 60%,
    #90EE90 100%
  );
  position: relative;
  display: flex;
  flex-direction: column;
}

.sky {
  flex: 1;
  min-height: 40%;
}

.track-container {
  position: relative;
  width: 100%;
  padding: 0 20px;
  margin-bottom: 30px;
}

.track-image {
  width: 100%;
  height: auto;
  display: block;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.racers {
  position: absolute;
  top: 0;
  left: 20px;
  right: 20px;
  bottom: 0;
  pointer-events: none;
}

.racer-wrapper {
  position: absolute;
  bottom: 50%;
  transform: translateY(50%);
}

.blue-racer {
  z-index: 2;
}

.red-racer {
  z-index: 1;
  margin-bottom: -15px;
}

.racer-image {
  height: 100px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
}

.racer-image.hopping {
  animation: hop 0.35s ease-in-out infinite;
}

@keyframes hop {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(3deg);
  }
}

.game-info {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 0.9rem;
  white-space: nowrap;
  z-index: 10;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .track-container {
    padding: 0 10px;
  }

  .racers {
    left: 10px;
    right: 10px;
  }

  .racer-image {
    height: 70px;
  }

  .game-info {
    font-size: 0.75rem;
    padding: 6px 14px;
  }
}

@media (max-width: 500px) {
  .racer-image {
    height: 50px;
  }

  .red-racer {
    margin-bottom: -10px;
  }
}
</style>
