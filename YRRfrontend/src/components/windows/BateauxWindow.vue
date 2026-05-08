<template>
  <div class="bateaux-window">

    <!-- FORM -->
    <div class="form">
      <input v-model="newBateau.nom" placeholder="Nom du bateau" />
      <input v-model="newBateau.type" placeholder="Type (voilier, etc.)" />
      <input v-model="newBateau.skippers" placeholder="Skipper(s)" />

      <select v-model="newBateau.serie">
        <option disabled value="">Associer une série</option>
        <option v-for="s in seriesList" :key="s" :value="s">
          {{ s }}
        </option>
      </select>

      <button @click="addBateau">Ajouter</button>
    </div>

    <!-- LIST -->
    <div class="list">
      <h3>Liste des bateaux</h3>

      <ul>
        <li
          v-for="bateau in bateaux"
          :key="bateau._id"
          @click="selectBateau(bateau)"
          :class="{ active: selectedBateau?._id === bateau._id }"
        >
          <div>
            <strong>{{ bateau.nom }}</strong>
            — {{ bateau.type }}
            <br />
            <small>
              Skipper: {{ bateau.skippers }} | Série: {{ bateau.serie }}
            </small>
          </div>

          <button @click.stop="removeBateau(bateau)">X</button>
        </li>
      </ul>
    </div>

    <!-- DETAILS -->
    <div class="details" v-if="selectedBateau && showDetails">

  <div class="details-header">
    <h3>Détails du bateau</h3>
    <button class="close-btn" @click="closeDetails">✕</button>
  </div>

  <p><strong>Nom:</strong> {{ selectedBateau.nom }}</p>
  <p><strong>Type:</strong> {{ selectedBateau.type }}</p>
  <p><strong>Skipper(s):</strong> {{ selectedBateau.skippers }}</p>
  <p><strong>Série:</strong> {{ selectedBateau.serie }}</p>

</div>

    <div v-if="bateaux.length === 0" class="info">
      Aucun bateau enregistré.
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const API = 'http://localhost:3000/api/bateaux'


const bateaux = ref([])
const selectedBateau = ref(null)
const showDetails = ref(false)

const newBateau = ref({
  nom: '',
  type: '',
  skippers: '',
  serie: ''
})

const seriesList = ref([
  'Série A',
  'Série B',
  'Série C'
])


async function loadBateaux() {
  try {
    const res = await fetch(API)

    if (!res.ok) {
      throw new Error('Erreur API')
    }

    bateaux.value = await res.json()

    console.log(bateaux.value)
  } catch (err) {
    console.error('Erreur chargement bateaux:', err)
  }
}

async function addBateau() {
  if (
    !newBateau.value.nom ||
    !newBateau.value.type ||
    !newBateau.value.skippers ||
    !newBateau.value.serie
  ) return

  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newBateau.value)
    })

    const data = await res.json()

    console.log('Réponse API:', data)

    if (!res.ok) {
      throw new Error(data.error)
    }

    newBateau.value = {
      nom: '',
      type: '',
      skippers: '',
      serie: ''
    }

    await loadBateaux()

  } catch (err) {
    console.error('Erreur ajout bateau:', err)
  }
}

async function removeBateau(bateau) {
  try {
    await fetch(`${API}/${bateau._id}`, {
      method: 'DELETE'
    })

    if (selectedBateau.value?._id === bateau._id) {
      selectedBateau.value = null
    }

    loadBateaux()
  } catch (err) {
    console.error('Erreur suppression bateau:', err)
  }
}

function selectBateau(bateau) {
  selectedBateau.value = bateau
  showDetails.value = true
}

function closeDetails() {
  showDetails.value = false
}

onMounted(() => {
  loadBateaux()
})
</script>

<style scoped>
.bateaux-window {
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
}

.form input,
.form select {
  padding: 5px;
}

.form button {
  padding: 6px;
  cursor: pointer;
}

/* LIST */
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
  border: 1px solid #ccc;
  margin-bottom: 6px;
  padding: 6px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}

.list li.active {
  background: #d0e6ff;
}

/* DETAILS */
.details {
  border-top: 2px solid #000;
  margin-top: 10px;
  padding-top: 10px;
}

/* INFO */
.info {
  margin-top: 10px;
  font-style: italic;
  color: #666;
}
.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
}
</style>