<template>
  <div class="navbar">
    <button v-for="btn in buttons" :key="btn" @click="open(btn)">
      {{ btn }}
    </button>
    <button class="cancel" @click="cancel">
      cancel
    </button>
  </div>
</template>

<script setup>
import { uiStore } from '../store/uiStore'

const buttons = [
  'classes',
  'bateaux',
  'series',
  'courses',
  'inscriptions'
]

function open(name) {
  uiStore.open(name)
}

function cancel() {
  uiStore.closeActive()
}
</script>

<style>
.navbar {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  background: #ddd;
  padding: 10px;
}
</style>