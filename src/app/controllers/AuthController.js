const User = require('../models/User');
const createError = require('http-errors');
const {
  signVerificationToken,
  verifyVerificationToken,
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken
} = require('../../helpers/jwt_helper');


class AuthController{

  login = async (req, res, next) => {
    res.send("login");
  }

  register = async (req, res, next) => {
    try {
      const userExists = await User.exists({email: req.body.email});
      if(!userExists) {
        const user = await User.create(req.body);
        const reducedUser = {
          id: user._id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
        }
        //creating verification token
        const verification_token = await signVerificationToken(reducedUser);
        //sending verification email here

        //creating access and refresh tokens
        const access_token = await signAccessToken(reducedUser);
        const refresh_token = await signRefreshToken(reducedUser);
        res.json({access_token, token_type: "Bearer", refresh_token, user: reducedUser});
      } else {
        res.status(400).json({
          success: false,
          message: {
            errors: [{
              value: req.body.email,
              msg: "this email already used",
              param: "email",
            }]
          }
        })
      }
    } catch(err){
      return;
    }
  }

  refreshToken = async (req, res, next) => {

  }

  logout = async (req, res, next) => {

  }
}

module.exports = AuthController;