
const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('./models/user')

loginRouter.post('/', async (request, response, next) => {
  try {
    const { username, password } = request.body

    const user = await User.findOne({
      where: { username },
    })

    // For this exercise, all users use the password "secret"
    const passwordCorrect = password === 'secret'

    if (!user || !passwordCorrect) {
      return response.status(401).json({
        error: 'invalid username or password',
      })
    }

    const userForToken = {
      username: user.username,
      id: user.id,
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    response.status(200).json({
      token,
      username: user.username,
      name: user.name,
    })
  } catch (error) {
    next(error)
  }
})

module.exports = loginRouter