
const usersRouter = require('express').Router()

const User = require('./models/user')
const Blog = require('./models/blog')

// POST /api/users
usersRouter.post('/', async (request, response, next) => {
  try {
    const { name, username, password } = request.body

    const user = await User.create({
      name,
      username,
      password,
    })

    const userData = user.toJSON()
    delete userData.password

    response.status(201).json(userData)
  } catch (error) {
    next(error)
  }
})

// GET /api/users
// Return all users with the blogs they have added
usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['id', 'ASC']],
    })

    const blogs = await Blog.findAll()

    const usersWithBlogs = users.map((user) => {
      const userData = user.toJSON()

      return {
        ...userData,
        blogs: blogs.filter((blog) => blog.userId === user.id),
      }
    })

    response.json(usersWithBlogs)
  } catch (error) {
    next(error)
  }
})

// PUT /api/users/:username
usersRouter.put('/:username', async (request, response, next) => {
  try {
    const user = await User.findOne({
      where: {
        username: request.params.username,
      },
    })

    if (!user) {
      return response.status(404).json({
        error: 'User not found',
      })
    }

    user.name = request.body.name
    await user.save()

    const userData = user.toJSON()
    delete userData.password

    response.json(userData)
  } catch (error) {
    next(error)
  }
})

// GET /api/users/:id
// Return one user with their blogs
usersRouter.get('/:id', async (request, response, next) => {
  try {
    const user = await User.findByPk(request.params.id, {
      attributes: { exclude: ['password'] },
    })

    if (!user) {
      return response.status(404).json({
        error: 'User not found',
      })
    }

    const blogs = await Blog.findAll()
    const userData = user.toJSON()

    const userWithBlogs = {
      ...userData,
      blogs: blogs.filter((blog) => blog.userId === user.id),
    }

    response.json(userWithBlogs)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter
