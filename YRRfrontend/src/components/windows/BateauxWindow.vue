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
          v-for="(bateau, index) in bateaux"
          :key="index"
          @click="selectBateau(index)"
          :class="{ active: selectedIndex === index }"
        >
          <div>
            <strong>{{ bateau.nom }}</strong>
            — {{ bateau.type }}
            <br />
            <small>
              Skipper: {{ bateau.skippers }} | Série: {{ bateau.serie }}
            </small>
          </div>

          <button @click.stop="removeBateau(index)">X</button>
        </li>
      </ul>
    </div>

    <!-- DETAILS -->
    <div class="details" v-if="selectedBateau">
      <h3>Détails du bateau</h3>

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
import { ref, computed } from 'vue'

/**
 * STATE
 */
const bateaux = ref([])
const selectedIndex = ref(null)

const newBateau = ref({
  nom: '',
  type: '',
  skippers: '',
  serie: ''
})

/**
 * Temporary static series list (later replace with shared store or API)
 */
const seriesList = ref([
  'Série A',
  'Série B',
  'Série C'
])

/**
 * COMPUTED
 */
const selectedBateau = computed(() => {
  if (selectedIndex.value === null) return null
  return bateaux.value[selectedIndex.value]
})

/**
 * METHODS
 */
function addBateau() {
  if (
    !newBateau.value.nom ||
    !newBateau.value.type ||
    !newBateau.value.skippers ||
    !newBateau.value.serie
  ) {
    return
  }

  bateaux.value.push({
    nom: newBateau.value.nom,
    type: newBateau.value.type,
    skippers: newBateau.value.skippers,
    serie: newBateau.value.serie
  })

  // reset form
  newBateau.value.nom = ''
  newBateau.value.type = ''
  newBateau.value.skippers = ''
  newBateau.value.serie = ''
}

function removeBateau(index) {
  bateaux.value.splice(index, 1)

  if (selectedIndex.value === index) {
    selectedIndex.value = null
  }
}

function selectBateau(index) {
  selectedIndex.value = index
}
</script>

<style scoped>
.bateaux-window {
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
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

.list {
  flex: 1;
  overflow-y: auto;
}

.list ul {
  list-style: none;
  padding: 0;
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

.details {
  border-top: 2px solid #000;
  margin-top: 10px;
  padding-top: 10px;
}

.info {
  margin-top: 10px;
  font-style: italic;
  color: #666;
}
</style>