<template>
  <div 
    v-if="isLoading"
    class="fixed inset-0 bg-black z-50 flex items-center justify-center"
    :class="{ 'fade-out': isFading }"
  >
    <div class="text-center">
      <div class="loading-percentage text-8xl font-bold mb-8">{{ percentage }}%</div>
      <div class="loading-text text-xl opacity-60">{{ loadingText }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  isLoading: Boolean
})

const isFading = ref(false)
const percentage = ref(0)
const loadingText = ref('Loading')
let dotsInterval = null

// Animate percentage
const animatePercentage = () => {
  const duration = 2000 // 2 seconds
  const start = performance.now()
  
  const animate = (currentTime) => {
    const elapsed = currentTime - start
    const progress = Math.min(elapsed / duration, 1)
    
    percentage.value = Math.floor(progress * 100)
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  
  requestAnimationFrame(animate)
}

watch(() => props.isLoading, (newVal, oldVal) => {
  if (oldVal && !newVal) {
    isFading.value = true
  }
  if (newVal) {
    animatePercentage()
  }
})

onMounted(() => {
  // Update loading text with dots animation
  let dots = 0
  dotsInterval = setInterval(() => {
    dots = (dots + 1) % 4
    loadingText.value = 'Loading' + '.'.repeat(dots)
  }, 500)
})

onUnmounted(() => {
  if (dotsInterval) clearInterval(dotsInterval)
})
</script>

<style scoped>
.loading-percentage {
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
}

.fade-out {
  animation: fadeOut 0.8s forwards;
}

@keyframes fadeOut {
  to { opacity: 0; visibility: hidden; }
}
</style>