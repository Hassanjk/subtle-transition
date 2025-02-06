<template>
  <main class="min-h-[calc(100vh-8rem)] flex items-center">
    <div class="max-w-4xl">
      <h1 ref="title" class="text-6xl font-bold mb-8">
        Creative Developer & Designer
      </h1>
      <p ref="subtitle" class="text-xl mb-8 max-w-2xl">
        Crafting immersive digital experiences through code and design.
        Specialized in creative development and interactive animations.
      </p>
      <div class="demos fixed bottom-8 right-8 bg-white/5 backdrop-blur-sm rounded-lg p-4">
        <span class="block mb-2 text-sm opacity-60">Projects</span>
        <div class="flex gap-2">
          <NuxtLink 
            v-for="project in projects" 
            :key="project.id"
            :to="`/projects/${project.id}`"
            class="w-10 h-10 rounded bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            {{ project.id }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import SplitType from 'split-type'
import { useColorStore } from '~/stores/color'
import { projects } from '~/data/projects'

const colorStore = useColorStore()
const title = ref(null)
const subtitle = ref(null)

let currentProjectIndex = 0
const autoChangeInterval = 5000 // 5 seconds

onMounted(() => {
  // Set initial gradient colors
  colorStore.setColors(
    { r: 200, g: 220, b: 255 }, // Light blue
    { r: 180, g: 180, b: 255 }  // Light purple
  )

  gsap.registerEffect({
    name: 'clipTitle',
    effect: (targets, config) => {
      const tl = gsap.timeline({
        defaults: { duration: config.duration, ease: config.ease }
      })

      const chars = new SplitType(targets, { 
        types: 'chars',
        tagName: 'span'
      }).chars

      tl.fromTo(chars,
        {
          x: config.x,
          yPercent: config.yPercent,
          clipPath: 'inset(0% 100% 120% -5%)',
          transformOrigin: '0% 50%',
        },
        {
          clipPath: 'inset(0% -100% -100% -5%)',
          x: 0,
          yPercent: 0,
          stagger: config.stagger,
          duration: config.duration,
          ease: config.ease,
        }
      )

      return tl
    },
    defaults: { 
      yPercent: 30,
      x: -30,
      duration: 0.8,
      ease: 'power3.out',
      stagger: -0.05
    }
  })

  gsap.effects.clipTitle(title.value)
  gsap.effects.clipTitle(subtitle.value, {
    delay: 0.3
  })

  // Start automatic project cycling
  const autoChangeProject = () => {
    currentProjectIndex = (currentProjectIndex + 1) % projects.length
    const nextProject = projects[currentProjectIndex]
    colorStore.setColors(nextProject.color1, nextProject.color2)
  }

  const intervalId = setInterval(autoChangeProject, autoChangeInterval)

  // Clean up interval on component unmount
  onUnmounted(() => {
    clearInterval(intervalId)
  })
})
</script>

<style>
.char {
  display: inline-block;
  will-change: transform;
}
</style>