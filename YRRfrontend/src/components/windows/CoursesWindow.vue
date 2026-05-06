<template>
  <div class="courses-window">

    <!-- FORM -->
    <div class="form">
      <input v-model="newCourse.nom" placeholder="Nom de la course" />

      <input v-model="newCourse.lieu" placeholder="Lieu" />

      <input v-model="newCourse.date" type="date" />

      <select v-model="newCourse.serie">
        <option disabled value="">Associer une série</option>
        <option v-for="s in seriesList" :key="s" :value="s">
          {{ s }}
        </option>
      </select>

      <button @click="addCourse">Ajouter</button>
    </div>

    <!-- LIST -->
    <div class="list">
      <h3>Liste des courses</h3>

      <ul>
        <li
          v-for="(course, index) in courses"
          :key="index"
          @click="selectCourse(index)"
          :class="{ active: selectedIndex === index }"
        >
          <div>
            <strong>{{ course.nom }}</strong>
            — {{ course.lieu }} — {{ course.date }}
            <br />
            <small>Série: {{ course.serie }}</small>
          </div>

          <button @click.stop="removeCourse(index)">X</button>
        </li>
      </ul>
    </div>

    <!-- DETAILS -->
    <div class="details" v-if="selectedCourse">
      <h3>Détails de la course</h3>

      <p><strong>Nom:</strong> {{ selectedCourse.nom }}</p>
      <p><strong>Lieu:</strong> {{ selectedCourse.lieu }}</p>
      <p><strong>Date:</strong> {{ selectedCourse.date }}</p>
      <p><strong>Série:</strong> {{ selectedCourse.serie }}</p>
    </div>

    <div v-if="courses.length === 0" class="info">
      Aucune course enregistrée.
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

/**
 * STATE
 */
const courses = ref([])
const selectedIndex = ref(null)

const newCourse = ref({
  nom: '',
  lieu: '',
  date: '',
  serie: ''
})

/**
 * Temporary static series list (replace later with shared store or API)
 */
const seriesList = ref([
  'Série A',
  'Série B',
  'Série C'
])

/**
 * COMPUTED
 */
const selectedCourse = computed(() => {
  if (selectedIndex.value === null) return null
  return courses.value[selectedIndex.value]
})

/**
 * METHODS
 */
function addCourse() {
  if (
    !newCourse.value.nom ||
    !newCourse.value.lieu ||
    !newCourse.value.date ||
    !newCourse.value.serie
  ) {
    return
  }

  courses.value.push({
    nom: newCourse.value.nom,
    lieu: newCourse.value.lieu,
    date: newCourse.value.date,
    serie: newCourse.value.serie
  })

  // reset form
  newCourse.value.nom = ''
  newCourse.value.lieu = ''
  newCourse.value.date = ''
  newCourse.value.serie = ''
}

function removeCourse(index) {
  courses.value.splice(index, 1)

  if (selectedIndex.value === index) {
    selectedIndex.value = null
  }
}

function selectCourse(index) {
  selectedIndex.value = index
}
</script>

<style scoped>
.courses-window {
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