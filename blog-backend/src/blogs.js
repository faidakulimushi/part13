const express = require('express')
const router = express.Router()
const sequelize = require('./database')
const { QueryTypes } = require('sequelize')

router.get('/', async (request, response) => {
  const blogs = await sequelize.query(
    'SELECT * FROM blogs',
    { type: QueryTypes.SELECT }
  )

  response.json(blogs)
})

router.post('/', async (request, response) => {
  const { author, url, title, likes } = request.body

  const result = await sequelize.query(
    `INSERT INTO blogs (author, url, title, likes)
     VALUES (:author, :url, :title, :likes)
     RETURNING *`,
    {
      replacements: {
        author,
        url,
        title,
        likes: likes ?? 0
      },
      type: QueryTypes.INSERT
    }
  )

  response.status(201).json(result[0][0])
})

router.delete('/:id', async (request, response) => {
  const { id } = request.params

  const result = await sequelize.query(
    'DELETE FROM blogs WHERE id = :id RETURNING *',
    {
      replacements: { id },
      type: QueryTypes.SELECT
    }
  )

  if (result.length === 0) {
    return response.status(404).end()
  }

  response.status(204).end()
})

module.exports = router