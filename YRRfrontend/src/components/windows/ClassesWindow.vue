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
}

thead th {
  text-align: left;
  font-size: 13px;
  font-weight: 500;
  color: #888;
  padding: 6px 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

thead th:hover { color: #333; }

tbody tr { border-bottom: 0.5px solid #eee; }
tbody tr:last-child { border-bottom: none; }
tbody tr:hover { background: #f9f9f9; }

tbody td {
  padding: 6px 10px;
  font-size: 14px;
}

input, select {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: 14px;
  padding: 0;
}

input:focus, select:focus {
  background: #eef4ff;
  border-radius: 4px;
  padding: 2px 4px;
}

.empty-row { opacity: 0.45; }
.empty-row:hover { opacity: 1; }

.actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.error-box {
  margin-top: 8px;
  padding: 8px 10px;
  background: #ffdddd;
  border: 1px solid red;
  color: #900;
  font-size: 13px;
}
</style>