<template>
  <LoadingScreen :is-loading="isLoading" />
  
  <main class="relative text-white">
    <header class="fixed top-0 left-0 right-0 py-8 px-8 flex justify-between items-center z-50 bg-transparent">
      <NuxtLink to="/" class="text-2xl font-bold">FP</NuxtLink>
      <div class="flex items-center gap-8">
        <nav>
          <NuxtLink to="/projects" class="mx-4">Projects</NuxtLink>
          <NuxtLink to="/about" class="mx-4">About</NuxtLink>
        </nav>
        <div class="text-sm">UDINE, {{ currentTime }}</div>
      </div>
    </header>

    <div class="min-h-screen">
      <div ref="projectsContainer" class="project-container">
        <div 
          v-for="(project, index) in projects" 
          :key="project.id" 
          class="project-section absolute inset-0 flex items-center px-20"
          :class="{ 'active': currentIndex === index }"
        >
          <div class="w-full">
            <!-- Project Counter -->
            <div class="project-counter mb-20">
              <div class="inline-block relative">
                <div class="text-9xl font-light opacity-20">{{ project.id - 1 }}</div>
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-light">
                  {{ project.id }}
                </div>
              </div>
              <div class="text-sm uppercase mt-4">NUMBER</div>
            </div>

            <!-- Project Title -->
            <h1 class="text-8xl font-light mb-4">
              {{ project.title }}
            </h1>

            <div class="flex justify-between items-end">
              <div class="max-w-xl">
                <p class="text-xl mb-8 opacity-60">
                  {{ project.description }}
                </p>
                <div class="flex gap-8 items-center">
                  <div class="opacity-60">AGENCY. {{ project.agency }}</div>
                  <div class="opacity-60">YEAR. {{ project.year }}</div>
                </div>
              </div>

              <NuxtLink 
                :to="`/projects/${project.id}`"
                class="px-8 py-4 border border-white/20 rounded-full hover:bg-white/10 transition-colors"
              >
                VISIT →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Background -->
    <Background class="fixed inset-0 -z-10" />
    <MouseTrail />
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { useColorStore } from '~/stores/color'
import { projects } from '~/data/projects'

const colorStore = useColorStore()
const isLoading = ref(true)
const currentTime = ref('')
const currentIndex = ref(0)
const projectsContainer = ref(null)
let autoSwitchInterval

// Update time
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Rome'
  }) + ' CEST'
}

// Switch to next project
const nextProject = () => {
  const nextIndex = (currentIndex.value + 1) % projects.length
  
  // Fade out current project
  gsap.to(`.project-section:nth-child(${currentIndex.value + 1})`, {
    opacity: 0,
    y: -50,
    duration: 0.5,
    ease: 'power2.in'
  })

  // Update current index
  currentIndex.value = nextIndex

  // Update background colors
  colorStore.setColors(projects[nextIndex].color1, projects[nextIndex].color2)

  // Fade in next project
  gsap.fromTo(`.project-section:nth-child(${nextIndex + 1})`,
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 0.5, delay: 0.5, ease: 'power2.out' }
  )
}

onMounted(async () => {
  // Simulate loading
  await new Promise(resolve => setTimeout(resolve, 2000))
  isLoading.value = false

  // Initialize time update
  updateTime()
  const timeInterval = setInterval(updateTime, 1000)

  // Show initial project
  gsap.to(`.project-section:nth-child(1)`, {
    opacity: 1,
    y: 0,
    duration: 0.5
  })

  // Start auto-switching
  autoSwitchInterval = setInterval(nextProject, 5000) // Switch every 5 seconds

  // Cleanup
  onUnmounted(() => {
    clearInterval(timeInterval)
    clearInterval(autoSwitchInterval)
  })
})
</script>

<style scoped>
.project-container {
  position: relative;
  min-height: 100vh;
  padding-top: 32px;
}

.project-section {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s ease;
}

.project-section.active {
  opacity: 1;
  pointer-events: auto;
}

/* Hide scrollbar but keep functionality */
::-webkit-scrollbar {
  display: none;
}

* {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>