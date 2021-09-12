const Admin = require('../../models/Admin');

class ProfileController {
    index = async (req, res, next) => {
        try {
            const admin = await Admin.findById(req.user._id);
            delete admin._doc.__v;
            return res.json({profile: admin});
        } catch(e) {
            return next(e);
        }
    }
}

module.exports = ProfileController