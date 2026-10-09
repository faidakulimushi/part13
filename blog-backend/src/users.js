
const usersRouter = require('express').Router()
const User = require('./models/user')

// POST /api/users
usersRouter.post('/', async (request, response, next) => {
  try {
    const { name, username } = request.body

    const user = await User.create({
      name,
      username,
    })

    response.status(201).json(user)
  } catch (error) {
    next(error)
  }
})

// GET /api/users
usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.findAll()
    response.json(users)
  } catch (error) {
    next(error)
  }
})

// PUT /api/users/:username
usersRouter.put('/:username', async (request, response, next) => {
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
    next(error)
  }
})

// GET /api/users/:id
usersRouter.get('/:id', async (request, response, next) => {
  try {
    const user = await User.findByPk(request.params.id)

    if (!user) {
      return response.status(404).json({
        error: 'User not found',
      })
    }

    response.json(user)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter