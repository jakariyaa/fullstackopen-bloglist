const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const blogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(blogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, 2)
})

test('property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  const isPropertyId = response.body.every(blog => Object.hasOwn(blog, 'id'))
  assert.strictEqual(isPropertyId, true)
})

test('a new blog post created by HTTP/POST', async () => {
  const blog = {
    title: 'Mastering Fullstack',
    author: 'Jakariya Abbas',
    url: 'https://jakariya.eu.org/',
    likes: 999
  }

  await api
    .post('/api/blogs')
    .send(blog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const newBlog = response.body[response.body.length - 1]
  delete newBlog.id
  assert.deepStrictEqual(newBlog, blog)
})

test('zero if the likes property is missing', async () => {
  const blog = {
    title: 'Mastering Fullstack',
    author: 'Jakariya Abbas',
    url: 'https://jakariya.eu.org/'
  }

  await api
    .post('/api/blogs')
    .send(blog)
    .expect(201)

  const response = await api.get('/api/blogs')
  const likes = response.body[response.body.length - 1].likes
  assert.strictEqual(likes, 0)
})

test('bad request when title or url missing', async () => {
  const blog = {
    author: 'Jakariya Abbas',
    likes: 999
  }

  const response = await api
    .post('/api/blogs')
    .send(blog)
    .expect(400)

  assert.strictEqual(response.status, 400)
})

test('delete of blog succeeds with status 204', async () => {
  let blogResponse = await api.get('/api/blogs')
  const blog = blogResponse.body[0]

  const response = await api
    .delete(`/api/blogs/${blog.id}`)
    .expect(204)

  blogResponse = await api.get('/api/blogs')

  assert.strictEqual(response.status, 204)
  assert(!blogResponse.body.includes(blog))
})

test('update of note with HTTP/PUT', async () => {
  let response = await api.get('/api/blogs')
  let blog = response.body[0]
  blog = {
    id: blog.id,
    title: 'Hello Testing Testing',
    author: 'Tester Chan',
    url: 'https://expert_node_tester.js/',
    likes: 9345987689213
  }

  await api
    .put(`/api/blogs/${blog.id}`)
    .send(blog)

  response = await api.get('/api/blogs')
  assert.deepStrictEqual(response.body[0], blog)
})


after(async () => {
  await mongoose.connection.close()
})

