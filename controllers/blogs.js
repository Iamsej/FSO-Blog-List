const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})



blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  
  response.status(201).json(savedBlog)

})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    response.statusMessage = 'blog not found'
    response.status(404).end()
  }

  const user = await User.findById(decodedToken.id)

  if (blog.user.toString() === user._id.toString()) {
    const result = await Blog.findByIdAndDelete(blog._id)
      if (!result) {
        response.statusMessage = 'blog not found'
        response.status(404)
      } else {
        response.statusMessage = 'deletion successful'
        response.status(202).end()
      }
  }

})

blogsRouter.patch('/:id', async (request, response) => {
  const newLikes = request.body.likes
  const result = await Blog
    .findByIdAndUpdate(
      request.params.id, 
      { likes: newLikes }, 
      { runValidators: true, context: 'query', new:true }
    )
  
  if (!result) {
    response.statusMessage = 'blog not found'
    response.status(404).end()
  } else {
    response.status(202).json(result)
  }
})

module.exports = blogsRouter