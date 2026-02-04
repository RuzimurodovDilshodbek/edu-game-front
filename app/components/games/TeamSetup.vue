<template>
  <div class="team-setup-overlay">
    <div class="team-setup-modal">
      <h2>{{ t('startGame') }}</h2>

      <div class="team-inputs">
        <div class="team-input-group left">
          <label>{{ t('teamLeft') }}</label>
          <input
            v-model="leftName"
            type="text"
            :placeholder="t('leftTeamDefault')"
            maxlength="20"
          />
        </div>

        <div class="vs-divider">VS</div>

        <div class="team-input-group right">
          <label>{{ t('teamRight') }}</label>
          <input
            v-model="rightName"
            type="text"
            :placeholder="t('rightTeamDefault')"
            maxlength="20"
          />
        </div>
      </div>

      <div class="modal-actions">
        <button class="back-btn" @click="$emit('back')">
          &larr; {{ t('backToHome') }}
        </button>
        <button
          class="start-btn"
          :disabled="!canStart"
          @click="handleStart"
        >
          {{ t('startGame') }} &rarr;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useLanguage()

const props = defineProps<{
  questionsLoaded: boolean
}>()

const emit = defineEmits<{
  start: [leftName: string, rightName: string]
  back: []
}>()

const leftName = ref('')
const rightName = ref('')

const canStart = computed(() => props.questionsLoaded)

function handleStart() {
  if (!canStart.value) return
  emit('start', leftName.value, rightName.value)
}
</script>

<style scoped>
.team-setup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.team-setup-modal {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  text-align: center;
}

.team-setup-modal h2 {
  margin-bottom: 1.5rem;
  color: #1a1a2e;
}

.team-inputs {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.team-input-group {
  flex: 1;
}

.team-input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
}

.team-input-group.left label {
  color: #0088cc;
}

.team-input-group.right label {
  color: #e74c3c;
}

.team-input-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  text-align: center;
  transition: border-color 0.2s;
}

.team-input-group.left input:focus {
  outline: none;
  border-color: #0088cc;
}

.team-input-group.right input:focus {
  outline: none;
  border-color: #e74c3c;
}

.vs-divider {
  font-weight: bold;
  font-size: 1.5rem;
  color: #888;
  padding-top: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.back-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #ddd;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.back-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.start-btn {
  padding: 0.75rem 2rem;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s;
}

.start-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.start-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
