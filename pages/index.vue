<template>
  <LoadingScreen :is-loading="isLoading" />
  
  <main class="min-h-[calc(100vh-8rem)] flex items-center">
    <div class="max-w-4xl">
      <h1 ref="title" class="text-7xl font-bold mb-8">
        Creative Developer & Designer
      </h1>
      <p ref="subtitle" class="text-xl mb-8 max-w-2xl">
        Crafting immersive digital experiences through code and design.
        Specialized in creative development and interactive animations.
      </p>
      
      <!-- Project Preview -->
      <div class="fixed bottom-8 right-8 w-[400px]">
        <div class="preview-container relative overflow-hidden rounded-2xl">
          <NuxtLink 
            v-for="project in projects" 
            :key="project.id"
            :to="`/projects/${project.id}`"
            class="preview-item absolute inset-0 transition-all duration-500 cursor-pointer"
            :class="{ 'opacity-0': currentProject.id !== project.id }"
          >
            <img 
              :src="project.thumbnail" 
              :alt="project.title"
              class="w-full h-full object-cover"
            >
            <div class="absolute inset-0 bg-black/20 backdrop-blur-sm p-6 flex flex-col justify-end">
              <h3 class="text-2xl font-bold mb-2">{{ project.title }}</h3>
              <div class="flex justify-between items-center">
                <p class="text-sm opacity-80">{{ project.year }}</p>
                <span class="text-sm">View Project →</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
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

// Automatic project switching
const switchInterval = 5000 // 5 seconds
let currentIndex = 0
let intervalId = null

const switchProject = () => {
  currentIndex = (currentIndex + 1) % projects.length
  currentProject.value = projects[currentIndex]
  
  // Update background colors with brighter values
  const project = projects[currentIndex]
  colorStore.setColors(
    {
      r: Math.min(project.color1.r + 30, 255),
      g: Math.min(project.color1.g + 30, 255),
      b: Math.min(project.color1.b + 30, 255)
    },
    {
      r: Math.min(project.color2.r + 30, 255),
      g: Math.min(project.color2.g + 30, 255),
      b: Math.min(project.color2.b + 30, 255)
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