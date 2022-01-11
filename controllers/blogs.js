const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})
  
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
  })

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)

})

blogsRouter.delete('/:id', async (request, response) => {
  const result = await Blog.findByIdAndDelete(request.params.id)
  if (result) {
    response.statusMessage = 'data successfully deleted'
    response.status(202).end()
  } else {
    response.statusMessage = 'blog not found'
    response.status(404).end()
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