const Admin = require("../../models/Admin");
const {
  signAccessToken,
  signRefreshToken,
} = require("../../../helpers/jwt_helper");
const redisClient = require("../../../helpers/init_redis.js");

class AuthController {
  login = async (req, res, next) => {
    try {
      const admin = await Admin.findOne({ email: req.body.email });
      if (admin && !admin.is_blocked) {
        admin.comparePassword(req.body.password, async (err, isMatched) => {
          if (err) {
            throw err;
          }
          this.cleanAdminObj(admin);
          if (isMatched) {
            const accessToken = await signAccessToken(admin._doc, "1d");
            const refreshToken = await signRefreshToken(admin._doc);
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
    return res.json({ success: true, message: "logged out successfully" });
  };

  me = async (req, res, next) => {
    try {
      const user = {
        id: req.user._id,
        displayName: req.user.displayName,
        email: req.user.email,
        mobile: req.user.mobile,
        gender: req.user.gender,
      };

      res.json({ user });
    } catch (e) {
      return next(e);
    }
  };

  cleanAdminObj = (admin) => {
    delete admin._doc.password;
    delete admin._doc.created_at;
    delete admin._doc.updated_at;
    delete admin._doc.__v;
    admin._doc.displayName = `${admin._doc.first_name} ${admin._doc.last_name}`;
    delete admin._doc.first_name;
    delete admin._doc.last_name;
    admin._doc.admin = true;
  };
}

module.exports = AuthController;
