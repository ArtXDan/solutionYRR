// seed.js — node seed.js
const mongoose = require('mongoose')

const Bateau  = require('./models/Bateau')
const Classe   = require('./models/Classe')   // adjust filename if needed
const Serie   = require('./models/Serie')
const Resultat = require('./models/Resultat')

const MONGO_URI = 'mongodb://localhost:27017/yrr'

async function seed() {
  await mongoose.connect(MONGO_URI)
  console.log('Connected')

  await Resultat.deleteMany({})
  await Bateau.deleteMany({})
  await Classe.deleteMany({})
  await Serie.deleteMany({})
  console.log('Cleared')

  const classes = await Classe.insertMany([
    { nom: 'Laser',    handicapType: 'PY',  handicapValue: 1100 },
    { nom: 'Optimist', handicapType: 'PY',  handicapValue: 1642 },
    { nom: '420',      handicapType: 'PY',  handicapValue: 1105 },
    { nom: 'J/24',     handicapType: 'TMF', handicapValue: 0.925 },
    { nom: 'Finn',     handicapType: 'PY',  handicapValue: 1044 },
  ])
  console.log('Classes:', classes.map(c => c.nom))

  const series = await Serie.insertMany([
    { nom: 'Série Printemps', date: '2026-05-01' },
    { nom: 'Série Été',       date: '2026-07-15' },
  ])
  console.log('Séries:', series.map(s => s.nom))

  const bateaux = await Bateau.insertMany([
    { nom: 'Le Mistral',   type: 'Laser',    numeroVoile: 'QC-001', skippers: 'Pierre Tremblay', serie: series[0]._id },
    { nom: 'Vent du Nord', type: 'J/24',     numeroVoile: 'QC-002', skippers: 'Marie Bouchard',  serie: series[0]._id },
    { nom: 'Bleu Horizon', type: '420',      numeroVoile: 'QC-003', skippers: 'Luc Gagnon',      serie: series[1]._id },
    { nom: 'Cap au Vent',  type: 'Finn',     numeroVoile: 'QC-004', skippers: 'Sophie Lavoie',   serie: series[0]._id },
    { nom: "L'Écume",      type: 'Optimist', numeroVoile: 'QC-005', skippers: 'Antoine Fortin',  serie: series[1]._id },
  ])
  console.log('Bateaux:', bateaux.map(b => b.nom))

  // Seed some results for Série Printemps, 2 courses
  await Resultat.insertMany([
    { serieId: series[0]._id, bateauId: bateaux[0]._id, course: 1, points: 3 },
    { serieId: series[0]._id, bateauId: bateaux[1]._id, course: 1, points: 1 },
    { serieId: series[0]._id, bateauId: bateaux[3]._id, course: 1, points: 2 },
    { serieId: series[0]._id, bateauId: bateaux[0]._id, course: 2, points: 1 },
    { serieId: series[0]._id, bateauId: bateaux[1]._id, course: 2, points: 4 },
    { serieId: series[0]._id, bateauId: bateaux[3]._id, course: 2, points: 2 },
  ])
  console.log('Résultats seeded')

  await mongoose.disconnect()
  console.log('Done!')
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})