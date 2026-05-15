const mongoose = require('mongoose')

const Bateau   = require('./models/Bateau')
const Classe    = require('./models/Classe')
const Serie    = require('./models/Serie')
const Resultat = require('./models/Resultat')
const Course   = require('./models/Course')

const MONGO_URI = 'mongodb://localhost:27017/yrr'

async function seed() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('✓ Connected to:', MONGO_URI)
  } catch (err) {
    console.error('✗ Could not connect:', err.message)
    process.exit(1)
  }

  await Resultat.deleteMany({})
  await Course.deleteMany({})
  await Bateau.deleteMany({})
  await Classe.deleteMany({})
  await Serie.deleteMany({})
  console.log('✓ Cleared')

  const classes = await Classe.insertMany([
    { nom: 'Laser',    handicapType: 'PY',  handicapValue: 1100 },
    { nom: 'Optimist', handicapType: 'PY',  handicapValue: 1642 },
    { nom: '420',      handicapType: 'PY',  handicapValue: 1105 },
    { nom: 'J/24',     handicapType: 'TMF', handicapValue: 0.925 },
    { nom: 'Finn',     handicapType: 'PY',  handicapValue: 1044 },
  ])
  console.log('✓ Classes:', classes.map(c => c.nom))

  const series = await Serie.insertMany([
    { nom: 'Série Printemps', date: '2026-05-01' },
    { nom: 'Série Été',       date: '2026-07-15' },
  ])
  console.log('✓ Séries:', series.map(s => s.nom))

  const bateaux = await Bateau.insertMany([
    { nom: 'Le Mistral',   type: 'Laser',    numeroVoile: 'QC-001', skippers: 'Pierre Tremblay', serie: series[0]._id.toString() },
    { nom: 'Vent du Nord', type: 'J/24',     numeroVoile: 'QC-002', skippers: 'Marie Bouchard',  serie: series[0]._id.toString() },
    { nom: 'Bleu Horizon', type: '420',      numeroVoile: 'QC-003', skippers: 'Luc Gagnon',      serie: series[1]._id.toString() },
    { nom: 'Cap au Vent',  type: 'Finn',     numeroVoile: 'QC-004', skippers: 'Sophie Lavoie',   serie: series[0]._id.toString() },
    { nom: "L'Écume",      type: 'Optimist', numeroVoile: 'QC-005', skippers: 'Antoine Fortin',  serie: series[1]._id.toString() },
  ])
  console.log('✓ Bateaux:', bateaux.map(b => b.nom))

  const courses = await Course.insertMany([
    { nom: 'Course 1', lieu: 'Lac Saint-Louis',  date: '2026-05-10', serie: series[0]._id.toString() },
    { nom: 'Course 2', lieu: 'Lac Saint-Louis',  date: '2026-05-24', serie: series[0]._id.toString() },
    { nom: 'Course 3', lieu: 'Lac Memphrémagog', date: '2026-07-20', serie: series[1]._id.toString() },
  ])
  console.log('✓ Courses:', courses.map(c => c.nom))

  await Resultat.insertMany([
    { serieId: series[0]._id, bateauId: bateaux[0]._id, course: 1, points: 3 },
    { serieId: series[0]._id, bateauId: bateaux[1]._id, course: 1, points: 1 },
    { serieId: series[0]._id, bateauId: bateaux[3]._id, course: 1, points: 2 },
    { serieId: series[0]._id, bateauId: bateaux[0]._id, course: 2, points: 1 },
    { serieId: series[0]._id, bateauId: bateaux[1]._id, course: 2, points: 4 },
    { serieId: series[0]._id, bateauId: bateaux[3]._id, course: 2, points: 2 },
  ])
  console.log('✓ Résultats seeded')

  await mongoose.disconnect()
  console.log('✓ Done')
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})