<template>
  <div class="countdown-overlay">
    <div class="countdown-display" :class="{ go: isGo }">
      {{ displayText }}
    </div>
  </div>
</template>

<script setup lang="ts">
const { getCountdown } = useLanguage()

const props = defineProps<{
  count: number | 'go'
}>()

const isGo = computed(() => props.count === 'go')

const displayText = computed(() => getCountdown(props.count))
</script>

<style scoped>
.countdown-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 150;
}

.countdown-display {
  font-size: 8rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  animation: pulse 1s ease-in-out;
}

.countdown-display.go {
  color: #2ecc71;
  animation: goAnimation 0.8s ease-out;
}

@keyframes pulse {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes goAnimation {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
