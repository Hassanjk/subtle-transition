<template>
    <LoadingScreen :is-loading="isLoading" />
    
    <div v-show="!isLoading" class="min-h-screen py-20">
      <div class="max-w-6xl mx-auto">
        <!-- Project Header -->
        <div class="mb-20">
          <h1 class="text-6xl font-bold mb-6" ref="title">{{ project.title }}</h1>
          <div class="flex justify-between items-end">
            <div class="max-w-xl">
              <p class="text-xl mb-8" ref="description">{{ project.description }}</p>
              <a 
                :href="project.url" 
                target="_blank" 
                class="inline-block px-8 py-4 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                Visit Project
              </a>
            </div>
            <div class="text-right">
              <div class="text-sm opacity-60 mb-2">{{ project.year }}</div>
              <div class="text-sm opacity-60">{{ project.agency }}</div>
            </div>
          </div>
        </div>
  
        <!-- Project Gallery -->
        <div class="gallery" ref="gallery">
          <div 
            v-for="(image, index) in project.images" 
            :key="index"
            class="gallery-item"
            :class="{'is-next': index === currentImageIndex + 1}"
            :data-next-project="index === currentImageIndex + 1"
          >
            <img 
              :src="image" 
              :alt="`${project.title} - Image ${index + 1}`"
              class="w-full h-full object-cover rounded-2xl"
            >
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