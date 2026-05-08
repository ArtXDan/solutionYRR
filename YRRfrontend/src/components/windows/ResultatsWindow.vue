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
  loadBoats()
})

const selectedSerie = uiStore.selectedSerie

const discardsEnabled = ref(false)

const courses = ref([1, 2, 3])

const boats = ref([])

const API = 'http://localhost:3000/api/resultats'

const resultats = ref([])

const BOATS_API = 'http://localhost:3000/api/bateaux'

async function loadBoats() {
  try {
    const res = await fetch(BOATS_API)
    boats.value = await res.json()

    console.log('BOATS FROM DB:', boats.value)
  } catch (err) {
    console.error('Erreur load boats:', err)
  }
}

async function loadResultats() {
  try {
    const res = await fetch(API)

    const data = await res.json()
    resultats.value = data

    console.log('RESULTATS FROM DB:', data)

  } catch (err) {
    console.error('Erreur load resultats:', err)
  }
}

async function addResultat(boat, course, points) {
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        serieId: selectedSerie._id,
        bateauId: boat._id,
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

function getPoints(boat, course) {
  const r = resultats.value.find(
    x =>
      x.bateauId?.toString() === boat._id?.toString() &&
      x.course === course
  )
  return r ? r.points : '-'
}

function getTotal(boat) {
  return resultats.value
    .filter(r =>
      r.bateauId?.toString() === boat._id?.toString()
    )
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