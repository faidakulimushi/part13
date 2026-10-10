
const express = require('express')
const router = express.Router()

const sequelize = require('./database')

router.post('/', async (request, response, next) => {
  try {
    await sequelize.query(
      'TRUNCATE TABLE blogs, users RESTART IDENTITY CASCADE'
    )

    response.status(200).json({
      message: 'Database tables reset successfully',
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
