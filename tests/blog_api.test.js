const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRlc3ROYW1lIiwiaWQiOiI2MWUyMWVmMWUxZGExNjk5NWMzNmQxYzIiLCJpYXQiOjE2NDIyMDkyMjJ9.LTJAMcu2Wfhrn92oqjvcoKbCao0wfVCqF5cM-Y0PunA'

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects
        .map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})
  
test('blog authors are retrieved correctly', async () => {
    const response = await api.get('/api/blogs')
    
    const authors = response.body.map(blog => blog.author)
    expect(authors).toContain('Edsger W. Dijkstra')
})

test('blogs have id instead of _id', async () => {
    const response = await api.get('/api/blogs')
    const keys = Object.keys(response.body[0])
    
    expect(keys).toContain('id')
})

// These don't work if there is more than one user in the DB. 
// Known mongoose-unique-validator bug, as yet unfixed (1/22)
test('POST saves blogs properly', async () => {
    const blog = {
        title: 'The Angry GM',
        author: 'Scott Rehm',
        url: 'https://theangrygm.com/',
    }

    await api
        .post('/api/blogs')
        .send(blog)
        .set('Authorization', `bearer ${token}`)
        .expect(201)
}, 100000)

test('if likes is missing, default to 0', async () => {
    const blog = {
        title: 'The Angry GM',
        author: 'Scott Rehm',
        url: 'https://theangrygm.com/',
    }
    
    await api
        .post('/api/blogs')
        .send(blog)
        .set('Authorization', `bearer ${token}`)
        .expect(201)

    const resultBlog = await helper.blogsInDb()

    expect(resultBlog[2].likes).toBe(0)
})

test('if title or url are missing, 400', async () => {
    const noURL = {
        title: 'The Angry GM',
        author: 'Scott Rehm',
        likes: 10
    }

    const noTitle = {
        author: 'Scott Rehm',
        url: 'https://theangrygm.com/',
        likes: 10
    }

    await api
        .post('/api/blogs')
        .send(noURL)
        .set('Authorization', `bearer ${token}`)
        .expect(400)
    
    await api
        .post('/api/blogs')
        .send(noTitle)
        .set('Authorization', `bearer ${token}`)
        .expect(400)
})

test('401 invalid token if token is bad', async () => {
    const blog = {
        title: 'The Angry GM',
        author: 'Scott Rehm',
        url: 'https://theangrygm.com/',
    }

    const result = 
    await api
        .post('/api/blogs')
        .send(blog)
        .set('Authorization', `bearer ${token.slice(0, -1)}`)
        .expect(401)
    
    expect(result.body.error).toContain('token')
}, 100000)

/* test('login', async () => {
    const user = {
        name: "Test Name",
        username: "TestName",
        password: "Password"
    }
    await api
        .post('/api/login')
        .send(user)
        .expect(response => console.log(response))
        .expect(200)
}) */

afterAll(() => {
    mongoose.connection.close()
})