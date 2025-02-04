<template>
  <div class="min-h-screen">
    <div class="gallery">
      <ul class="cards">
        <li v-for="(project, index) in projects" :key="index" class="project-card">
          <NuxtLink :to="`/projects/${project.slug}`" class="block">
            <div class="relative overflow-hidden rounded-lg">
              <img :src="project.image" :alt="project.title" class="w-full h-full object-cover">
              <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <h3 class="text-white text-2xl font-bold">{{ project.title }}</h3>
              </div>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Draggable } from 'gsap/Draggable'

gsap.registerPlugin(ScrollTrigger, Draggable)

const projects = ref([
  {
    title: 'Unisve Crafts',
    slug: 'unisve-crafts',
    image: '/projects/unisve.jpg',
    year: 2021,
    agency: 'Overpx'
  },
  {
    title: 'Airbag Studio',
    slug: 'airbag-studio',
    image: '/projects/airbag.jpg',
    year: 2023,
    agency: 'Overpx'
  },
  {
    title: 'Things Agency',
    slug: 'things-agency',
    image: '/projects/things.jpg',
    year: 2023,
    agency: 'Things'
  }
])

onMounted(() => {
  let iteration = 0
  const spacing = 0.1
  const snapTime = gsap.utils.snap(spacing)
  const cards = gsap.utils.toArray('.project-card')
  
  const animateFunc = element => {
    const tl = gsap.timeline()
    tl.fromTo(element, 
      {scale: 0, opacity: 0}, 
      {scale: 1, opacity: 1, zIndex: 100, duration: 0.5, yoyo: true, repeat: 1, ease: "power1.in", immediateRender: false}
    )
    .fromTo(element, 
      {xPercent: 400}, 
      {xPercent: -400, duration: 1, ease: "none", immediateRender: false}, 
      0
    )
    return tl
  }

  // Build seamless loop
  const seamlessLoop = buildSeamlessLoop(cards, spacing, animateFunc)
  
  // Create scroll trigger
  ScrollTrigger.create({
    start: 0,
    end: "+=3000",
    pin: ".gallery",
    onUpdate: self => {
      if (self.progress === 1 && self.direction > 0) {
        wrap(1, 1)
      } else if (self.progress < 1e-5 && self.direction < 0) {
        wrap(-1, self.end - 2)
      }
    }
  })
})

function buildSeamlessLoop(items, spacing, animateFunc) {
  let rawSequence = gsap.timeline({paused: true})
  let seamlessLoop = gsap.timeline({
    paused: true,
    repeat: -1,
    onRepeat() {
      this._time === this._dur && (this._tTime += this._dur - 0.01)
    }
  })
  
  items.concat(items).concat(items).forEach((item, i) => {
    let anim = animateFunc(items[i % items.length])
    rawSequence.add(anim, i * spacing)
  })
  
  seamlessLoop.fromTo(rawSequence, 
    {time: spacing},
    {
      time: "+=" + spacing,
      duration: spacing,
      ease: "none"
    }
  )
  
  return seamlessLoop
}

function wrap(iterationDelta, scrollTo) {
  iteration += iterationDelta
  ScrollTrigger.update()
}
</script>

<style scoped>
.gallery {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.cards {
  position: absolute;
  display: flex;
  gap: 2rem;
  padding: 2rem;
}

.project-card {
  flex: 0 0 auto;
  width: 300px;
  height: 400px;
}
</style>