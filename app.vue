<template>
  <div class="relative">
    <Background class="fixed inset-0 -z-10" />
    <div class="container mx-auto px-4">
      <header class="py-8 flex justify-between items-center">
        <NuxtLink to="/" class="text-2xl font-bold">FP</NuxtLink>
        <div class="flex items-center space-x-8">
          <nav>
            <NuxtLink to="/projects" class="mx-4">Projects</NuxtLink>
            <NuxtLink to="/about" class="mx-4">About</NuxtLink>
          </nav>
          <div class="text-sm">UDINE, {{ currentTime }}</div>
        </div>
      </header>
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const currentTime = ref('')

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Rome'
  }) + ' CEST'
}

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
})
</script>

<style>
body {
  @apply bg-black text-white;
  font-family: 'Space Grotesk', sans-serif;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>