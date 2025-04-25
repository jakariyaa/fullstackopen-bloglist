const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

describe('when initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('passwo', 10)
    const user = new User({ username: 'jack', passwordHash })
    await user.save()
  })

  test('creation succeeds with new username', async () => {
    const usersBefore = await helper.usersInDb()

    const newUser = {
      name: 'Xack Vai',
      username: 'Xack',
      password: 'test123',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await helper.usersInDb()

    assert.strictEqual(usersBefore.length + 1, usersAfter.length)
    assert.strictEqual(usersAfter[usersAfter.length - 1].username, newUser.username)
  })

  test('duplicate username fails with status code 400', async () => {
    const usersBefore = await helper.usersInDb()

    const newUser = {
      name: 'Jack',
      username: 'jack',
      password: 'test123'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await helper.usersInDb()

    assert.strictEqual(usersBefore.length, usersAfter.length)
    assert(response.body.error.includes('username must be unique'))
  })

  test('password less than 3 characters fails with proper error', async () => {
    const usersBefore = await helper.usersInDb()

    const newUser = {
      name: 'Xack',
      username: 'Xack',
      password: '12'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await helper.usersInDb()

    assert.strictEqual(usersBefore.length, usersAfter.length)
    assert(response.body.error.includes('Password must be at least 3 characters long'))
  })
})

after(async () => {
  await mongoose.connection.close()
})