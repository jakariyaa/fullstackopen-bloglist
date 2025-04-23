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

after(async () => {
  await mongoose.connection.close()
})