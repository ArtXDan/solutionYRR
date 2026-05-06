import { reactive } from 'vue'

export const uiStore = reactive({
  openWindows: [],

  activeWindow: null,

  open(name) {
    if (!this.openWindows.includes(name)) {
      this.openWindows.push(name)
    }
    this.activeWindow = name
  },

  close(name) {
    this.openWindows = this.openWindows.filter(w => w !== name)

    if (this.activeWindow === name) {
      this.activeWindow = this.openWindows[this.openWindows.length - 1] || null
    }
  },

  closeActive() {
    if (this.activeWindow) {
      this.close(this.activeWindow)
    }
  },

  bringToFront(name) {
    this.openWindows = this.openWindows.filter(w => w !== name)
    this.openWindows.push(name)
    this.activeWindow = name
  }
})