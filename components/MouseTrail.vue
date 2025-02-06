<template>
  <div class="content">
    <div 
      v-for="i in 10" 
      :key="i" 
      class="content__img"
    >
      <div 
        class="content__img-inner" 
        :style="{ backgroundImage: `url(${getRandomImage()})` }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { ImageTrail } from '~/utils/imageTrail'

// Array of Unsplash images for the trail
const unsplashImages = [
  'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800',
  'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800',
  'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800',
  'https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=800',
  'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=800',
  'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
  'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800',
  'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
  'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800'
]

const getRandomImage = () => {
  return unsplashImages[Math.floor(Math.random() * unsplashImages.length)]
}

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