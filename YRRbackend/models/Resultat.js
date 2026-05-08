const mongoose = require('mongoose')

const resultatSchema = new mongoose.Schema({
  serieId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Serie'
  },

  course: {
    type: Number,
    required: true
  },

  bateauId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Bateau'
  },

  points: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('Resultat', resultatSchema)