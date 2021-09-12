const Admin = require('../../models/Admin');
const { signAccessToken } = require('../../../helpers/jwt_helper');


class AuthController{

  login = async (req, res, next) => {
    try {
      const admin = await Admin.findOne({email: req.body.email});
      if(admin && !admin.is_blocked) {
        admin.comparePassword(req.body.password, async (err, isMatched) => {
          if(err){
            throw err;
          }
          this.cleanAdminObj(admin)
          if(isMatched) {
            const accessToken = await signAccessToken(admin._doc, "1d");
            res.json({accessToken, user: admin});
          } else {
            res.status(401).json({message: "incorrect email or password"});
          }
        });
      } else {
        res.status(401).json({message: "incorrect email or password"});
      }
    } catch(e) {
      return next(e);
    }
  }

  me = async (req, res, next) => {
    try {
      const user = {
        id: req.user._id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        mobile: req.user.mobile,
        gender: req.user.gender,

      };

      res.json({user});
    } catch(e) {
      return next(e);
    }
  }

  cleanAdminObj = (admin) => {
    delete admin._doc.password;
    delete admin._doc.created_at;
    delete admin._doc.updated_at;
    delete admin._doc.__v;
    admin._doc.admin = true;
  }
}

module.exports = AuthController;