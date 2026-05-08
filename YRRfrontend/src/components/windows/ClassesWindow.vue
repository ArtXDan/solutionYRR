<template>
  <div class="classes-window">

    <div class="table-container">

      <table>
        <thead>
          <tr>
            <th @click="setSort('nom')">Nom</th>
            <th @click="setSort('handicapType')">Type</th>
            <th @click="setSort('handicapValue')">Handicap</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(c, index) in sortedClasses"
            :key="c._id || index"
            :class="{ empty: isEmpty(c) }"
          >

            <td>
              <input
              v-model="c.nom"
              @input="error = ''"
              />
            </td>

            <td>
              <select
                v-model="c.handicapType">
                <option value="">-</option>
                <option value="PY">PY</option>
                <option value="TMF">TMF</option>
              </select>
            </td>

            <td>
              <input
                v-model="c.handicapValue"
                placeholder="0000"
              />
            </td>
              <td>
              <button @click="saveClass(c)">Save</button>
              </td>
            <td>
              <button @click="deleteClass(c)">X</button>
            </td>
            

          </tr>
        </tbody>
      </table>

    </div>

    <!-- ACTIONS -->
    <div class="actions">
      <button @click="addEmptyRow">Ajouter</button>
      <button @click="loadClasses">Reload</button>
    </div>

    <div v-if="saveAttempted && error" class="error-box">
  ⚠ {{ error }}
</div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const API = 'http://localhost:3000/api/classes'

const saveAttempted = ref(false)
const classes = ref([])
const error = ref('')
const sortKey = ref('nom')

/* LOAD */
async function loadClasses() {
  const res = await fetch('http://localhost:3000/api/classes')
  classes.value = await res.json()
}

function ensureEmptyRow() {
  const last = classes.value[classes.value.length - 1]
  if (!last || last._id) {
    classes.value.push(createEmptyClass())
  }
}

function createEmptyClass() {
  return {
    nom: '',
    handicapType: '',
    handicapValue: ''
  }
}

function isEmpty(c) {
  return !c.nom && !c.handicapType && !c.handicapValue
}

async function saveClass(c) {
  saveAttempted.value = true
  error.value = ''

  // validation only AFTER click
  if (!c.nom || !c.handicapType || !c.handicapValue) {
    error.value = 'Tous les champs doivent être remplis'
    return
  }

  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom: c.nom,
        handicapType: c.handicapType,
        handicapValue: Number(c.handicapValue)
      })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Erreur serveur')
    }

    if (!c._id) {
      c._id = data._id
    }

  } catch (err) {
    error.value = err.message
  }
}

async function deleteClass(c) {
  if (!c._id) return

  await fetch(`${API}/${c._id}`, {
    method: 'DELETE'
  })

  await loadClasses()
}

function addEmptyRow() {
  const newClass = createEmptyClass()
  classes.value.push(newClass)

  saveClass(newClass)
}

function setSort(key) {
  sortKey.value = key
}

const sortedClasses = computed(() => {
  return [...classes.value].sort((a, b) => {
    return (a[sortKey.value] || '').toString().localeCompare(
      (b[sortKey.value] || '').toString()
    )
  })
})

onMounted(() => {
  loadClasses()
})
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
  min-width: 500px;
}

th, td {
  border: 1px solid #ccc;
  padding: 6px;
  text-align: left;
}

th {
  cursor: pointer;
  background: #f3f3f3;
}

.empty {
  background: #f9f9f9;
  opacity: 0.7;
}

input, select {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.error {
  margin-top: 10px;
  color: red;
  font-size: 13px;
}

.error-box {
  margin-top: 10px;
  padding: 8px;
  background: #ffdddd;
  border: 1px solid red;
  color: #900;
  font-weight: bold;
}
</style>