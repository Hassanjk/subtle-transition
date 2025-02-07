<template>
  <LoadingScreen :is-loading="isLoading" />
  
  <main class="relative text-white">
    <!-- Magnetic Header -->
    <header ref="header" class="fixed top-0 left-0 right-0 py-8 px-8 flex justify-between items-center z-50 bg-transparent">
      <NuxtLink to="/" class="text-2xl font-bold magnetic-item">FP</NuxtLink>
      <div class="flex items-center gap-8">
        <nav class="flex gap-4">
          <NuxtLink to="/projects" class="magnetic-item px-4 py-2">Projects</NuxtLink>
          <NuxtLink to="/about" class="magnetic-item px-4 py-2">About</NuxtLink>
        </nav>
        <div class="text-sm magnetic-item">UDINE, {{ currentTime }}</div>
      </div>
    </header>

    <div class="min-h-screen">
      <!-- Interactive Background Elements -->
      <div class="fixed inset-0 pointer-events-none">
        <!-- Floating Particles -->
        <div v-for="n in 20" :key="n" 
             class="absolute w-1 h-1 bg-white rounded-full opacity-20"
             :style="{ 
               left: `${Math.random() * 100}%`, 
               top: `${Math.random() * 100}%`,
               animation: `float ${2 + Math.random() * 4}s infinite ${Math.random() * 2}s`
             }"
        ></div>
        
        <!-- Gradient Mesh -->
        <div class="absolute inset-0 opacity-30">
          <div class="relative w-full h-full">
            <div v-for="n in 4" :key="`mesh-${n}`"
                 class="absolute rounded-full filter blur-3xl"
                 :style="{
                   width: '40%',
                   height: '40%',
                   left: `${Math.random() * 60}%`,
                   top: `${Math.random() * 60}%`,
                   background: `radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)`,
                   animation: `meshFloat ${10 + Math.random() * 5}s infinite ${Math.random() * 5}s`
                 }"
            ></div>
          </div>
        </div>
      </div>

      <div ref="projectsContainer" class="project-container">
        <div 
          v-for="(project, index) in projects" 
          :key="project.id" 
          class="project-section absolute inset-0 flex items-center px-20"
          :class="{ 'active': currentIndex === index }"
        >
          <div class="w-full min-h-screen py-32 flex flex-col">
            <!-- Main Content -->
            <div class="flex-1 flex items-center">
              <div class="w-full">
                <!-- Project Title -->
                <h1 class="text-8xl font-light mb-12 leading-tight split-text magnetic-item">
                  {{ project.title }}
                </h1>

                <!-- Description Section -->
                <div class="flex justify-between items-end mb-24">
                  <div class="max-w-xl">
                    <p class="text-xl mb-8 opacity-60 leading-relaxed split-text">
                      {{ project.description }}
                    </p>
                    <div class="flex gap-8 items-center">
                      <div class="opacity-60 magnetic-item">AGENCY. {{ project.agency }}</div>
                      <div class="opacity-60 magnetic-item">YEAR. {{ project.year }}</div>
                    </div>
                  </div>

                  <NuxtLink 
                    :to="`/projects/${project.id}`"
                    class="magnetic-item px-8 py-4 border border-white/20 rounded-full"
                  >
                    EXPLORE →
                  </NuxtLink>
                </div>
              </div>
            </div>

            <!-- Project Counter -->
            <div class="project-counter fixed bottom-8 left-12">
              <div class="inline-block relative">
                <div class="text-6xl font-light opacity-20">{{ project.id - 1 }}</div>
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-light">
                  {{ project.id }}
                </div>
              </div>
              <div class="text-xs uppercase mt-2 tracking-widest">PROJECT</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Progress Bar -->
      <div class="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div class="w-48 h-1 bg-white/20 rounded-full overflow-hidden mb-4">
          <div class="h-full bg-white transition-all duration-300 relative"
               :style="{ width: `${((currentIndex + 1) / projects.length) * 100}%` }">
            <div class="absolute inset-0 bg-gradient-to-r from-white/50 via-white to-white/50 animate-shimmer"></div>
          </div>
        </div>
        <div class="flex gap-2">
          <button 
            v-for="(_, i) in projects" 
            :key="i"
            @click="goToProject(i)"
            class="w-2 h-2 rounded-full transition-all duration-300 magnetic-item"
            :class="currentIndex === i ? 'bg-white scale-150' : 'bg-white/20 hover:bg-white/40'"
          ></button>
        </div>
      </div>
    </div>

    <Background class="fixed inset-0 -z-10" />
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
const isLoading = ref(true)
const currentTime = ref('')
const currentIndex = ref(0)
const projectsContainer = ref(null)
const projectTitle = ref(null)
const header = ref(null)
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

// Magnetic effect for elements
const initMagneticEffect = () => {
  const magneticItems = document.querySelectorAll('.magnetic-item')
  
  magneticItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const bounds = item.getBoundingClientRect()
      const mouseX = e.clientX - bounds.left - bounds.width / 2
      const mouseY = e.clientY - bounds.top - bounds.height / 2
      
      gsap.to(item, {
        duration: 0.3,
        x: mouseX * 0.3,
        y: mouseY * 0.3,
        ease: 'power2.out'
      })
    })

    item.addEventListener('mouseleave', () => {
      gsap.to(item, {
        duration: 0.3,
        x: 0,
        y: 0,
        ease: 'power2.out'
      })
    })
  })
}

// Go to specific project
const goToProject = (index) => {
  if (index === currentIndex.value) return
  
  clearInterval(autoSwitchInterval)
  
  const direction = index > currentIndex.value ? 1 : -1
  
  // Animate out current project
  gsap.to(`.project-section:nth-child(${currentIndex.value + 1})`, {
    opacity: 0,
    x: -100 * direction,
    duration: 0.5,
    ease: 'power2.in'
  })

  // Update current index
  currentIndex.value = index

  // Update background colors with smooth transition
  colorStore.setColors(projects[index].color1, projects[index].color2)

  // Animate in new project
  const timeline = gsap.timeline()
  
  timeline
    .fromTo(`.project-section:nth-child(${index + 1})`,
      { opacity: 0, x: 100 * direction },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
    )
    .fromTo(`.project-section:nth-child(${index + 1}) .split-text .char`,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.02, ease: 'power2.out' },
      '-=0.3'
    )

  // Restart auto-switch
  autoSwitchInterval = setInterval(nextProject, 5000)
}

// Switch to next project with enhanced animations
const nextProject = () => {
  goToProject((currentIndex.value + 1) % projects.length)
}

onMounted(async () => {
  // Simulate loading
  await new Promise(resolve => setTimeout(resolve, 2000))
  isLoading.value = false

  // Initialize time update
  updateTime()
  const timeInterval = setInterval(updateTime, 1000)

  // Initialize magnetic effect
  initMagneticEffect()

  // Split text animation setup
  const titles = document.querySelectorAll('.split-text')
  titles.forEach(title => {
    new SplitType(title, { types: 'chars' })
  })

  // Show initial project with animation
  gsap.timeline()
    .to(`.project-section:nth-child(1)`, {
      opacity: 1,
      y: 0,
      duration: 0.5
    })
    .fromTo('.split-text .char',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.02, ease: 'power2.out' },
      '-=0.2'
    )

  // Start auto-switching
  autoSwitchInterval = setInterval(nextProject, 5000)

  // Add scroll-triggered parallax effect
  window.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX / window.innerWidth - 0.5) * 2
    const mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    
    gsap.to('.gradient-mesh', {
      duration: 0.5,
      x: mouseX * 50,
      y: mouseY * 50,
      ease: 'power2.out'
    })
  })

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

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.2);
  }
}

@keyframes meshFloat {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(30px, -30px);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.glitch-text {
  position: relative;
  animation: glitch 1s infinite;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch-text::before {
  left: 2px;
  text-shadow: -2px 0 #ff00c1;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim 5s infinite linear alternate-reverse;
}

.glitch-text::after {
  left: -2px;
  text-shadow: -2px 0 #00fff9, 2px 2px #ff00c1;
  animation: glitch-anim2 1s infinite linear alternate-reverse;
}

@keyframes glitch-anim {
  0% {
    clip: rect(31px, 9999px, 94px, 0);
  }
  4.166666666666666% {
    clip: rect(91px, 9999px, 100px, 0);
  }
  8.333333333333332% {
    clip: rect(85px, 9999px, 41px, 0);
  }
  12.5% {
    clip: rect(54px, 9999px, 93px, 0);
  }
  16.666666666666664% {
    clip: rect(64px, 9999px, 20px, 0);
  }
  20.833333333333336% {
    clip: rect(31px, 9999px, 29px, 0);
  }
  25% {
    clip: rect(31px, 9999px, 86px, 0);
  }
  29.166666666666668% {
    clip: rect(92px, 9999px, 64px, 0);
  }
  33.33333333333333% {
    clip: rect(75px, 9999px, 85px, 0);
  }
  37.5% {
    clip: rect(3px, 9999px, 28px, 0);
  }
  41.66666666666667% {
    clip: rect(82px, 9999px, 29px, 0);
  }
  45.83333333333333% {
    clip: rect(46px, 9999px, 78px, 0);
  }
  50% {
    clip: rect(82px, 9999px, 96px, 0);
  }
  54.166666666666664% {
    clip: rect(75px, 9999px, 57px, 0);
  }
  58.333333333333336% {
    clip: rect(11px, 9999px, 59px, 0);
  }
  62.5% {
    clip: rect(40px, 9999px, 31px, 0);
  }
  66.66666666666666% {
    clip: rect(69px, 9999px, 100px, 0);
  }
  70.83333333333334% {
    clip: rect(24px, 9999px, 84px, 0);
  }
  75% {
    clip: rect(23px, 9999px, 88px, 0);
  }
  79.16666666666666% {
    clip: rect(17px, 9999px, 53px, 0);
  }
  83.33333333333334% {
    clip: rect(71px, 9999px, 37px, 0);
  }
  87.5% {
    clip: rect(25px, 9999px, 38px, 0);
  }
  91.66666666666666% {
    clip: rect(76px, 9999px, 78px, 0);
  }
  95.83333333333334% {
    clip: rect(84px, 9999px, 96px, 0);
  }
  100% {
    clip: rect(92px, 9999px, 90px, 0);
  }
}

@keyframes glitch-anim2 {
  0% {
    clip: rect(65px, 9999px, 65px, 0);
  }
  100% {
    clip: rect(93px, 9999px, 94px, 0);
  }
}

.reveal-text {
  position: relative;
  overflow: hidden;
}

/* Hide scrollbar but keep functionality */
::-webkit-scrollbar {
  display: none;
}

* {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.split-text {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
}

.project-counter {
  pointer-events: none; /* Prevent interaction with counter */
  mix-blend-mode: difference; /* Better visibility on any background */
  z-index: 10;
}

.magnetic-item {
  display: inline-block;
  transition: transform 0.3s ease;
}

/* Adjust spacing for main content to prevent overlap */
.project-section .flex-1 {
  margin-bottom: 0; /* Remove extra margin */
}
</style>