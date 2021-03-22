const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
		type: String,
		required: [true, "Please tell us your name"],
	},
	email: {
		type: String,
		required: [true, "Please tell us your email"],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, 'Please privide a valid email address']
	},
  photo: {
    type: String,
    default: 'default.jpg',
  },
	role: {
		type: String,
		default: 'user',
		enum: ['user', 'sales', 'admin'],
	},
	password: {
		type: String,
		required: [true, 'Please provide a password'],
		minlength: 8,
		select: false
	},
	passwordConfirm: {
		type: String,
		required: [true, 'Please confirm your password'],
		validate: {
			//THis only works on Create and save!!!
			validator: function(el) {
				return el === this.password;
			},
			message: 'Password are not the same!'
		}
	},
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
},
	{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Document middleware
// Encrypt user password
userSchema.pre('save', async function (next) {
  // only run this function if passowrd is modified
  if (!this.isModified('password')) return next();

  // Encrypt or hash the password
  // Either use a cost parameter or you can salt the hash
  this.password = await bcrypt.hash(this.password, 12);
  // Delete the passwordConfirm
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) {
    return next();
  }
  this.passwordChangeAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current user
  this.find({ active: { $ne: false } });
  next();
});
// instance method
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// checking if the user changed the password
userSchema.methods.changedPasswordsAfter = function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStamp;
  }

  //False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
