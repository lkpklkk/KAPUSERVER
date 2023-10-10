import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const Car = new Schema({
  year: {
    type: Number,
    required: true,
  },
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Car', Car);
