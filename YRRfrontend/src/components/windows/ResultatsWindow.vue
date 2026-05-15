<template>
  <div class="resultats-window">

    <div class="title-bar">
      <h2>Résultats — {{ selectedSerie?.nom }}</h2>
      <div class="title-actions">
        <button @click="addCourse">+ Course</button>
        <button @click="toggleDiscards">
          Discards: {{ discardsEnabled ? 'ON' : 'OFF' }}
        </button>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Bateau</th>
            <th>Classe</th>
            <th>Voile</th>
            <th>Barreur</th>
            <th v-for="course in courses" :key="course">
              C{{ course }}
              <button class="del-course" @click="removeCourse(course)">×</button>
            </th>
            <th>Total</th>
            <th>Classement</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="boat in boats" :key="boat._id">
            <td>{{ boat.nom }}</td>
            <td>{{ boat.type }}</td>
            <td>{{ boat.numeroVoile }}</td>
            <td>{{ boat.skippers }}</td>

            <td
              v-for="course in courses"
              :key="course"
              class="points-cell"
              @click="startEditCell(boat, course)"
            >
              <!-- Editing this cell -->
              <template v-if="editCell?.bateauId === boat._id && editCell?.course === course">
                <input
                  class="cell-input"
                  v-model="editCell.points"
                  type="number"
                  @keyup.enter="saveCell"
                  @keyup.escape="editCell = null"
                  @blur="saveCell"
                  ref="cellInput"
                  autofocus
                />
              </template>
              <template v-else>
                {{ getPoints(boat, course) }}
              </template>
            </td>

            <td>{{ getTotal(boat) }}</td>
            <td>{{ getRank(boat) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="error" class="error-box">⚠ {{ error }}</div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { uiStore } from '../../store/uiStore'

const API       = 'http://localhost:3000/api/resultats'
const BOATS_API = 'http://localhost:3000/api/bateaux'

const selectedSerie   = uiStore.selectedSerie
const boats           = ref([])
const resultats       = ref([])
const courses         = ref([1])          // starts with 1 course, add more with button
const discardsEnabled = ref(false)
const error           = ref('')
const editCell        = ref(null)         // { bateauId, course, points, existingId? }
const cellInput       = ref(null)

/* ── LOAD ── */
async function loadBoats() {
  try {
    const res = await fetch(BOATS_API)
    boats.value = await res.json()
  } catch {
    error.value = 'Erreur chargement bateaux'
  }
}

async function loadResultats() {
  if (!selectedSerie?._id) return
  try {
    const res = await fetch(`${API}?serieId=${selectedSerie._id}`)
    resultats.value = await res.json()
  } catch {
    error.value = 'Erreur chargement résultats'
  }
}

/* ── CELL EDIT ── */
function startEditCell(boat, course) {
  const existing = resultats.value.find(
    r => r.bateauId?.toString() === boat._id?.toString() && r.course === course
  )
  editCell.value = {
    bateauId:   boat._id,
    course,
    points:     existing ? existing.points : '',
    existingId: existing?._id ?? null
  }
  nextTick(() => {
    if (cellInput.value?.[0]) cellInput.value[0].focus()
  })
}

async function saveCell() {
  if (!editCell.value) return
  const { bateauId, course, points, existingId } = editCell.value
  editCell.value = null

  const pts = Number(points)
  if (isNaN(pts) || points === '') return   // empty = no-op

  try {
    if (existingId) {
      // UPDATE existing
      const res = await fetch(`${API}/${existingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points: pts })
      })
      if (!res.ok) throw new Error()
    } else {
      // CREATE new
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serieId: selectedSerie._id,
          bateauId,
          course,
          points: pts
        })
      })
      if (!res.ok) throw new Error()
    }
    await loadResultats()
  } catch {
    error.value = 'Erreur sauvegarde'
  }
}

/* ── COURSES ── */
function addCourse() {
  courses.value.push(courses.value.length + 1)
}

async function removeCourse(course) {
  // delete all resultats for this course in this serie
  const toDelete = resultats.value.filter(
    r => r.course === course
  )
  await Promise.all(
    toDelete.map(r => fetch(`${API}/${r._id}`, { method: 'DELETE' }))
  )
  courses.value = courses.value.filter(c => c !== course)
    .map((c, i) => i + 1)    // renumber
  await loadResultats()
}

/* ── STATS ── */
function getPoints(boat, course) {
  const r = resultats.value.find(
    r => r.bateauId?.toString() === boat._id?.toString() && r.course === course
  )
  return r != null ? r.points : '-'
}

function getTotal(boat) {
  let rows = resultats.value.filter(
    r => r.bateauId?.toString() === boat._id?.toString()
  )
  if (discardsEnabled.value && rows.length > 1) {
    rows = rows.filter(r => r.points !== Math.max(...rows.map(x => x.points)))
  }
  return rows.reduce((sum, r) => sum + r.points, 0)
}

function getRank(boat) {
  const totals = boats.value.map(b => ({
    id: b._id,
    total: getTotal(b)
  })).sort((a, b) => a.total - b.total)

  const idx = totals.findIndex(t => t.id?.toString() === boat._id?.toString())
  return idx + 1
}

function toggleDiscards() {
  discardsEnabled.value = !discardsEnabled.value
}

onMounted(() => {
  loadBoats()
  loadResultats()
})
</script>

<style scoped>
.resultats-window {
  display: flex;
  flex-direction: column;
  padding: 12px;
  box-sizing: border-box;
  width: fit-content;
  height: fit-content;
}

.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  gap: 12px;
}

.title-bar h2 {
  margin: 0;
}

.title-actions {
  display: flex;
  gap: 8px;
}

.table-container {
  overflow: auto;
  max-width: 90vw;
  max-height: 70vh;
}

table {
  border-collapse: collapse;
  min-width: 600px;
}

th, td {
  border: 1px solid #ccc;
  padding: 6px;
  white-space: nowrap;
}

th {
  background: #f3f3f3;
}

.points-cell {
  cursor: pointer;
  min-width: 60px;
  text-align: center;
}

.points-cell:hover {
  background: #eef4ff;
}

.cell-input {
  width: 50px;
  border: 1px solid #88aaff;
  border-radius: 3px;
  padding: 2px 4px;
  text-align: center;
  font-family: inherit;
}

.del-course {
  margin-left: 4px;
  padding: 0 4px;
  font-size: 12px;
  line-height: 1;
  border: none;
  background: none;
  color: #c00;
  cursor: pointer;
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