
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

const app = express()

app.use(express.json())

// Routes
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.get('/', (request, response) => {
  response.send('Blog backend is running!')
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

const PORT = 3000

const start = async () => {
  try {
    // Connect to PostgreSQL
    await sequelize.authenticate()
    console.log('Database connection successful')

    // Create or update the Sequelize User table
    await User.sync({ alter: true })
    console.log('User table synchronized')

    // Create the blogs table and ownership columns
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
