<template>

  <div class="resultats-window">

    <div class="title-bar">
      <h2>
        Résultats — {{ selectedSerie?.nom }}
      </h2>

      <button @click="toggleDiscards">
        Discards:
        {{ discardsEnabled ? 'ON' : 'OFF' }}
      </button>
    </div>

    <div class="table-container">

      <table>

        <thead>
          <tr>
            <th>Bateau</th>
            <th>Classe</th>
            <th>Voile</th>
            <th>Barreur</th>

            <th
              v-for="course in courses"
              :key="course"
            >
              {{ course }}
            </th>

            <th>Total</th>
            <th>Classement</th>
          </tr>
        </thead>

        <tbody>

          <tr
            v-for="boat in boats"
            :key="boat._id"
          >

            <td>{{ boat.nom }}</td>
            <td>{{ boat.type }}</td>
            <td>{{ boat.numeroVoile }}</td>
            <td>{{ boat.skippers }}</td>

            <td
              v-for="course in courses"
              :key="course"
            >
              {{ getPoints(boat, course) }}
            </td>

            <td>
              {{ getTotal(boat) }}
            </td>

            <td>
              {{ getRank(boat) }}
            </td>

          </tr>

        </tbody>

      </table>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { uiStore } from '../../store/uiStore'
import { onMounted } from 'vue'

onMounted(() => {
  loadResultats()
})

const selectedSerie = uiStore.selectedSerie

const discardsEnabled = ref(false)

const courses = ref([1, 2, 3])

const boats = ref([
  {
    _id: 1,
    nom: 'Black Pearl',
    type: 'Laser',
    numeroVoile: '123',
    skippers: 'Jack'
  },
  {
    _id: 2,
    nom: 'Sea Wind',
    type: '420',
    numeroVoile: '456',
    skippers: 'Anna'
  }
])

const results = ref([
  { boatId: 1, course: 1, points: 1 },
  { boatId: 1, course: 2, points: 2 },
  { boatId: 1, course: 3, points: 3 },

  { boatId: 2, course: 1, points: 2 },
  { boatId: 2, course: 2, points: 1 },
  { boatId: 2, course: 3, points: 4 }
])

const API = 'http://localhost:3000/api/resultats'

const resultats = ref([])

async function loadResultats() {
  try {
    const res = await fetch(API)
    resultats.value = await res.json()
  } catch (err) {
    console.error('Erreur load resultats:', err)
  }
}

async function addResultat(bateauId, course, points) {
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        serieId: uiStore.selectedSerie._id,
        bateauId,
        course,
        points
      })
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.error)

    await loadResultats()

  } catch (err) {
    console.error(err)
  }
}

function getPoints(boatId, course) {
  const r = resultats.value.find(
    x => x.bateauId === boatId && x.course === course
  )
  return r ? r.points : '-'
}

function getTotal(boatId) {
  return resultats.value
    .filter(r => r.bateauId === boatId)
    .reduce((sum, r) => sum + r.points, 0)
}

function getRank(boat) {

  const totals = boats.value.map(b => ({
    boatId: b._id,
    total: getTotal(b)
  }))

  totals.sort((a, b) => a.total - b.total)

  return totals.findIndex(t =>
    t.boatId === boat._id
  ) + 1
}

function toggleDiscards() {
  discardsEnabled.value =
    !discardsEnabled.value
}
</script>

<style>


.table-container {
  overflow: auto;

  max-width: 90vw;
  max-height: 75vh;
}

.resultats-window {
  display: flex;
  flex-direction: column;

  width: fit-content;
  height: fit-content;

  padding: 12px;
  box-sizing: border-box;
}

table {
  border-collapse: collapse;
  min-width: 1000px;
}

th,
td {
  border: 1px solid #ccc;
  padding: 6px;
  white-space: nowrap;
}
</style>