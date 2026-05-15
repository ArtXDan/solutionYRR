// routes/series.js
const express = require('express')
const router = express.Router()
const Serie = require('../models/Serie')

router.get('/', async (req, res) => {
  try {
    res.json(await Serie.find())
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const serie = new Serie(req.body)
    await serie.save()
    res.json(serie)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const serie = await Serie.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(serie)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Serie.findByIdAndDelete(req.params.id)
    res.json({ message: 'deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router