const Admin = require("../../models/Admin");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} = require("../../../helpers/jwt_helper");
const redisClient = require("../../../helpers/init_redis.js");
const _ = require('lodash');

class AuthController {
  login = async (req, res, next) => {
    try {
      let admin = await Admin.findOne({ email: req.body.email });
      if (admin && !admin.is_blocked) {
        admin.comparePassword(req.body.password, async (err, isMatched) => {
          if (err) {
            throw err;
          }
          admin = this.cleanedAdminObj(admin);
          if (isMatched) {
            const refreshExp = req.body.rememberMe ? "14d" : "1d";
            const accessToken = await signAccessToken(admin, "1m");
            const refreshToken = await signRefreshToken(admin, refreshExp);
            const expiresAfterInMs = 14 * 24 * 60 * 60 * 1000; // 14 days
            const cookieOptions = {
              expires: new Date(Date.now() + expiresAfterInMs),
              httpOnly: true,
              secure: true,
              sameSite: "none",
            };
            res.cookie("refreshToken", refreshToken, cookieOptions);
            res.json({ accessToken, user: admin });
          } else {
            res.status(401).json({ message: "incorrect email or password" });
          }
        });
      } else {
        res.status(401).json({ message: "incorrect email or password" });
      }
    } catch (e) {
      return next(e);
    }
  };

  logout = async (req, res, next) => {
    redisClient.DEL(`kensu_refresh_${req.user._id}`);

    const expiresAfterInMs = 14 * 24 * 60 * 60 * 1000; // 14 days
    const cookieOptions = {
      expires: new Date(Date.now() - expiresAfterInMs),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };
    res.cookie("refreshToken", "", cookieOptions);
    return res.sendStatus(200);
  };

  refresh = async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies;
      const { id } = await verifyRefreshToken(refreshToken);
      const result = await Admin.findOne({ _id: id });
      const admin = this.cleanedAdminObj(result);
      const accessToken = await signAccessToken(admin, "5m");
      return res.json({ accessToken });
    } catch (e) {
      return next(e);
    }
  };

  cleanedAdminObj = (admin) => {
    let result = _.omit(admin._doc, ["password", "created_at", "updated_at", "__v", ""]);
    let newAdmin = result;
    newAdmin.displayName = `${result.first_name} ${result.last_name}`;
    newAdmin.admin = true;
    return _.omit(newAdmin, ["first_name", "last_name"]);
  };
}

module.exports = AuthController;
