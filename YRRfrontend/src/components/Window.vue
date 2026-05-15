<template>
  <Transition name="window">
    <div
      class="window"
      :class="name"
      :style="{ zIndex }"
      @mousedown="bringToFront"
    >
      <div class="header">
        <span>{{ titles[name] }}</span>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <component :is="componentMap[name]" />
    </div>
  </Transition>
</template>

<script setup>
import { uiStore } from '../store/uiStore'

import ClassesWindow     from './windows/ClassesWindow.vue'
import BateauxWindow     from './windows/BateauxWindow.vue'
import CoursesWindow     from './windows/CoursesWindow.vue'
import SeriesWindow      from './windows/SeriesWindow.vue'
import InscriptionsWindow from './windows/InscriptionsWindow.vue'
import ResultatsWindow   from './windows/ResultatsWindow.vue'

const componentMap = {
  classes:      ClassesWindow,
  bateaux:      BateauxWindow,
  courses:      CoursesWindow,
  series:       SeriesWindow,
  inscriptions: InscriptionsWindow,
  resultats:    ResultatsWindow
}

const titles = {
  classes:      'Classes',
  bateaux:      'Bateaux',
  courses:      'Courses',
  series:       'Séries',
  inscriptions: 'Inscriptions',
  resultats:    'Résultats'
}

const props = defineProps(['name', 'zIndex'])

function close()        { uiStore.close(props.name) }
function bringToFront() { uiStore.bringToFront(props.name) }
</script>

<style>
.window {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18), 0 1.5px 4px rgba(0,0,0,0.08);
  border: none;

  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.window:not(.resultats) {
  width: clamp(350px, 60vw, 700px);
  height: clamp(300px, 70vh, 600px);
}

.window.resultats {
  width: fit-content;
  height: fit-content;
  max-width: 95vw;
  max-height: 90vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  background: #1e1e1e;
  color: #fff;

  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.03em;
  flex-shrink: 0;
}

.close-btn {
  background: rgba(255,255,255,0.1);
  border: none;
  color: #fff;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: background 0.15s;
}

.close-btn:hover {
  background: rgba(255,255,255,0.22);
}

/* open animation */
.window-enter-active {
  animation: windowIn 0.18s cubic-bezier(0.34, 1.4, 0.64, 1);
}

.window-leave-active {
  animation: windowOut 0.14s ease-in forwards;
}

@keyframes windowIn {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.94); }
  to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

@keyframes windowOut {
  from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  to   { opacity: 0; transform: translate(-50%, -50%) scale(0.96); }
}
</style>