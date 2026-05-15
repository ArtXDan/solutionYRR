// models/Bateau.js
const mongoose = require('mongoose')

const bateauSchema = new mongoose.Schema({
  nom:           { type: String, required: true },
  type:          { type: String, default: 'indéfini' },
  skippers:      { type: String, default: '' },
  numeroVoile:   { type: String, default: '' },
  serie:         { type: String, default: '' },
  createdAt:     { type: Date, default: Date.now }
})

module.exports = mongoose.model('Bateau', bateauSchema)