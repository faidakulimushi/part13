const usersRouter = require('express').Router()
const User = require('./models/user')

// POST /api/users
// Add a new user
usersRouter.post('/', async (request, response) => {
  try {
    const { name, username } = request.body

    const user = await User.create({
      name,
      username,
    })

    response.status(201).json(user)
  } catch (error) {
    response.status(400).json({
      error: error.message,
    })
  }
})

// GET /api/users
// List all users
usersRouter.get('/', async (request, response) => {
  const users = await User.findAll()

  response.json(users)
})

// PUT /api/users/:username
// Change a user's name
usersRouter.put('/:username', async (request, response) => {
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

    response.json(user)
  } catch (error) {
    response.status(400).json({
      error: error.message,
    })
  }
})

// GET /api/users/:id
// Get one user by ID
usersRouter.get('/:id', async (request, response) => {
  const user = await User.findByPk(request.params.id)

  if (!user) {
    return response.status(404).json({
      error: 'User not found',
    })
  }

  response.json(user)
})

module.exports = usersRouter