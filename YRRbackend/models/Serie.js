const mongoose = require('mongoose')

const serieSchema = new mongoose.Schema({
  nom:  { type: String, required: true },
  date: { type: String, default: '' }
})

module.exports = mongoose.model('Serie', serieSchema)