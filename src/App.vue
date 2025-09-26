<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="flex min-h-screen flex-col p-8">
    <header
      class="h-18 relative mb-6 flex w-full items-center justify-center rounded-full bg-[#CBDCEB] p-4"
    >
      <div
        class="absolute left-4 top-1/2 flex -translate-y-1/2 transform cursor-pointer items-center"
        @click="$router.push({ name: 'home' })"
      >
        <span class="ml-4 text-2xl font-bold text-[#44444E]"> vue-echarts-workbench </span>
      </div>
      <div class="flex gap-16 text-xl text-[#44444E]">
        <RouterLink to="/demo">Demo</RouterLink>
        <RouterLink to="/editor">Editor</RouterLink>
        <RouterLink to="/previewer">Previewer</RouterLink>
        <RouterLink to="/migration">Migration</RouterLink>
      </div>
    </header>

    <RouterView />
  </div>
</template>

<style scoped>
header {
  box-shadow:
    rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px,
    rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
}

a {
  position: relative;
  color: #44444e70;
  transition: all 0.3s;
}

a:hover {
  color: #44444e;
}

a::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -5px;
  display: block;
  width: 0;
  height: 2px;
  background: #44444e;
  transform: translateX(-50%);
  transition: all 0.3s;
}

a:hover::after {
  width: 80%;
}
</style>
