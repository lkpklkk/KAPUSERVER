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

  // url for the icon
  icon: String,
});
locationSchema.index({ geometry: '2dsphere', name: 1 }, { unique: true });
const Location = mongoose.model('Location', locationSchema);
export default Location;
