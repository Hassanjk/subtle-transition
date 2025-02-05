<template>
    <div class="content">
      <div 
        v-for="i in 10" 
        :key="i" 
        class="content__img"
      >
        <div 
          class="content__img-inner" 
          :style="{ backgroundImage: `url(assets/images/trail/${i}.jpg)` }"
        ></div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  import { ImageTrail } from '~/utils/imageTrail'
  
  onMounted(() => {
    new ImageTrail(document.querySelector('.content'))
  })
  </script>
  
  <style scoped>
  .content {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 100;
  }
  
  .content__img {
    --img-width: 200px;
    --img-ratio: 1.2;
    --img-offset-x: 20px;
    --img-offset-y: 20px;
    --img-border-radius: 7px;
    width: var(--img-width);
    aspect-ratio: var(--img-ratio);
    border-radius: var(--img-border-radius);
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    overflow: hidden;
    will-change: transform, filter;
  }
  
  .content__img-inner {
    background-position: 50% 50%;
    width: calc(100% + var(--img-offset-x));
    height: calc(100% + var(--img-offset-y));
    background-size: cover;
    position: absolute;
    top: calc(-1 * var(--img-offset-y) / 2);
    left: calc(-1 * var(--img-offset-x) / 2);
  }
  </style>