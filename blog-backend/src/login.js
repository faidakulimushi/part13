const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('./models/user')
const Session = require('./models/session')

loginRouter.post('/', async (request, response, next) => {
  try {
    const { username, password } = request.body

    const user = await User.findOne({
      where: { username },
    })

    const passwordCorrect =
      user && typeof password === 'string' && user.password === password

    if (!user || !passwordCorrect) {
      return response.status(401).json({
        error: 'invalid username or password',
      })
    }

    if (user.disabled) {
      return response.status(403).json({
        error: 'account is disabled',
      })
    }

    const userForToken = {
      username: user.username,
      id: user.id,
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    await Session.create({
      token,
      userId: user.id,
    })

    return response.status(200).json({
      token,
      username: user.username,
      name: user.name,
    })
  } catch (error) {
    next(error)
  }
})

module.exports = loginRouter
