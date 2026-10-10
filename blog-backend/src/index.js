
require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env'),
})

const express = require('express')
const sequelize = require('./database')

const Blog = require('./models/blog')
const User = require('./models/user')

const blogsRouter = require('./blogs')
const usersRouter = require('./users')
const loginRouter = require('./login')
const authorsRouter = require('./authors')
const resetRouter = require('./reset')

const app = express()

app.use(express.json())

// API routes
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/reset', resetRouter)

// Root endpoint: GET /
app.get('/', (request, response) => {
  response.status(200).send('Blog backend is running!')
})

// Error handling middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (
    error.name === 'SequelizeValidationError' ||
    error.name === 'SequelizeUniqueConstraintError'
  ) {
    return response.status(400).json({
      error: error.errors.map((item) => item.message),
    })
  }

  if (error.name === 'SequelizeDatabaseError') {
    return response.status(400).json({
      error: error.message,
    })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.TESTING === 'true' ? 3001 : 3000

const start = async () => {
  try {
    // Connect to the selected PostgreSQL database
    await sequelize.authenticate()
    console.log('Database connection successful')

    // Synchronize the users table
    await User.sync({ alter: true })
    console.log('User table synchronized')

    // Initialize the blogs table
    await Blog.initialize()
    console.log('Blog table initialized')

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Server startup failed:', error)
    process.exit(1)
  }
}

start()
