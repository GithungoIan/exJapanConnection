const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
		name: {
			type: String,
			required: [true, 'A vehicle must have a name'],
			trim: true,
		},
		slug: String,
		spec: [
			{
				referenceNo: String,
				millage: String,
				modeCode: String,
				registration: {
					type: Date,
					default: Date.now(),
				},
				manufacture: {
					type: Date,
					default: Date.now(),
				},
				modelGrade: String,
				chassis: String,
				engineSize: Number,
				drive: String,
				externalColor: String,
				steering: String,
				transmission: String,
				fuel: String,
				seats: Number,
				doors: Number,
			}
		],
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
	}
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;