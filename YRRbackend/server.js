const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
  console.log(req.method, req.url)
  next()
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err))

const bateauxRoutes = require('./routes/bateaux')
app.use('/api/bateaux', bateauxRoutes)

const classesRoutes = require('./routes/classes')
app.use('/api/classes', classesRoutes)

const resultatsRoutes = require('./routes/resultats')
app.use('/api/resultats', resultatsRoutes)

app.get('/', (req, res) => {
  res.send('Backend is running')
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})