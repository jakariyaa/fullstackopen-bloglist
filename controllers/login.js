const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  if (!user) {
    return response.status(401).json({ error: 'username not found' })
  }

  const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
  if (!passwordCorrect) {
    return response.status(401).json({ error: 'incorrect password' })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .json({ token, username: user.username, name: user.name })

})

module.exports = loginRouter