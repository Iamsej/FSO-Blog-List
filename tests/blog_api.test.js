const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')


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

test('POST saves blogs properly', async () => {
    const blog = new Blog({
        title: 'The Angry GM',
        author: 'Scott Rehm',
        url: 'https://theangrygm.com/',
    })
    await api
        .post('/api/blogs')
        .send(blog)
        .expect(201)
})

test('if likes is missing, default to 0', async () => {
    const blog = new Blog({
        title: 'The Angry GM',
        author: 'Scott Rehm',
        url: 'https://theangrygm.com/',
    })
    
    await api
        .post('/api/blogs')
        .send(blog)
        .expect(201)

    const resultBlog = await helper.blogsInDb()

    expect(resultBlog[0].likes).toBe(0)
})

test('if title or url are missing, 400', async () => {
    const noURL = new Blog({
        title: 'The Angry GM',
        author: 'Scott Rehm',
        likes: 10
    })

    const noTitle =new Blog({
        author: 'Scott Rehm',
        url: 'https://theangrygm.com/',
        likes: 10
    })

    await api
        .post('/api/blogs')
        .send(noURL)
        .expect(400)
    
    await api
        .post('/api/blogs')
        .send(noTitle)
        .expect(400)
})

afterAll(() => {
    mongoose.connection.close()
})