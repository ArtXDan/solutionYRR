const express = require('express')
const router = express.Router()
const Bateau = require('../models/Bateau')

router.get('/', async (req, res) => {
  try {
    const bateaux = await Bateau.find()
    res.json(bateaux)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const bateau = new Bateau(req.body)
    await bateau.save()
    res.json(bateau)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Bateau.findByIdAndDelete(req.params.id)
    res.json({ message: 'Bateau supprimé' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router