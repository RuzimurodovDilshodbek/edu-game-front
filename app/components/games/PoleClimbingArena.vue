<template>
  <div class="pole-arena">
    <div class="arena-bg">
      <!-- Ground -->
      <div class="ground"></div>

      <!-- Poles Container -->
      <div class="poles-container">
        <!-- Left Pole -->
        <div class="pole-wrapper">
          <img
            src="/assets/themes/pantaj_pinang/tiang.png"
            alt="Pole"
            class="pole-image"
          />
          <img
            :src="leftCharacterImage"
            alt="Left Climber"
            class="climber left-climber"
            :style="leftClimberStyle"
          />
        </div>

        <!-- Right Pole -->
        <div class="pole-wrapper">
          <img
            src="/assets/themes/pantaj_pinang/tiang.png"
            alt="Pole"
            class="pole-image"
          />
          <img
            :src="rightCharacterImage"
            alt="Right Climber"
            class="climber right-climber"
            :style="rightClimberStyle"
          />
        </div>
      </div>

      <!-- Game Info -->
      <div class="game-info">
        Savolga javob bering va ustunni ko'taring! (7 ta to'g'ri javob g'alaba)
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  leftProgress: number
  rightProgress: number
}>()

// Climb height in pixels (how far up the character moves)
const climbHeight = 320

// Character images based on climbing state
const leftCharacterImage = computed(() => {
  return props.leftProgress > 0.02
    ? '/assets/themes/pantaj_pinang/climbleft.png'
    : '/assets/themes/pantaj_pinang/standleft.png'
})

const rightCharacterImage = computed(() => {
  return props.rightProgress > 0.02
    ? '/assets/themes/pantaj_pinang/climbright.png'
    : '/assets/themes/pantaj_pinang/standright.png'
})

// Climber position styles - both climb independently
const leftClimberStyle = computed(() => ({
  bottom: `${20 + props.leftProgress * climbHeight}px`
}))

const rightClimberStyle = computed(() => ({
  bottom: `${20 + props.rightProgress * climbHeight}px`
}))
</script>

<style scoped>
.pole-arena {
  flex: 1;
  display: flex;
  align-items: stretch;
  min-height: 450px;
  border-radius: 16px;
  overflow: hidden;
}

.arena-bg {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg,
    #87CEEB 0%,
    #98D8C8 50%,
    #7FBC8C 100%
  );
  position: relative;
  display: flex;
  flex-direction: column;
}

.ground {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 18%;
  background: linear-gradient(180deg,
    #4CAF50 0%,
    #388E3C 50%,
    #2E7D32 100%
  );
}

.poles-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 80px;
  padding-bottom: 12%;
  position: relative;
  z-index: 1;
}

.pole-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pole-image {
  height: 450px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(3px 5px 8px rgba(0, 0, 0, 0.35));
}

.climber {
  position: absolute;
  height: 140px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(2px 3px 4px rgba(0, 0, 0, 0.3));
  z-index: 2;
  transition: bottom 0.4s ease-out;
}

.left-climber {
  /* Position on left side of pole */
  right: 45%;
}

.right-climber {
  /* Position on right side of pole */
  left: 45%;
}

.game-info {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 10px 24px;
  border-radius: 25px;
  font-size: 0.9rem;
  white-space: nowrap;
  z-index: 10;
  backdrop-filter: blur(4px);
}

/* Responsive adjustments */
@media (max-width: 900px) {
  .poles-container {
    gap: 50px;
  }

  .pole-image {
    height: 380px;
  }

  .climber {
    height: 110px;
  }
}

@media (max-width: 768px) {
  .poles-container {
    gap: 30px;
  }

  .pole-image {
    height: 320px;
  }

  .climber {
    height: 90px;
  }

  .game-info {
    font-size: 0.75rem;
    padding: 8px 16px;
  }
}

@media (max-width: 500px) {
  .poles-container {
    gap: 15px;
  }

  .pole-image {
    height: 250px;
  }

  .climber {
    height: 70px;
  }

  .left-climber {
    right: 40%;
  }

  .right-climber {
    left: 40%;
  }
}
</style>
