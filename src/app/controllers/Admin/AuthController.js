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
          }
        });
      } else {
        res.status(401).json({message: "incorrect email or password "});
      }
    } catch(e) {
      return next(e);
    }
  }


  logout = async (req, res, next) => {

  }

  cleanAdminObj = (admin) => {
    delete admin._doc.password;
    delete admin._doc.created_at;
    delete admin._doc.updated_at;
    delete admin._doc.__v;
  }
}

module.exports = AuthController;