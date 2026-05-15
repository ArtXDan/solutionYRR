const express = require('express')
const router = express.Router()
const Course = require('../models/Course')

router.get('/', async (req, res) => {
  try {
    res.json(await Course.find())
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const course = new Course(req.body)
    await course.save()
    res.json(course)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(course)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id)
    res.json({ message: 'deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router