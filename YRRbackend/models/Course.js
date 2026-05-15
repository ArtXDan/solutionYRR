// models/Course.js
const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  nom:   { type: String, required: true },
  lieu:  { type: String, default: '' },
  date:  { type: String, default: '' },
  serie: { type: String, default: '' }
})

module.exports = mongoose.model('Course', courseSchema)