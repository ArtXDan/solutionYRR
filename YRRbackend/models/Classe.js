const mongoose = require('mongoose')

const classeSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    unique: true
  },

  handicapType: {
    type: String,
    enum: ['PY', 'TMF'],
    required: true
  },

  handicapValue: {
    type: Number,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
})
module.exports = mongoose.model('Classe', classeSchema)