const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  const blog = new Blog({
    ...request.body,
    user: user.id
  })
  try {
    const result = await (await blog.save()).populate('user')
    response.status(201).json(result)
  } catch (error) {
    response.status(400).json({
      bad_request: 'title or url is missing',
      error: error.message
    })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)
  const blogId = request.params.id
  const blog = await Blog.findById(blogId)

  if (blog.user.toString() !== user.id /*.toString() */) {
    return response.status(401).json({ error: 'unauthorized action' })
  }

  const result = await Blog.findByIdAndDelete(blogId)
  response.status(204).json(result)
})

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  try {
    const result = await Blog.findByIdAndUpdate(id, request.body, { new: true })
    result ? response.json(result) : response.status(404).end()
  } catch (error) {
    response.status(400).json({
      bad_request: 'title or url is missing',
      error: error.message
    })
  }
})


module.exports = blogsRouter