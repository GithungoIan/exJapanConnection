const mongoose = require('mongoose');
const validator = require('validator');


const contactSchema = new mongoose.Schema({
  name: {
    type: String,
  required: [true, 'You must specify your name']
  },
  email: {
		type: String,
		required: [true, "Please tell us your email"],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, 'Please privide a valid email address']
	},
  phoneNumber: {
    type: String,
    required: [true, "Please tell us your phoneNumber"]
  },
  comment: {
    type: String,
    trim: true,
  },
  datePosted: {
    type: Date,
    default: Date.now()
  },
  vehicle: {
    type: mongoose.Schema.ObjectId,
    ref: 'Vehicle', 
  }
},
{
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
}
);


const Comment = mongoose.model('Comment', contactSchema);
module.exports = Comment;