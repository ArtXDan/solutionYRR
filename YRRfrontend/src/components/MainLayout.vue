<template>
  <div class="main-container">
    <slot />

    <NavBar />

    <!-- Windows -->
    <Window
      v-for="(win, index) in uiStore.openWindows"
      :key="win"
      :name="win"
      :zIndex="100 + index"
    />
  </div>
  <div
  v-if="uiStore.openWindows.length > 0"
  class="backdrop"
  @click="uiStore.closeActive()"
/>
</template>

<script setup>
import { uiStore } from '../store/uiStore.js'
import NavBar from './NavBar.vue'
import Window from './Window.vue'
</script>

<style>
.main-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.backdrop {
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  background: rgba(0, 0, 0, 0.4);

  z-index: 50;
}
</style>