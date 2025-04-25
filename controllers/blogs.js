const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const { user } = request
  if (!user) {
    return response.status(401).json({ error: 'invalid token' })
  }
  const blog = new Blog({
    ...request.body,
    user: user.id
  })
  try {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()
    const result = await savedBlog.populate('user', { username: 1, name: 1 })
    response.status(201).json(result)
  } catch (error) {
    response.status(400).json({
      bad_request: 'title or url is missing',
      error: error.message
    })
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'invalid token' })
  }
  const blogId = request.params.id
  const blog = await Blog.findById(blogId)

  if (!blog) {
    return response.status(404).end()
  } else if (blog.user.toString() !== request.user.id) {
    return response.status(401).json({ error: 'unauthorized action' })
  }

  await Blog.findByIdAndDelete(blogId)
  response.status(204).end()
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