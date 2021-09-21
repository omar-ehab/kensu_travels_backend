const Admin = require('../../models/Admin');
const _ = require('lodash');

class ProfileController {
    index = async (req, res, next) => {
        try {
            const result = await Admin.findById(req.user._id);
            let admin = _.omit(result._doc, ["password", "__v", "created_at", "updated_at"]);
            admin.displayName = `${admin.first_name} ${admin.last_name}`;
            return res.json({user: admin});
        } catch(e) {
            return next(e);
        }
    }
}

module.exports = ProfileController