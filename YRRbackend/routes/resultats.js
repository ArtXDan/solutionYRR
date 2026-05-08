const express = require('express')
const router = express.Router()
const Resultat = require('../models/Resultat')

router.get('/', async (req, res) => {
  try {
    const resultats = await Resultat.find()
    res.json(resultats)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const resultat = new Resultat(req.body)
    await resultat.save()
    res.json(resultat)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Resultat.findByIdAndDelete(req.params.id)
    res.json({ message: 'deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router