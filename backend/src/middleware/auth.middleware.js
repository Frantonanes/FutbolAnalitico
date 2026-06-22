const jwt = require('jsonwebtoken')

function requireAuth(req, res, next) {
  const authorization = req.headers.authorization

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Token requerido'
    })
  }

  const token = authorization.slice('Bearer '.length).trim()

  if (!token) {
    return res.status(401).json({
      message: 'Token requerido'
    })
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch (error) {
    return res.status(401).json({
      message: 'Token inválido'
    })
  }
}

module.exports = requireAuth
