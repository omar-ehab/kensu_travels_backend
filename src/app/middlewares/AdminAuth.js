const JWT = require("jsonwebtoken");
const createError = require('http-errors');


const verifyAuthority = (req, res, next) => {
  if (!req.headers['authorization']) return next(createError.Unauthorized())
  const authHeader = req.headers['authorization']
  const bearerToken = authHeader.split(' ')
  const token = bearerToken[1]
  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      console.log(err)
      const message =
        err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
      return next(createError.Unauthorized(message))
    }
    console.log(payload);
    if(!payload.admin) {
      return next(createError.Forbidden('Forbidden from access this endpoint'));
    }
    delete payload.admin
    req.user = payload
    next()
  });
}

module.exports = {
  verifyAuthority
}