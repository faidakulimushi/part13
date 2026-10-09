
require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env'),
})

const express = require('express')
const sequelize = require('./database')
const blogsRouter = require('./blogs')
const usersRouter = require('./users')

const app = express()

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.get('/', (request, response) => {
  response.send('Blog backend is running!')
})

// Error handling middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError') {
    return response.status(400).json({ error: error.message })
  }

  if (error.name === 'SequelizeDatabaseError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = 3000

const start = async () => {
  try {
    await sequelize.authenticate()
    console.log('Database connection successful')

    await sequelize.sync()
console.log('Database tables synchronized')

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Database connection failed:', error.message)
    process.exit(1)
  }
}

start()