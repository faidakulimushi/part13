const readinglistsRouter = require('express').Router()
const sequelize = require('./database')
const { QueryTypes } = require('sequelize')
const User = require('./models/user')
const Blog = require('./models/blog')
const { userExtractor } = require('./middleware')

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
      return response.status(404).json({ error: 'User not found' })
    }

    const blog = await Blog.findByPk(blogId)
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' })
    }

    const rows = await sequelize.query(
      `INSERT INTO reading_lists (user_id, blog_id)
       VALUES (:userId, :blogId)
       RETURNING id, user_id, blog_id, read`,
      {
        replacements: { userId, blogId },
        type: QueryTypes.SELECT,
      }
    )

    return response.status(201).json(rows[0])
  } catch (error) {
    if (
      error.name === 'SequelizeUniqueConstraintError' ||
      error.parent?.code === '23505'
    ) {
      return response.status(400).json({
        error: 'Blog is already in this reading list',
      })
    }

    return next(error)
  }
})

// PUT /api/readinglists/:id
readinglistsRouter.put('/:id', userExtractor, async (request, response, next) => {
  try {
    const id = Number(request.params.id)

    if (!Number.isInteger(id) || id < 1) {
      return response.status(404).json({
        error: 'Reading-list entry not found',
      })
    }

    const entries = await sequelize.query(
      `SELECT id, user_id, blog_id, read
       FROM reading_lists
       WHERE id = :id`,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    )

    if (entries.length === 0) {
      return response.status(404).json({
        error: 'Reading-list entry not found',
      })
    }

    const entry = entries[0]

    if (Number(entry.user_id) !== Number(request.user.id)) {
      return response.status(401).json({
        error: 'You cannot update another user reading list',
      })
    }

    if (typeof request.body.read !== 'boolean') {
      return response.status(400).json({
        error: 'read must be a boolean',
      })
    }

    const updated = await sequelize.query(
      `UPDATE reading_lists
       SET read = :read, updated_at = CURRENT_TIMESTAMP
       WHERE id = :id
       RETURNING id, user_id, blog_id, read`,
      {
        replacements: { id, read: request.body.read },
        type: QueryTypes.SELECT,
      }
    )

    return response.status(200).json(updated[0])
  } catch (error) {
    return next(error)
  }
})

module.exports = readinglistsRouter
