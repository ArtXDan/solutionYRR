<template>
  <div
    class="window"
    :style="{ zIndex }"
    @mousedown="bringToFront"
  >
    <div class="header">
      <span>{{ titles[name] }}</span>
      <button @click="close">X</button>
    </div>

    <component :is="componentMap[name]" />
  </div>
</template>

<script setup>
import { uiStore } from '../store/uiStore'

import ClassesWindow from './windows/ClassesWindow.vue'
import BateauxWindow from './windows/BateauxWindow.vue'
import CoursesWindow from './windows/CoursesWindow.vue'
import SeriesWindow from './windows/SeriesWindow.vue'
import InscriptionsWindow from './windows/InscriptionsWindow.vue'
import ResultatsWindow from './windows/ResultatsWindow.vue'

const componentMap = {
  classes: ClassesWindow,
  bateaux: BateauxWindow,
  courses: CoursesWindow,
  series: SeriesWindow,
  inscriptions: InscriptionsWindow,
  resultats: ResultatsWindow
}

const titles = {
  classes: "Classes",
  bateaux: "Bateaux",
  courses: "Courses",
  series: "Séries",
  inscriptions: "Inscriptions",
  resultats: "Résultats"
}

const props = defineProps(['name', 'zIndex'])

function close() {
  uiStore.close(props.name)
}

function bringToFront() {
  uiStore.bringToFront(props.name)
}
</script>

<style>
.window {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  
  width: clamp(350px, 60vw, 700px);
  height: clamp(300px, 70vh, 600px);


  background: white;
  border: 2px solid black;

  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  background: #444;
  color: white;

  padding: 10px 12px;
  font-size: 16px;
  font-weight: 600;
}
</style>