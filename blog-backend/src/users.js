
const usersRouter = require('express').Router()

const User = require('./models/user')
const Blog = require('./models/blog')
const sequelize = require('./database')
const { QueryTypes } = require('sequelize')

// POST /api/users
// Create a new user
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
// Return all users with their blogs
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
// Update a user's name
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
// Return one user with their blogs and reading list
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

    // Get blogs added by this user
    const blogs = await Blog.findAll()

    const userBlogs = blogs.filter(
      (blog) => blog.userId === user.id
    )

    // Get reading-list blogs and their reading-list row details
    const readings = await sequelize.query(
      `SELECT
         b.id,
         b.url,
         b.title,
         b.author,
         b.likes,
         b.year,
         rl.id AS reading_list_id,
         rl.read AS reading_list_read
       FROM blogs b
       JOIN reading_lists rl ON rl.blog_id = b.id
       WHERE rl.user_id = :userId
       ORDER BY rl.id ASC`,
      {
        replacements: { userId: user.id },
        type: QueryTypes.SELECT,
      }
    )

    // Include read status and reading-list row ID
    const readingsWithReadingList = readings.map((blog) => ({
      id: blog.id,
      url: blog.url,
      title: blog.title,
      author: blog.author,
      likes: blog.likes,
      year: blog.year,
      reading_list: {
        read: blog.reading_list_read,
        id: blog.reading_list_id,
      },
    }))

    const userData = user.toJSON()

    response.json({
      ...userData,
      blogs: userBlogs,
      readings: readingsWithReadingList,
    })
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter