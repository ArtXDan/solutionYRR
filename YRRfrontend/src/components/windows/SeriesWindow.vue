<template>
  <div class="series-window">
    <h2>Séries</h2>

    <!-- Form to add a série -->
    <div class="form">
      <input v-model="newSerie.nom" placeholder="Nom de la série" />
      <input v-model="newSerie.date" type="date" />
      <button @click="addSerie">Ajouter</button>
    </div>

    <!-- List of séries -->
    <ul class="list">
      <li
  v-for="(serie, index) in series"
  :key="index"
  @click="selectSerie(index)"
  :class="{ active: selectedIndex === index }"
>

  <span>
    {{ serie.nom }} ({{ serie.date }})
  </span>

  <div class="actions">

    <button
      @click.stop="openResultats(serie)"
    >
      Résultats
    </button>

    <button
      @click.stop="removeSerie(index)"
    >
      X
    </button>

  </div>

</li>
    </ul>

    <!-- Selected série details -->
    <div v-if="selectedSerie" class="details">
      <h3>Détails</h3>
      <p><strong>Nom:</strong> {{ selectedSerie.nom }}</p>
      <p><strong>Date:</strong> {{ selectedSerie.date }}</p>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { uiStore } from '../../store/uiStore'

// state
const series = ref([])
const selectedIndex = ref(null)

const newSerie = ref({
  nom: '',
  date: ''
})

// computed
const selectedSerie = computed(() => {
  if (selectedIndex.value === null) return null
  return series.value[selectedIndex.value]
})

// methods
function addSerie() {
  if (!newSerie.value.nom || !newSerie.value.date) return

  series.value.push({
    nom: newSerie.value.nom,
    date: newSerie.value.date
  })

  newSerie.value.nom = ''
  newSerie.value.date = ''
}

function removeSerie(index) {
  series.value.splice(index, 1)

  if (selectedIndex.value === index) {
    selectedIndex.value = null
  }
}

function selectSerie(index) {
  selectedIndex.value = index
}

function openResultats(serie) {
  uiStore.selectedSerie = serie
  uiStore.open('resultats')
}
</script>

<style scoped>
.series-window {
  padding: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.form {
  display: flex;
  gap: 5px;
  margin-bottom: 10px;
}

.list {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  list-style: none;
}

.list li {
  display: flex;
  justify-content: space-between;
  padding: 5px;
  border: 1px solid #ccc;
  margin-bottom: 5px;
  cursor: pointer;
}

.list li.active {
  background: #d0e6ff;
}

.details {
  border-top: 2px solid #000;
  padding-top: 10px;
}

.actions {
  display: flex;
  gap: 6px;
}

.actions button {
  font-size: 14px;
  padding: 2px 6px;
}
</style>