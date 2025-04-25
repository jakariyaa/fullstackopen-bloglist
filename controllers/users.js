const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')


usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blog')
  response.json(users)
})

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  if (!password || password.length < 3) {
    return response.status(400).json({
      error: 'Password must be at least 3 characters long'
    })
  }

  const blog = await Blog.findOne()

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    blog: [blog.id],
    passwordHash,
  })

  try {
    const result = await (await user.save()).populate('blog')
    response.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter

