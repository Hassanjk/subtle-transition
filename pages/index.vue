<template>
  <main class="min-h-screen flex items-center">
    <div class="max-w-4xl">
      <h1 ref="title" class="text-6xl font-bold mb-8">
        Creative Developer & Designer
      </h1>
      <p ref="subtitle" class="text-xl mb-8 max-w-2xl">
        Crafting immersive digital experiences through code and design.
        Specialized in creative development and interactive animations.
      </p>
      <NuxtLink 
        to="/projects"
        class="inline-block px-8 py-4 bg-black text-white rounded-full"
      >
        View Projects
      </NuxtLink>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

const title = ref(null)
const subtitle = ref(null)

onMounted(() => {
  gsap.effects.clipTitle(title.value)
  gsap.effects.clipTitle(subtitle.value, {
    delay: 0.3
  })
})
</script>