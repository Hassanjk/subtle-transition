<template>
  <div class="relative">
    <Background class="fixed inset-0 -z-10" />
    <div class="container mx-auto px-4">
      <header class="py-8 flex justify-between items-center">
        <NuxtLink to="/" class="text-2xl font-bold">FP</NuxtLink>
        <nav>
          <NuxtLink to="/projects" class="mx-4">Projects</NuxtLink>
          <NuxtLink to="/about" class="mx-4">About</NuxtLink>
        </nav>
      </header>
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import SplitType from 'split-type'

// Register the clip title effect
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
</script>