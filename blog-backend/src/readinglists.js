const readinglistsRouter = require('express').Router()
const sequelize = require('./database')
const { QueryTypes } = require('sequelize')
const User = require('./models/user')
const Blog = require('./models/blog')

// POST /api/readinglists
readinglistsRouter.post('/', async (request, response, next) => {
  try {
    const { blogId, userId } = request.body

    if (!Number.isInteger(blogId) || blogId < 1) {
      return response.status(400).json({
        error: 'blogId must be a positive integer',
      })
    }

    if (!Number.isInteger(userId) || userId < 1) {
      return response.status(400).json({
        error: 'userId must be a positive integer',
      })
    }

    const user = await User.findByPk(userId)

    if (!user) {
      return response.status(400).json({
        error: 'User not found',
      })
    }

    const blog = await Blog.findByPk(blogId)

    if (!blog) {
      return response.status(400).json({
        error: 'Blog not found',
      })
    }

    const reading = await sequelize.query(
      `INSERT INTO reading_lists (user_id, blog_id)
       VALUES (:userId, :blogId)
       RETURNING id, user_id AS "userId",
                 blog_id AS "blogId", read`,
      {
        replacements: { userId, blogId },
        type: QueryTypes.INSERT,
      }
    )

    response.status(201).json(reading[0][0])
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return response.status(400).json({
        error: 'Blog is already in this reading list',
      })
    }

    if (error.parent?.code === '23505') {
      return response.status(400).json({
        error: 'Blog is already in this reading list',
      })
    }

    next(error)
  }
})

module.exports = readinglistsRouter