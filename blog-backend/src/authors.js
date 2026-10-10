
const express = require('express')
const router = express.Router()

const sequelize = require('./database')
const { QueryTypes } = require('sequelize')

// GET /api/authors
// Return each author's blog count and total likes
router.get('/', async (request, response, next) => {
  try {
    const authors = await sequelize.query(
      `SELECT
         author,
         COUNT(*)::text AS blogs,
         COALESCE(SUM(likes), 0)::text AS likes
       FROM blogs
       GROUP BY author
       ORDER BY SUM(likes) DESC NULLS LAST, author ASC`,
      {
        type: QueryTypes.SELECT,
      }
    )

    response.json(authors)
  } catch (error) {
    next(error)
  }
})

module.exports = router
