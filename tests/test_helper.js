const bcrypt = require('bcryptjs')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const initialBlogs = [
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

const api = supertest(app)

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const getToken = async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('pass123', 10)
  const user = new User({ username: 'testJack', passwordHash })
  await user.save()

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'testJack', password: 'pass123' })

  return `Bearer ${loginResponse.body.token}`
}


module.exports = { initialBlogs, usersInDb, getToken }