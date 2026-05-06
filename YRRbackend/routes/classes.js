const express = require('express')
const router = express.Router()
const Classe = require('../models/Classe')

router.get('/', async (req, res) => {
  try {
    const classes = await Classe.find()
    res.json(classes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const classe = new Classe(req.body)
    await classe.save()
    res.json(classe)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Classe.findByIdAndDelete(req.params.id)
    res.json({ message: 'Classe supprimée' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router