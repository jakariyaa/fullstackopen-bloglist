const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  try {
    const result = await blog.save()
    response.status(201).json(result)
  } catch (error) {
    response.status(400).json({
      bad_request: 'title or url is missing',
      error: error.message
    })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  const result = await Blog.findByIdAndDelete(id)
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