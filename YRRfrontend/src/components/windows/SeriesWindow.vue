<template>
  <div class="series-window">

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th @click="setSort('nom')">Nom {{ sortKey === 'nom' ? '↕' : '' }}</th>
            <th @click="setSort('date')">Date {{ sortKey === 'date' ? '↕' : '' }}</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>

          <tr v-for="s in sortedSaved" :key="s._id">
            <td><input v-model="s.nom" /></td>
            <td><input v-model="s.date" type="date" /></td>
            <td><button @click="updateSerie(s)">Save</button></td>
            <td><button @click="openResultats(s)">Résultats</button></td>
            <td><button class="cancel" @click="deleteSerie(s)">X</button></td>
          </tr>

          <!-- Draft row -->
          <tr class="empty-row">
            <td><input v-model="draft.nom" placeholder="Nom..." /></td>
            <td><input v-model="draft.date" type="date" /></td>
            <td colspan="3"></td>
          </tr>

        </tbody>
      </table>
    </div>

    <div v-if="error" class="error-box">⚠ {{ error }}</div>

    <div class="actions">
      <button @click="addFromDraft">Ajouter</button>
      <button @click="loadSeries">Reload</button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { uiStore } from '../../store/uiStore'

const API = 'http://localhost:3000/api/series'

const series  = ref([])
const error   = ref('')
const sortKey = ref('nom')
const draft   = ref(createDraft())

function createDraft() {
  return { nom: '', date: '' }
}

async function loadSeries() {
  try {
    const res = await fetch(API)
    series.value = await res.json()
  } catch {
    error.value = 'Erreur chargement séries'
  }
}

async function addFromDraft() {
  error.value = ''
  if (!draft.value.nom || !draft.value.date) {
    error.value = 'Nom et date sont requis'
    return
  }
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft.value)
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Erreur serveur')
    draft.value = createDraft()
    await loadSeries()
  } catch (err) {
    error.value = err.message
  }
}

async function updateSerie(s) {
  error.value = ''
  if (!s.nom || !s.date) {
    error.value = 'Nom et date sont requis'
    return
  }
  try {
    const res = await fetch(`${API}/${s._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom: s.nom, date: s.date })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Erreur serveur')
    await loadSeries()
  } catch (err) {
    error.value = err.message
  }
}

async function deleteSerie(s) {
  error.value = ''
  try {
    await fetch(`${API}/${s._id}`, { method: 'DELETE' })
    await loadSeries()
  } catch {
    error.value = 'Erreur suppression'
  }
}

function openResultats(serie) {
  uiStore.selectedSerie = serie
  uiStore.open('resultats')
}

function setSort(key) { sortKey.value = key }

const sortedSaved = computed(() =>
  [...series.value].sort((a, b) =>
    (a[sortKey.value] || '').localeCompare(b[sortKey.value] || '')
  )
)

onMounted(loadSeries)
</script>

<style scoped>
.series-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
}

.table-container {
  flex: 1;
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 400px;
}

th, td {
  border: 1px solid #ccc;
  padding: 6px;
  text-align: left;
}

th {
  cursor: pointer;
  background: #f3f3f3;
  user-select: none;
}

input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
}

.empty-row {
  background: #f9f9f9;
  opacity: 0.75;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.error-box {
  margin-top: 8px;
  padding: 8px;
  background: #ffdddd;
  border: 1px solid red;
  color: #900;
  font-size: 13px;
  font-weight: bold;
}
</style>