<template>
  <LoadingScreen :is-loading="isLoading" />
  
  <div v-show="!isLoading" class="min-h-screen">
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 py-8 px-8 flex justify-between items-center z-50">
      <NuxtLink to="/" class="text-2xl font-bold">F P</NuxtLink>
      <div class="flex items-center gap-8">
        <div class="text-sm opacity-60">UDINE, {{ currentTime }}</div>
        <nav class="flex gap-8">
          <NuxtLink to="/projects">PROJECTS</NuxtLink>
          <NuxtLink to="/about">ABOUT</NuxtLink>
        </nav>
      </div>
    </header>

    <div class="pt-32 px-20">
      <!-- Project Header -->
      <div class="mb-20">
        <h1 class="text-8xl font-light mb-8" ref="title">{{ project.title }}</h1>
        <p class="text-xl max-w-2xl opacity-60" ref="description">{{ project.description }}</p>
      </div>

      <!-- Project Counter -->
      <div class="fixed top-1/2 left-20 -translate-y-1/2 text-9xl font-light opacity-20">
        0%
      </div>

      <!-- Project Info -->
      <div class="fixed top-32 right-20 text-right">
        <div class="text-4xl font-light mb-8">
          {{ String(project.id).padStart(2, '0') }}/{{ String(projects.length).padStart(2, '0') }}
        </div>
        <div class="space-y-4 text-sm opacity-60">
          <div>
            <div>ROLE</div>
            <div>FULL STACK DEV / MOTION</div>
          </div>
          <div>
            <div>AGENCY</div>
            <div>{{ project.agency }}</div>
          </div>
          <div>
            <div>YEAR</div>
            <div>{{ project.year }}</div>
          </div>
          <div>
            <div>AWARDS</div>
            <div>FWA OF THE DAY</div>
          </div>
        </div>
      </div>

      <!-- Project Gallery -->
      <div class="gallery max-w-5xl mx-auto" ref="gallery">
        <div 
          v-for="(image, index) in project.images" 
          :key="index"
          class="gallery-item mb-20"
          :class="{'is-next': index === currentImageIndex + 1}"
        >
          <img 
            :src="image" 
            :alt="`${project.title} - Image ${index + 1}`"
            class="w-full rounded-2xl"
          >
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="fixed bottom-8 right-8 flex gap-4">
      <button 
        @click="prevProject" 
        class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        ←
      </button>
      <button 
        @click="nextProject" 
        class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        →
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { gsap } from 'gsap'
import { useRouteStore } from '~/stores/route'
import { useFlipState } from '~/composables/useFlipState'
import { useKeyboard } from '~/composables/useKeyboard'
import { useColorStore } from '~/stores/color'
import { projects } from '~/data/projects'

const route = useRoute()
const router = useRouter()
const routeStore = useRouteStore()
const colorStore = useColorStore()

const title = ref(null)
const description = ref(null)
const gallery = ref(null)
const currentImageIndex = ref(0)
const isLoading = ref(true)

// Get current project data
const project = computed(() => {
  return projects.find(p => p.id === parseInt(route.params.id)) || projects[0]
})

// Update background colors when project changes
watch(() => project.value, (newProject) => {
  colorStore.setColors(newProject.color1, newProject.color2)
}, { immediate: true })

// Navigation functions
const nextProject = () => {
  routeStore.setUrl('/projects-single')
  const nextId = project.value.id < projects.length ? project.value.id + 1 : 1
  router.push(`/projects/${nextId}`)
}

const prevProject = () => {
  routeStore.setUrl('/projects-single')
  const prevId = project.value.id > 1 ? project.value.id - 1 : projects.length
  router.push(`/projects/${prevId}`)
}

// Load images
const preloadImages = async () => {
  isLoading.value = true
  await Promise.all(
    project.value.images.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = resolve
        img.onerror = reject
        img.src = src
      })
    })
  )
  isLoading.value = false
}

onMounted(async () => {
  // Load images first
  await preloadImages()

  // Initialize keyboard navigation
  useKeyboard()

  // Animate title and description
  gsap.effects.clipTitle(title.value)
  gsap.effects.clipTitle(description.value, { delay: 0.2 })

  // Handle FLIP animation if coming from another project
  const flipState = useFlipState().value
  if (flipState) {
    const firstImage = gallery.value.querySelector('.gallery-item')
    const flipTl = gsap.timeline()
    
    flipTl.fromTo(firstImage,
      { '--borderRadius': '20rem' },
      { '--borderRadius': '2rem', duration: 0.6, ease: 'sine.out' },
      0
    )

    Flip.from(flipState, {
      targets: firstImage,
      duration: 1.2,
      ease: 'power3.out',
      absolute: true
    })
  }
})
</script>

<style scoped>
.gallery-item {
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.gallery-item.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.gallery {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.gallery-item {
  aspect-ratio: 16/9;
  border-radius: var(--borderRadius, 2rem);
  overflow: hidden;
}

.is-next {
  grid-column: span 2;
}
</style>