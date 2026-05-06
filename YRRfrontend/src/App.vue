<template>
  <MainLayout>
    <div class="home">
    <img src="/logo.png" alt="Logo" class="logo" />
      <h1>Club des bateaux YRR</h1>
      <p>Bienvenue dans l'application</p>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from './components/MainLayout.vue'
</script>

<style>

* {
  font-family: Helvetica, Arial, sans-serif;
}

body {
  margin: 0;
}

.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.logo {
  width: 150px;
  height: auto;
  margin-bottom: 20px;
}

button {
  font-family: Helvetica, Arial, sans-serif;

  padding: 6px 12px;
  border: 1px solid #ccc;
  background: #f5f5f5;
  color: #222;

  border-radius: 6px;
  cursor: pointer;

  transition: all 0.2s ease;
}

button:active {
  transform: scale(0.97);
}

button:hover {
  background: #e6e6e6;
  border-color: #999;
}

button:focus {
  outline: none;
}

.cancel {
  background: #e74c3c;
  color: white;
  border: none;
}

.cancel:hover {
  background: #c0392b;
}
</style>