const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')

const app = express()

logger.info('Connecting to: \n', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Successfully Connected to MongoDB')
  }).catch((error) => {
    logger.error('Connection to MongoDB Failed', error.message)
  })


app.use(express.json())
app.use('/api/blogs', blogsRouter)


module.exports = app