import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const locationSchema = new Schema({
  name: String,
  geometry: {
    type: {
      type: String,
      enum: ['Point'], // 'location' schema will always be of type 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

const Location = mongoose.model('Location', locationSchema);
