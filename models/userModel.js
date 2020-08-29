const mongoose = require('mongoose');
const validator = require('validator');

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


const User = mongoose.model('User', userSchema);

module.exports = User;