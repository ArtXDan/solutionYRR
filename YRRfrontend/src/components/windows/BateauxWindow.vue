<template>
  <div class="bateaux-window">

    <!-- ADD FORM -->
    <div class="form">
      <input v-model="draft.nom"         placeholder="Nom du bateau" />
      <input v-model="draft.type"        placeholder="Type (voilier, etc.)" />
      <input v-model="draft.numeroVoile" placeholder="N° voile" />
      <input v-model="draft.skippers"    placeholder="Skipper(s)" />
      <select v-model="draft.serie">
        <option value="">Associer une série</option>
        <option v-for="s in seriesList" :key="s._id" :value="s._id">{{ s.nom }}</option>
      </select>
      <div v-if="error" class="error-box">⚠ {{ error }}</div>
      <button @click="addFromDraft">Ajouter</button>
    </div>

    <!-- LIST -->
    <div class="list">
      <div v-if="bateaux.length === 0" class="info">Aucun bateau enregistré.</div>

      <ul>
        <li
          v-for="b in bateaux"
          :key="b._id"
          :class="{ active: editingId === b._id }"
        >
          <!-- View mode — click anywhere to open edit -->
          <template v-if="editingId !== b._id">
            <div class="view-row" @click="startEdit(b)">
              <div>
                <strong>{{ b.nom }}</strong> — {{ b.type }}
                <br />
                <small>Voile: {{ b.numeroVoile }} | Skipper: {{ b.skippers }}</small>
              </div>
              <button class="cancel" @click.stop="deleteBateau(b)">X</button>
            </div>
          </template>

          <!-- Edit mode -->
          <template v-else>
            <div class="edit-form">
              <input v-model="editDraft.nom"         placeholder="Nom" />
              <input v-model="editDraft.type"        placeholder="Type" />
              <input v-model="editDraft.numeroVoile" placeholder="N° voile" />
              <input v-model="editDraft.skippers"    placeholder="Skipper(s)" />
              <select v-model="editDraft.serie">
                <option value="">Aucune série</option>
                <option v-for="s in seriesList" :key="s._id" :value="s._id">{{ s.nom }}</option>
              </select>
              <div class="edit-actions">
                <button @click="saveEdit(b)">Save</button>
                <button @click="cancelEdit">Annuler</button>
                <button class="cancel" @click="deleteBateau(b)">Supprimer</button>
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

const API       = 'http://localhost:3000/api/bateaux'
const SERIE_API = 'http://localhost:3000/api/series'

const bateaux    = ref([])
const seriesList = ref([])
const error      = ref('')
const editingId  = ref(null)
const editDraft  = ref({})
const draft      = ref(createDraft())

function createDraft() {
  return { nom: '', type: '', numeroVoile: '', skippers: '', serie: '' }
}

async function loadBateaux() {
  try {
    const res = await fetch(API)
    bateaux.value = await res.json()
  } catch {
    error.value = 'Erreur chargement bateaux'
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

async function addFromDraft() {
  error.value = ''
  if (!draft.value.nom || !draft.value.type || !draft.value.skippers) {
    error.value = 'Nom, type et skipper sont requis'
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
    await loadBateaux()
  } catch (err) {
    error.value = err.message
  }
}

function startEdit(b) {
  editingId.value = b._id
  editDraft.value = {
    nom:         b.nom         ?? '',
    type:        b.type        ?? '',
    numeroVoile: b.numeroVoile ?? '',
    skippers:    b.skippers    ?? '',
    serie:       b.serie?._id  ?? b.serie ?? ''
  }
}

function cancelEdit() {
  editingId.value = null
  editDraft.value = {}
}

async function saveEdit(b) {
  error.value = ''
  if (!editDraft.value.nom || !editDraft.value.type || !editDraft.value.skippers) {
    error.value = 'Nom, type et skipper sont requis'
    return
  }
  try {
    const res = await fetch(`${API}/${b._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom:         editDraft.value.nom,
        type:        editDraft.value.type,
        numeroVoile: editDraft.value.numeroVoile,
        skippers:    editDraft.value.skippers,
        serie:       editDraft.value.serie
      })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Erreur serveur')
    cancelEdit()
    await loadBateaux()
  } catch (err) {
    error.value = err.message
  }
}

async function deleteBateau(b) {
  try {
    await fetch(`${API}/${b._id}`, { method: 'DELETE' })
    cancelEdit()
    await loadBateaux()
  } catch {
    error.value = 'Erreur suppression'
  }
}

onMounted(() => {
  loadBateaux()
  loadSeries()
})
</script>

<style scoped>
.bateaux-window {
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

.view-row:hover { color: #333; }

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