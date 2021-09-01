const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const adminSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    index: true
  },
  birthdate:{
    type: Date,
  },
  profile_picture: {
    type: String,
  },
  cover_picture: {
    type: String,
  },
  city: {
    type: String,
  },
  is_blocked: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  last_login_at: {
    type: Date
  }
});

adminSchema.pre('save', function(next) {
  const admin = this;

  // only hash the password if it has been modified (or is new)
  if (!admin.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err);

      // hash the password using our new salt
      bcrypt.hash(admin.password, salt, function(err, hash) {
          if (err) return next(err);
          // override the cleartext password with the hashed one
          admin.password = hash;
          next();
      });
  });
});

adminSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
  });
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;