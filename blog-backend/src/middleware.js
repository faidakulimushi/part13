
const jwt = require('jsonwebtoken')
const User = require('./models/user')

const userExtractor = async (request, response, next) => {
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

    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({
        error: 'token invalid',
      })
    }

    const user = await User.findByPk(decodedToken.id)

    if (!user) {
      return response.status(401).json({
        error: 'user not found',
      })
    }

    request.user = user
    next()
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError' ||
      error.name === 'NotBeforeError'
    ) {
      return response.status(401).json({
        error: 'token invalid',
      })
    }

    next(error)
  }
}

module.exports = { userExtractor }
