<template>
  <div class="courses-window">

    <!-- ADD FORM -->
    <div class="form">
      <input v-model="draft.nom"  placeholder="Nom de la course" />
      <input v-model="draft.lieu" placeholder="Lieu" />
      <input v-model="draft.date" type="date" />
      <select v-model="draft.serie">
        <option value="">Associer une série</option>
        <option v-for="s in seriesList" :key="s._id" :value="s._id">{{ s.nom }}</option>
      </select>
      <div v-if="error" class="error-box">⚠ {{ error }}</div>
      <button @click="addFromDraft">Ajouter</button>
    </div>

    <!-- LIST -->
    <div class="list">
      <div v-if="courses.length === 0" class="info">Aucune course enregistrée.</div>

      <ul>
        <li
          v-for="c in courses"
          :key="c._id"
          :class="{ active: editingId === c._id }"
        >
          <!-- View mode -->
          <template v-if="editingId !== c._id">
            <div class="view-row" @click="startEdit(c)">
              <div>
                <strong>{{ c.nom }}</strong> — {{ c.lieu }} — {{ c.date }}
                <br />
                <small>Série: {{ serieName(c.serie) }}</small>
              </div>
              <button class="cancel" @click.stop="deleteCourse(c)">X</button>
            </div>
          </template>

          <!-- Edit mode -->
          <template v-else>
            <div class="edit-form">
              <input v-model="editDraft.nom"  placeholder="Nom" />
              <input v-model="editDraft.lieu" placeholder="Lieu" />
              <input v-model="editDraft.date" type="date" />
              <select v-model="editDraft.serie">
                <option value="">Aucune série</option>
                <option v-for="s in seriesList" :key="s._id" :value="s._id">{{ s.nom }}</option>
              </select>
              <div class="edit-actions">
                <button @click="saveEdit(c)">Save</button>
                <button @click="cancelEdit">Annuler</button>
                <button class="cancel" @click="deleteCourse(c)">Supprimer</button>
              </div>
            </div>
          </template>

        </li>
      </ul>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const API       = 'http://localhost:3000/api/courses'
const SERIE_API = 'http://localhost:3000/api/series'

const courses    = ref([])
const seriesList = ref([])
const error      = ref('')
const editingId  = ref(null)
const editDraft  = ref({})
const draft      = ref(createDraft())

function createDraft() {
  return { nom: '', lieu: '', date: '', serie: '' }
}

/* ── LOAD ── */
async function loadCourses() {
  try {
    const res = await fetch(API)
    courses.value = await res.json()
  } catch {
    error.value = 'Erreur chargement courses'
  }
}

async function loadSeries() {
  try {
    const res = await fetch(SERIE_API)
    if (!res.ok) throw new Error()
    seriesList.value = await res.json()
  } catch {
    // not critical
  }
}

// resolve serie _id → nom for display in view mode
function serieName(id) {
  if (!id) return '—'
  const s = seriesList.value.find(s => s._id === id)
  return s ? s.nom : id
}

/* ── ADD ── */
async function addFromDraft() {
  error.value = ''
  if (!draft.value.nom || !draft.value.lieu || !draft.value.date) {
    error.value = 'Nom, lieu et date sont requis'
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
    await loadCourses()
  } catch (err) {
    error.value = err.message
  }
}

/* ── EDIT ── */
function startEdit(c) {
  editingId.value = c._id
  editDraft.value = {
    nom:   c.nom   ?? '',
    lieu:  c.lieu  ?? '',
    date:  c.date  ?? '',
    serie: c.serie ?? ''
  }
}

function cancelEdit() {
  editingId.value = null
  editDraft.value = {}
}

async function saveEdit(c) {
  error.value = ''
  if (!editDraft.value.nom || !editDraft.value.lieu || !editDraft.value.date) {
    error.value = 'Nom, lieu et date sont requis'
    return
  }
  try {
    const res = await fetch(`${API}/${c._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom:   editDraft.value.nom,
        lieu:  editDraft.value.lieu,
        date:  editDraft.value.date,
        serie: editDraft.value.serie
      })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Erreur serveur')
    cancelEdit()
    await loadCourses()
  } catch (err) {
    error.value = err.message
  }
}

/* ── DELETE ── */
async function deleteCourse(c) {
  try {
    await fetch(`${API}/${c._id}`, { method: 'DELETE' })
    cancelEdit()
    await loadCourses()
  } catch {
    error.value = 'Erreur suppression'
  }
}

onMounted(() => {
  loadCourses()
  loadSeries()
})
</script>

<style scoped>
.courses-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
}

.form input,
.form select {
  padding: 5px 8px;
  font-family: inherit;
  font-size: 14px;
  border: 0.5px solid #ddd;
  border-radius: 6px;
  outline: none;
  background: transparent;
  color: inherit;
}

.form input:focus,
.form select:focus {
  border-color: #aac4f0;
  background: #eef4ff;
}

.form input[type="date"] { color-scheme: light dark; }

.list {
  flex: 1;
  overflow-y: auto;
}

.list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list li {
  border-bottom: 0.5px solid #eee;
  padding: 8px 10px;
  font-size: 14px;
}

.list li:last-child { border-bottom: none; }

.list li.active { background: #eef4ff; }

.view-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  cursor: pointer;
}

.view-row small {
  color: #888;
  font-size: 12px;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
}

.edit-form input,
.edit-form select {
  padding: 4px 8px;
  font-family: inherit;
  font-size: 14px;
  border: 0.5px solid #ddd;
  border-radius: 6px;
  outline: none;
  background: transparent;
  color: inherit;
}

.edit-form input:focus,
.edit-form select:focus {
  border-color: #aac4f0;
  background: #eef4ff;
}

.edit-form input[type="date"] { color-scheme: light dark; }

.edit-actions {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}

.info {
  font-size: 13px;
  font-style: italic;
  color: #888;
  margin-bottom: 8px;
}

.error-box {
  padding: 6px 10px;
  background: #ffdddd;
  border: 1px solid red;
  color: #900;
  font-size: 13px;
  border-radius: 4px;
}
</style>