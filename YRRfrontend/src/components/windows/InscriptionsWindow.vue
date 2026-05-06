<template>
  <div class="inscriptions-window">
    <h2>Inscriptions</h2>

    <!-- FORM -->
    <div class="form">
      <input v-model="newInscription.nom" placeholder="Nom du participant" />
      <input v-model="newInscription.prenom" placeholder="Prénom" />

      <select v-model="newInscription.serie">
        <option disabled value="">Choisir une série</option>
        <option v-for="s in seriesList" :key="s" :value="s">
          {{ s }}
        </option>
      </select>

      <button @click="addInscription">Ajouter</button>
    </div>

    <!-- LIST -->
    <div class="list">
      

      <ul>
        <li
          v-for="(inscription, index) in inscriptions"
          :key="index"
        >
          <div>
            <strong>{{ inscription.nom }} {{ inscription.prenom }}</strong>
            — {{ inscription.serie }}
          </div>

          <button @click="removeInscription(index)">X</button>
        </li>
      </ul>
    </div>

    <!-- INFO -->
    <div class="info" v-if="inscriptions.length === 0">
      Aucune inscription pour le moment.
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

/**
 * Local state (will later be replaced or synced with backend)
 */
const inscriptions = ref([])

const newInscription = ref({
  nom: '',
  prenom: '',
  serie: ''
})

/**
 * Example static data (later replace with API call)
 */
const seriesList = ref([
  'Série A',
  'Série B',
  'Série C'
])

/**
 * Add inscription
 */
function addInscription() {
  if (
    !newInscription.value.nom ||
    !newInscription.value.prenom ||
    !newInscription.value.serie
  ) {
    return
  }

  inscriptions.value.push({
    nom: newInscription.value.nom,
    prenom: newInscription.value.prenom,
    serie: newInscription.value.serie
  })

  // reset form
  newInscription.value.nom = ''
  newInscription.value.prenom = ''
  newInscription.value.serie = ''
}

/**
 * Remove inscription
 */
function removeInscription(index) {
  inscriptions.value.splice(index, 1)
}
</script>

<style scoped>
.inscriptions-window {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 8px; /* better spacing control */
}

.form {
  display: flex;
  flex-direction: column;
  gap: 5px;

  flex-shrink: 0;
}

.form input,
.form select {
  padding: 5px;
}

.form button {
  margin-top: 5px;
  padding: 6px;
  cursor: pointer;
}

.list {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.list ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.list li {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;

  margin-bottom: 5px;
}

.info {
  margin-top: 10px;
  font-style: italic;
  color: #666;
}
</style>