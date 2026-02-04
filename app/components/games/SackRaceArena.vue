<template>
  <div class="sack-arena">
    <div class="arena-bg">
      <!-- Title -->
      <div class="game-title">Qop Poygasi</div>

      <!-- Track with racers -->
      <div class="track-container">
        <!-- Track background image -->
        <img
          src="/assets/themes/balap_karung/track.png"
          alt="Track"
          class="track-image"
        />

        <!-- Racers on track - side by side -->
        <div class="racers-container">
          <!-- Blue racer (left team) - front position -->
          <div class="racer blue-racer" :style="blueRacerStyle">
            <img
              :src="blueCharacterImage"
              alt="Blue Racer"
              class="racer-image"
              :class="{ hopping: blueIsHopping }"
            />
          </div>

          <!-- Red racer (right team) - back position -->
          <div class="racer red-racer" :style="redRacerStyle">
            <img
              :src="redCharacterImage"
              alt="Red Racer"
              class="racer-image"
              :class="{ hopping: redIsHopping }"
            />
          </div>
        </div>
      </div>

      <!-- Game Info -->
      <div class="game-info">
        Savolga javob bering va marraga yeting! (7 ta to'g'ri javob g'alaba)
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  leftProgress: number
  rightProgress: number
}>()

// Race distance in percentage of track width
const startPosition = 8
const raceDistance = 65

// Hopping state - only hop briefly when progress changes
const blueIsHopping = ref(false)
const redIsHopping = ref(false)

// Watch for progress changes to trigger hop animation
watch(() => props.leftProgress, (newVal, oldVal) => {
  if (newVal > oldVal) {
    // Progress increased - do a hop
    blueIsHopping.value = true
    setTimeout(() => {
      blueIsHopping.value = false
    }, 400) // Hop for 400ms then stop
  }
})

watch(() => props.rightProgress, (newVal, oldVal) => {
  if (newVal > oldVal) {
    // Progress increased - do a hop
    redIsHopping.value = true
    setTimeout(() => {
      redIsHopping.value = false
    }, 400)
  }
})

// Character images - show hop image only while hopping
const blueCharacterImage = computed(() => {
  return blueIsHopping.value
    ? '/assets/themes/balap_karung/blue_hop.png'
    : '/assets/themes/balap_karung/blue_stand.png'
})

const redCharacterImage = computed(() => {
  return redIsHopping.value
    ? '/assets/themes/balap_karung/red_hop.png'
    : '/assets/themes/balap_karung/red_stand.png'
})

// Racer position styles
const blueRacerStyle = computed(() => ({
  left: `${startPosition + props.leftProgress * raceDistance}%`
}))

const redRacerStyle = computed(() => ({
  left: `${startPosition + props.rightProgress * raceDistance}%`
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
    #98D8C8 50%,
    #90EE90 100%
  );
  position: relative;
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
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a365d;
}

.track-container {
  position: relative;
  width: 85%;
  max-width: 700px;
}

.track-image {
  width: 100%;
  height: auto;
  display: block;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.25));
}

.racers-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.racer {
  position: absolute;
  transition: left 0.4s ease-out;
}

/* Blue racer - front lane */
.blue-racer {
  bottom: 15%;
  z-index: 2;
}

/* Red racer - back lane */
.red-racer {
  bottom: 35%;
  z-index: 1;
}

.racer-image {
  height: 90px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(2px 3px 4px rgba(0, 0, 0, 0.3));
  transition: transform 0.1s ease-out;
}

/* Single hop animation when answering */
.racer-image.hopping {
  animation: singleHop 0.4s ease-out;
}

@keyframes singleHop {
  0% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-20px) rotate(5deg);
  }
  60% {
    transform: translateY(-10px) rotate(-2deg);
  }
  100% {
    transform: translateY(0) rotate(0deg);
  }
}

/* Game info */
.game-info {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 100, 80, 0.8);
  color: white;
  padding: 10px 24px;
  border-radius: 25px;
  font-size: 0.9rem;
  white-space: nowrap;
  z-index: 10;
}

/* Responsive adjustments */
@media (max-width: 900px) {
  .track-container {
    width: 90%;
  }

  .racer-image {
    height: 75px;
  }

  .game-title {
    font-size: 1.2rem;
  }
}

@media (max-width: 768px) {
  .racer-image {
    height: 60px;
  }

  .game-info {
    font-size: 0.75rem;
    padding: 8px 16px;
  }

  .blue-racer {
    bottom: 12%;
  }

  .red-racer {
    bottom: 32%;
  }
}

@media (max-width: 500px) {
  .racer-image {
    height: 50px;
  }

  .game-title {
    font-size: 1rem;
    top: 15px;
  }

  .blue-racer {
    bottom: 10%;
  }

  .red-racer {
    bottom: 28%;
  }
}
</style>
