<template>
  <div class="relative">
    <Background class="fixed inset-0 -z-10" />
    <MouseTrail />
    <div class="container mx-auto px-4">
      <NuxtPage />
    </div>
  </div>
</template>

<style>
body {
  @apply bg-black text-white;
  font-family: 'Space Grotesk', sans-serif;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>