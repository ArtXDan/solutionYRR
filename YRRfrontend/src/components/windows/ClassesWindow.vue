<template>
  <div class="classes-window">

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th @click="setSort('nom')">Nom {{ sortKey === 'nom' ? '↕' : '' }}</th>
            <th @click="setSort('handicapType')">Type {{ sortKey === 'handicapType' ? '↕' : '' }}</th>
            <th @click="setSort('handicapValue')">Handicap {{ sortKey === 'handicapValue' ? '↕' : '' }}</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>

          <!-- Saved rows from DB -->
          <tr v-for="c in sortedSaved" :key="c._id">
            <td><input v-model="c.nom" /></td>
            <td>
              <select v-model="c.handicapType">
                <option value="">-</option>
                <option value="PY">PY</option>
                <option value="TMF">TMF</option>
              </select>
            </td>
            <td><input v-model="c.handicapValue" placeholder="0000" /></td>
            <td><button @click="updateClass(c)">Save</button></td>
            <td><button class="cancel" @click="deleteClass(c)">X</button></td>
          </tr>

          <!-- Empty row always at the bottom -->
          <tr class="empty-row">
            <td><input v-model="draft.nom" placeholder="Nom..." /></td>
            <td>
              <select v-model="draft.handicapType">
                <option value="">-</option>
                <option value="PY">PY</option>
                <option value="TMF">TMF</option>
              </select>
            </td>
            <td><input v-model="draft.handicapValue" placeholder="0000" /></td>
            <td colspan="2"></td>
          </tr>

        </tbody>
      </table>
    </div>

    <div v-if="error" class="error-box">⚠ {{ error }}</div>

    <div class="actions">
      <button @click="addFromDraft">Ajouter</button>
      <button @click="loadClasses">Reload</button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onMounted } from 'vue'

const API = 'http://localhost:3000/api/classes'

const classes = ref([])   // only DB-persisted rows
const error = ref('')
const sortKey = ref('nom')

const draft = ref(createDraft())

function createDraft() {
  return { nom: '', handicapType: '', handicapValue: '' }
}

/* ── LOAD ── */
async function loadClasses() {
  try {
    const res = await fetch(API)
    classes.value = await res.json()
  } catch (err) {
    error.value = 'Erreur chargement'
  }
}

/* ── ADD (draft → DB) ── */
async function addFromDraft() {
  error.value = ''

  if (!draft.value.nom || !draft.value.handicapType || !draft.value.handicapValue) {
    error.value = 'Tous les champs doivent être remplis'
    return
  }

  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom: draft.value.nom,
        handicapType: draft.value.handicapType,
        handicapValue: Number(draft.value.handicapValue)
      })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Erreur serveur')

    draft.value = createDraft()   // reset empty row
    await loadClasses()

  } catch (err) {
    error.value = err.message
  }
}

/* ── UPDATE ── */
async function updateClass(c) {
  error.value = ''

  if (!c.nom || !c.handicapType || !c.handicapValue) {
    error.value = 'Tous les champs doivent être remplis'
    return
  }

  try {
    const res = await fetch(`${API}/${c._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom: c.nom,
        handicapType: c.handicapType,
        handicapValue: Number(c.handicapValue)
      })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Erreur serveur')

    await loadClasses()

  } catch (err) {
    error.value = err.message
  }
}

/* ── DELETE ── */
async function deleteClass(c) {
  error.value = ''
  try {
    await fetch(`${API}/${c._id}`, { method: 'DELETE' })
    await loadClasses()
  } catch (err) {
    error.value = 'Erreur suppression'
  }
}

/* ── SORT ── */
function setSort(key) {
  sortKey.value = key
}

const sortedSaved = computed(() =>
  [...classes.value].sort((a, b) =>
    (a[sortKey.value] || '').toString().localeCompare(
      (b[sortKey.value] || '').toString()
    )
  )
)

onMounted(loadClasses)
</script>

<style scoped>
.classes-window {
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

th:last-child, th:nth-last-child(2) {
  cursor: default;
}

input, select {
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