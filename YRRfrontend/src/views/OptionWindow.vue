<template>
  <div
    class="option-window"
    :style="{ zIndex: zIndex }"
    @mousedown="$emit('focus')"
  >
    <!-- Title bar -->
    <div class="window-titlebar" @mousedown.stop="startDrag">
      <div class="window-title">
        <span class="window-icon">{{ config.icon }}</span>
        <span class="window-label">{{ config.label }}</span>
      </div>
      <button class="window-close" @click.stop="close" title="Fermer">✕</button>
    </div>

    <!-- Window content -->
    <div class="window-body">
      <component :is="contentComponent" @open-resultats="openResultats" />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'pinia'
import { useWindowStore } from '../stores/windowStore'
import ClassesContent from './windows/ClassesContent.vue'
import BateauxContent from './windows/BateauxContent.vue'
import CoursesContent from './windows/CoursesContent.vue'
import SeriesContent from './windows/SeriesContent.vue'
import InscriptionsContent from './windows/InscriptionsContent.vue'
import ResultatsContent from './windows/ResultatsContent.vue'

const CONFIGS = {
  classes:      { icon: '⚓', label: 'Classes' },
  bateaux:      { icon: '⛵', label: 'Bateaux' },
  courses:      { icon: '🏁', label: 'Courses' },
  series:       { icon: '📋', label: 'Séries' },
  inscriptions: { icon: '📝', label: 'Inscriptions' },
  resultats:    { icon: '🏆', label: 'Résultats' },
}

const COMPONENTS = {
  classes:      ClassesContent,
  bateaux:      BateauxContent,
  courses:      CoursesContent,
  series:       SeriesContent,
  inscriptions: InscriptionsContent,
  resultats:    ResultatsContent,
}

export default {
  name: 'OptionWindow',
  props: {
    windowId: { type: String, required: true },
    zIndex:   { type: Number, default: 10 },
  },
  emits: ['focus'],

  data() {
    return {
      dragging: false,
      dragStartX: 0,
      dragStartY: 0,
      offsetX: 0,
      offsetY: 0,
    }
  },

  computed: {
    config() { return CONFIGS[this.windowId] || { icon: '▪', label: this.windowId } },
    contentComponent() { return COMPONENTS[this.windowId] || null },
  },

  methods: {
    ...mapActions(useWindowStore, ['closeWindow', 'openResultats']),

    close() { this.closeWindow(this.windowId) },

    startDrag(e) {
      if (e.target.classList.contains('window-close')) return
      this.dragging = true
      this.dragStartX = e.clientX - this.offsetX
      this.dragStartY = e.clientY - this.offsetY
      window.addEventListener('mousemove', this.onDrag)
      window.addEventListener('mouseup', this.stopDrag)
    },
    onDrag(e) {
      if (!this.dragging) return
      this.offsetX = e.clientX - this.dragStartX
      this.offsetY = e.clientY - this.dragStartY
      this.$el.style.transform = `translate(calc(-50% + ${this.offsetX}px), calc(-50% + ${this.offsetY}px))`
    },
    stopDrag() {
      this.dragging = false
      window.removeEventListener('mousemove', this.onDrag)
      window.removeEventListener('mouseup', this.stopDrag)
    },
  },
}
</script>

<style scoped>
.option-window {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 640px;
  height: 480px;
  background: var(--navy-mid);
  border: 1px solid rgba(201,168,76,0.3);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04);
  animation: windowAppear 0.15s ease;
}
@keyframes windowAppear {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.97); }
  to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

.window-titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 44px;
  border-bottom: 1px solid rgba(201,168,76,0.15);
  background: rgba(0,0,0,0.2);
  border-radius: 10px 10px 0 0;
  cursor: grab;
  flex-shrink: 0;
  user-select: none;
}
.window-titlebar:active { cursor: grabbing; }

.window-title {
  display: flex;
  align-items: center;
  gap: 10px;
}
.window-icon { font-size: 18px; }
.window-label {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--gold-light);
}

.window-close {
  width: 28px; height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.15);
  background: transparent;
  color: var(--white-dim);
  font-size: 11px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.window-close:hover {
  background: rgba(220,60,60,0.3);
  border-color: rgba(220,60,60,0.5);
  color: var(--white);
}

.window-body {
  flex: 1;
  overflow: auto;
  padding: 20px 24px;
}

/* Scrollbar */
.window-body::-webkit-scrollbar { width: 6px; }
.window-body::-webkit-scrollbar-track { background: transparent; }
.window-body::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); border-radius: 3px; }
.window-body::-webkit-scrollbar-thumb:hover { background: rgba(201,168,76,0.4); }
</style>
