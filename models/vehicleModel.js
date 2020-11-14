
const mongoose = require('mongoose');
const slugify = require('slugify');

const vehicleSchema = new mongoose.Schema({
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
  overview: [
    {
      millage: Number,
      condition: String,
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
    }
  ],
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

// QUERY MIDDLEWARE: RUN  BEFORE SAVE() AND CREATE()
vehicleSchema.pre('save', function(next) {
  this.slug = slugify(`${this.model}-${this.make}`, {lower: true});
  // this.slug = slugify(this.name, {lower: true});
  next();
})

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports = Vehicle;
