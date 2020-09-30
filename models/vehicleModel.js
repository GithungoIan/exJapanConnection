const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
		name: {
			type: String,
			required: [true, 'A vehicle must have a name'],
			trim: true,
		},
		slug: String,
    overview: [
      {
        millage: Number,
        condition: String,
        BodyType: String,
        color: String,
        Fuel: String,
        transmission: String,
        drive: String,
        DutyType: String,
        InteriorType: String,
        engineSize: Number,
        year:Number,
        referenceNo: String,
        registration: {
          type: Date,
          default: Date.now(),
        },
        model: String
      }
    ],
    Features: [String],
		price: {
			type: Number,
			required:[true, 'A vehicle must have a price']
		},
		summary: {
			type: String,
			trim: true,
			required: [true, 'A vehicle must have a description']
		},
		description: {
			type: String,
			trim: true,
		},
		images: [String],
		postedAt: {
			type: Date,
			default: Date.now(),
			select: false
		},
		location: String,
	},
		{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
