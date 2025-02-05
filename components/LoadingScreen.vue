
<template>
  <div 
    v-if="isLoading"
    class="fixed inset-0 bg-black z-50 flex items-center justify-center"
    :class="{ 'fade-out': isFading }"
  >
    <div class="text-center">
      <div class="loading-circle mb-4"></div>
      <div class="text-sm opacity-60">{{ loadingText }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isLoading: Boolean
})

const isFading = ref(false)
const loadingText = ref('Loading')

watch(() => props.isLoading, (newVal, oldVal) => {
  if (oldVal && !newVal) {
    isFading.value = true
  }
})

// Update loading text with dots animation
let dots = 0
setInterval(() => {
  dots = (dots + 1) % 4
  loadingText.value = 'Loading' + '.'.repeat(dots)
}, 500)
</script>

<style scoped>
.loading-circle {
  width: 40px;
  height: 40px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

.fade-out {
  animation: fadeOut 0.5s forwards;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeOut {
  to { opacity: 0; visibility: hidden; }
}
</style>
