const mongoose = require('mongoose');
const slugify = require('slugify');

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
    imageCover: {
      type: String,
      required: [true, 'A vehicle must have a cover image']
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
// QUERY Middleware: runs before the save() and create()
vehicleSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

vehicleSchema.post(/^find/, function (docs, next) {
  // console.log(`Query took ${Date.now() - this.start} milliseconds`);
  // console.log(docs);
  next();
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports = Vehicle;
