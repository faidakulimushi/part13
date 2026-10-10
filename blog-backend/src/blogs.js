
const express = require('express')
const router = express.Router()

const Blog = require('./models/blog')
const User = require('./models/user')
const { userExtractor } = require('./middleware')

// Find a blog by ID
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

// Add the user who created a blog
const addUserToBlog = async (blog) => {
  if (!blog.userId) {
    return { ...blog, user: null }
  }

  const user = await User.findByPk(blog.userId)

  return {
    ...blog,
    user: user
      ? {
          id: user.id,
          username: user.username,
          name: user.name,
        }
      : null,
  }
}

// GET /api/blogs
// Return all blogs with the user who added each blog
router.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.findAll()
    const blogsWithUsers = await Promise.all(
      blogs.map((blog) => addUserToBlog(blog))
    )

    response.json(blogsWithUsers)
  } catch (error) {
    next(error)
  }
})

// POST /api/blogs
// Only logged-in users can create blogs
router.post('/', userExtractor, async (request, response, next) => {
  try {
    const blog = await Blog.create({
      ...request.body,
      userId: request.user.id,
    })

    const blogWithUser = await addUserToBlog(blog)

    response.status(201).json(blogWithUser)
  } catch (error) {
    next(error)
  }
})

// GET /api/blogs/:id
router.get('/:id', blogFinder, async (request, response, next) => {
  try {
    const blog = await addUserToBlog(request.blog)

    response.json(blog)
  } catch (error) {
    next(error)
  }
})

// PUT /api/blogs/:id
router.put('/:id', blogFinder, async (request, response, next) => {
  try {
    const updatedBlog = await Blog.updateLikes(
      request.params.id,
      request.body.likes
    )

    if (!updatedBlog) {
      return response.status(404).end()
    }

    const blogWithUser = await addUserToBlog(updatedBlog)

    response.json(blogWithUser)
  } catch (error) {
    next(error)
  }
})

// DELETE /api/blogs/:id
router.delete('/:id', blogFinder, async (request, response, next) => {
  try {
    await Blog.destroy(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router
