const logoutRouter = require('express').Router()
const Session = require('./models/session')

logoutRouter.delete('/', async (request, response, next) => {
  try {
    const authorization = request.get('authorization')

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return response.status(401).json({
        error: 'token missing',
      })
    }

    const token = authorization.substring(7).trim()

    if (!token) {
      return response.status(401).json({
        error: 'token missing',
      })
    }

    const deleted = await Session.destroy({
      where: { token },
    })

    if (deleted === 0) {
      return response.status(401).json({
        error: 'session not found or already logged out',
      })
    }

    return response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = logoutRouter
