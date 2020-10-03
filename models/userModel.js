const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
		type: String,
		require: [true, "Please tell us your name"],
	},
	email: {
		type: String,
		require: [true, "Please tell us your email"],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, 'Please privide a valid email address']
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
	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetExpir:Date,
	active: {
		type: Boolean,
		default: true,
		select: false
	},
},
	{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Document middleware
// Encrypt user password
userSchema.pre('save', async function(next){
  //only run this when password is modified
  if(!this.isModified('password')) return next();
  // Encrypt the user password
  this.password = await bcrypt.hash(this.password, 12);
  // delete the passwordConfirm
  this.passwordConfirm = undefined;
  next();
});

// Check if user changed passwords
userSchema.pre('save', function(next){
  if(!this.isModified('password') || this.isNew){
    return next();
  };
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// CHeck is user deleted their account
userSchema.pre(/^find/, function(next){
  // ths points to the current user
  this.find({active: {$ne: false}});
  next();
});

// Instance method
// Compare user passwords 
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
  return await bcrypt.compare(candidatePassword, userPassword);
};


const User = mongoose.model('User', userSchema);

module.exports = User;
