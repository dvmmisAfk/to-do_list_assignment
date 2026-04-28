require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const taskRoutes = require('./src/routes/taskRoutes')
const errorHandler = require('./src/middleware/errorHandler')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/tasks', taskRoutes)

app.use(errorHandler)

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to mongodb')
    app.listen(process.env.PORT || 5000, () => {
      console.log('server running on port', process.env.PORT || 5000)
    })
  })
  .catch(err => {
    console.log('mongodb connection failed:', err.message)
  })
