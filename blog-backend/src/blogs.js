const express = require('express')
const router = express.Router()
const Blog = require('./models/blog')

const blogFinder = async (request, response, next) => {
  try {
    request.blog = await Blog.findByPk(request.params.id)

    if (!request.blog) {
      return response.status(404).end()
    }

    next()
  } catch (error) {
    next(error)
  }
}

router.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.findAll()
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (request, response, next) => {
  try {
    const blog = await Blog.create(request.body)
    response.status(201).json(blog)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', blogFinder, async (request, response) => {
  response.json(request.blog)
})

router.put('/:id', blogFinder, async (request, response, next) => {
  try {
    const updatedBlog = await Blog.updateLikes(
      request.params.id,
      request.body.likes
    )

    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', blogFinder, async (request, response, next) => {
  try {
    await Blog.destroy(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router