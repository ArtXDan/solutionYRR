const express = require('express')
const router = express.Router()
const Resultat = require('../models/Resultat')

router.get('/', async (req, res) => {
  try {
    const filter = req.query.serieId ? { serieId: req.query.serieId } : {}
    res.json(await Resultat.find(filter))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    console.log('BODY:', req.body)

    const resultat = new Resultat(req.body)
    await resultat.save()

    res.json(resultat)

  } catch (err) {
    console.error('POST ERROR:', err.message)

    res.status(500).json({
      error: err.message
    })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const r = await Resultat.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(r)
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