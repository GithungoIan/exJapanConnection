
const mongoose = require('mongoose');
const slugify = require('slugify');

const vehicleSchema = new mongoose.Schema(
  {
  make: {
    type: String,
    required: [true, 'A vehicle must have a make'],
  },
  slug: String,
  model: {
    type: String,
    required: [true, 'A vehicle must have a model'],
  },
  price: {
    type: Number,
  },
  instock: {
    type: Boolean,
    default: true,
  },
  featuredVehicle: {
    type: Boolean,
    default: false
  },
  overview: {
    mileage: Number,
    condition:String,
    bodyType: String,
    color: String,
    Fuel: String,
    transmission: String,
    drive: String,
    dutyType: String,
    InteriorType: String,
    engineSize: Number,
    year: Number,
    referenceNo: String
  },
  features: [String],
  description: {
    type: String,
    trim: true,
  },
  datePosted: {
    type: Date,
    default: Date.now()
  },
  imageCover: {
    type: String,
    required: [true, 'A vehicle must have a cover image'],
  },
  images: [String],
  location: String
},
{
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
}
);

vehicleSchema.index({slug: 1});

vehicleSchema.virtual('comments', {
  ref: 'Comment', 
  foreignField: 'vehicle',
  localField: '_id'
});

// QUERY MIDDLEWARE: RUN  BEFORE SAVE() AND CREATE()
// vehicleSchema.pre(/^find/, function(next) {
//   this.find({featuredVehicle: {$ne: true}});
//   next();
// });

vehicleSchema.pre('save', function(next) {
  this.slug = slugify(`${this.make}-${this.model}`, {lower: true});
  next();
})

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports = Vehicle;
