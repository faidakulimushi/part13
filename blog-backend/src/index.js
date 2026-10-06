const express = require('express')
const sequelize = require('./database')
const blogsRouter = require('./blogs')

const app = express()

app.use(express.json())

app.use('/api/blogs', blogsRouter)

app.get('/', (request, response) => {
  response.send('Blog backend is running!')
})

const PORT = 3000

const start = async () => {
  try {
    await sequelize.authenticate()
    console.log('Database connection successful')

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Database connection failed:', error)
  }
}

start()