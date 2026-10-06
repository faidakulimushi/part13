const express = require('express')
const router = express.Router()
const Blog = require('./models/blog')

const blogFinder = async (request, response, next) => {
  request.blog = await Blog.findByPk(request.params.id)

  if (!request.blog) {
    return response.status(404).end()
  }

  next()
}

router.get('/', async (request, response) => {
  const blogs = await Blog.findAll()
  response.json(blogs)
})

router.post('/', async (request, response) => {
  const blog = await Blog.create(request.body)
  response.status(201).json(blog)
})

router.get('/:id', blogFinder, async (request, response) => {
  response.json(request.blog)
})

router.put('/:id', blogFinder, async (request, response) => {
  const updatedBlog = await Blog.updateLikes(
    request.params.id,
    request.body.likes
  )

  response.json(updatedBlog)
})

router.delete('/:id', blogFinder, async (request, response) => {
  await Blog.destroy(request.params.id)
  response.status(204).end()
})

module.exports = router