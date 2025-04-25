const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

const app = express()

logger.info('Connecting to: \n', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Successfully Connected to MongoDB')
  }).catch((error) => {
    logger.error('Connection to MongoDB Failed', error.message)
  })

app.use(morgan('dev'))
app.use(express.json())

app.use(middleware.tokenExtractor)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app