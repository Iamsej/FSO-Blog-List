const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
require('jsonwebtoken')
const userAndToken = require('../utils/middleware').tokenAndUserExtractor

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})



blogsRouter.post('/', userAndToken, async (request, response) => {
  const body = request.body
  const user = request.user

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

blogsRouter.delete('/:id', userAndToken, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    response.statusMessage = 'blog not found'
    response.status(404).end()
  }

  const user = request.user

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