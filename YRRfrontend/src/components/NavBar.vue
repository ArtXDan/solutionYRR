<template>
  <nav class="navbar">
    <button
      v-for="btn in buttons"
      :key="btn"
      class="nav-btn"
      :class="{ active: uiStore.activeWindow === btn }"
      @click="open(btn)"
    >
      {{ btn }}
    </button>
  </nav>
</template>

<script setup>
import { uiStore } from '../store/uiStore'

const buttons = ['classes', 'bateaux', 'series', 'courses', 'inscriptions']

function open(name) { uiStore.open(name) }
</script>

<style>
.navbar {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  background: #e8e8e8;
  padding: 10px 14px;
  box-sizing: border-box;
  gap: 8px;
  border-top: 1px solid #d0d0d0;
}

.nav-btn {
  flex: 1;
  padding: 10px 0;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  border-radius: 6px;
  border: 1px solid #c8c8c8;
  background: #f5f5f0;
  color: #555;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  letter-spacing: 0.02em;
  text-align: center;
}

.nav-btn:hover {
  background: #eceae3;
  color: #222;
  border-color: #b0b0b0;
}

.nav-btn:active {
  transform: scale(0.97);
}

.nav-btn.active {
  background: #fff;
  color: #1e1e1e;
  border-color: #aaa;
  font-weight: 500;
}

.close-active {
  color: #c0392b;
  flex: 0 0 auto;
  padding: 7px 14px;
}

.close-active:hover {
  background: rgba(200, 50, 50, 0.08);
  color: #a93226;
}

.nav-btn {
  flex: 1;
  padding: 7px 0;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 13px;
  font-weight: 400;
  border-radius: 6px;
  border: 1px solid #c8c8c8;        /* visible border */
  background: #f5f5f0;              /* warm off-white */
  color: #555;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  letter-spacing: 0.02em;
  text-align: center;
}

.nav-btn:hover {
  background: #eceae3;
  color: #222;
  border-color: #b0b0b0;
}

.nav-btn:active {
  transform: scale(0.97);
}

.nav-btn.active {
  background: #fff;
  color: #1e1e1e;
  border-color: #aaa;
  font-weight: 500;
}

.close-active {
  color: #c0392b;
  flex: 0 0 auto;
  padding: 7px 14px;
  border-color: #e0b0ac;
  background: #fdf2f1;
}

.close-active:hover {
  background: #f9e2e0;
  color: #a93226;
  border-color: #d08880;
}
</style>