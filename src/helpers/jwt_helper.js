const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const redisClient = require('./init_redis.js');



const signVerificationToken = (payload = {}) => {
  return new Promise((resolve, reject) => {
    const secret = process.env.VERIFICATION_TOKEN_SECRET
    const options = {
      expiresIn: '1h',
      issuer: 'kensu',
    }
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject("error while assigning verficiation token");
        return
      }
      resolve(token)
    })
  })
}

const verifyVerificationToken = (token) => {
  JWT.verify(token, process.env.VERIFICATION_TOKEN_SECRET, (err, payload) => {
    if (err) {
      return false
    }
    return payload
  })
}

const signAccessToken = (payload = {}, expiresIn = '10m') => {
  return new Promise((resolve, reject) => {
    const secret = process.env.ACCESS_TOKEN_SECRET
    const options = {
      expiresIn,
      issuer: 'kensu',
    }
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject("error while assigning access token");
        return
      }
      resolve(token)
    })
  })
}
  
const verifyAccessToken = (req, res, next) => {
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
    req.user = payload
    next()
  })
}
  
const signRefreshToken = (payload = {}, expiresIn = '1d') => {
  return new Promise((resolve, reject) => {
    const secret = process.env.REFRESH_TOKEN_SECRET
    const options = {
      expiresIn,
      issuer: 'kensu',
    }
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject("error while assigning refresh token");
        return;
      }
      redisClient.SET(`kensu_refresh_${payload._id}`, token, 'EX', 14 * 24 * 60 * 60, (err, reply) => {
        if (err) {
          console.log(err)
          reject(createError.InternalServerError())
          return
        }
        resolve(token)
      })
    })
  })
}

const verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    JWT.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, payload) => {
        if (err) {
          return reject(createError.Unauthorized())
        }
        redisClient.GET(`kensu_refresh_${payload._id}`, (err, result) => {
          if (err) {
            console.log(err.message);
            reject("error while verfing refresh token");
            return
          }
          if (refreshToken === result) { 
            return resolve({id: payload._id})
          }
          reject(createError.Unauthorized());
        });
      }
    )
  });
}

module.exports = {
  signVerificationToken,
  verifyVerificationToken,
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken
}
