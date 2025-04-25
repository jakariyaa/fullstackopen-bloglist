const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')


const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
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

describe('create new blog post', () => {
  test('succeeds with valid token', async () => {
    const blog = {
      title: 'Mastering Fullstack',
      author: 'Jakariya Abbas',
      url: 'https://jakariya.eu.org/',
      likes: 999
    }

    const token = await helper.getToken()
    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const newBlog = response.body[response.body.length - 1]
    delete newBlog.id
    delete newBlog.user
    assert.deepStrictEqual(newBlog, blog)
  })
  test('fails without valid token', async () => {
    const blogsBefore = await api.get('/api/blogs')
    const blog = {
      title: 'Mastering Fullstack',
      author: 'Jakariya Abbas',
      url: 'https://jakariya.eu.org/',
      likes: 999
    }

    const response = await api
      .post('/api/blogs')
      .send(blog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await api.get('/api/blogs')
    assert.strictEqual(blogsBefore.length, blogsAfter.length)
    assert(response.body.error.includes('invalid token'))
  })
})

test('likes property is zero if missing', async () => {
  const blog = {
    title: 'Mastering Fullstack',
    author: 'Jakariya Abbas',
    url: 'https://jakariya.eu.org/'
  }

  const token = await helper.getToken()
  await api
    .post('/api/blogs')
    .set('Authorization', token)
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

  const token = await helper.getToken()
  const response = await api
    .post('/api/blogs')
    .set('Authorization', token)
    .send(blog)
    .expect(400)

  assert.strictEqual(response.status, 400)
})

test('delete of blog succeeds with status 204', async () => {
  let blogResponse = await api.get('/api/blogs')
  const blog = blogResponse.body[0]

  const token = await helper.getToken()
  const response = await api
    .delete(`/api/blogs/${blog.id}`)
    .set('Authorization', token)
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
