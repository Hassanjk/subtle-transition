<template>
  <LoadingScreen :is-loading="isLoading" />
  
  <main class="min-h-screen relative text-white">
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 py-8 px-8 flex justify-between items-center z-50 bg-transparent">
      <NuxtLink to="/" class="text-2xl font-bold">F P</NuxtLink>
      <div class="flex items-center gap-8">
        <div class="text-sm opacity-60">UDINE, {{ currentTime }}</div>
        <nav class="flex gap-8">
          <NuxtLink to="/projects">PROJECTS</NuxtLink>
          <NuxtLink to="/about">ABOUT</NuxtLink>
        </nav>
      </div>
    </header>

    <div class="min-h-screen flex items-center px-20 relative z-10">
      <div class="w-full">
        <!-- Project Counter -->
        <div class="project-counter mb-20">
          <div class="inline-block relative">
            <div class="text-9xl font-light opacity-20">{{ currentIndex }}</div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-light">
              {{ currentIndex + 1 }}
            </div>
          </div>
          <div class="text-sm uppercase mt-4">NUMBER</div>
        </div>

        <!-- Project Title -->
        <h1 ref="title" class="text-8xl font-light mb-4">
          {{ currentProject.title }}
        </h1>

        <div class="flex justify-between items-end">
          <div class="max-w-xl">
            <p class="text-xl mb-8 opacity-60">
              {{ currentProject.description }}
            </p>
            <div class="flex gap-8 items-center">
              <div class="opacity-60">AGENCY. {{ currentProject.agency }}</div>
              <div class="opacity-60">YEAR. {{ currentProject.year }}</div>
            </div>
          </div>

          <NuxtLink 
            :to="`/projects/${currentProject.id}`"
            class="px-8 py-4 border border-white/20 rounded-full hover:bg-white/10 transition-colors"
          >
            VISIT →
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Background -->
    <Background class="fixed inset-0 -z-10 opacity-80" />
    <MouseTrail />
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import SplitType from 'split-type'
import { useColorStore } from '~/stores/color'
import { projects } from '~/data/projects'

const colorStore = useColorStore()
const title = ref(null)
const subtitle = ref(null)
const isLoading = ref(true)
const currentProject = ref(projects[0])
const currentIndex = ref(0)

// Automatic project switching
const switchInterval = 5000 // 5 seconds
let intervalId = null

const switchProject = () => {
  currentIndex.value = (currentIndex.value + 1) % projects.length
  currentProject.value = projects[currentIndex.value]
  
  // Update background colors
  const project = projects[currentIndex.value]
  colorStore.setColors(
    {
      r: Math.min(project.color1.r + 50, 255),
      g: Math.min(project.color1.g + 50, 255),
      b: Math.min(project.color1.b + 50, 255)
    },
    {
      r: Math.min(project.color2.r + 50, 255),
      g: Math.min(project.color2.g + 50, 255),
      b: Math.min(project.color2.b + 50, 255)
    }
  )
}

onMounted(async () => {
  // Simulate loading
  await new Promise(resolve => setTimeout(resolve, 2000))
  isLoading.value = false

  // Initialize text animations
  gsap.registerEffect({
    name: 'clipTitle',
    effect: (targets, config) => {
      const chars = new SplitType(targets, { types: 'chars' }).chars
      
      return gsap.fromTo(chars,
        {
          y: 100,
          opacity: 0,
          rotateX: -90,
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          stagger: 0.02,
          ease: 'power4.out',
        }
      )
    }
  })

  gsap.effects.clipTitle(title.value)
  gsap.effects.clipTitle(subtitle.value)

  // Start project switching
  intervalId = setInterval(switchProject, switchInterval)
})

// Clean up interval
onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<style scoped>
.project-counter {
  position: relative;
  display: inline-block;
  color: white;
}

.preview-container {
  height: 250px;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.preview-item {
  transform: translateZ(0);
  transition: all 0.5s ease-out;
}

.preview-item:hover {
  transform: translateZ(20px) scale(1.05);
}
</style>