import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TripSchema = new Schema({
  resort: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  driver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  car: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
  status: {
    type: String,
    required: true,
    enum: ['open', 'closed', 'cancelled', 'ongoing'],
  },

  // Using Date for consistent datetime format
  arrival_time: { type: Date, required: true },
  leave_time: { type: Date, required: true },

  // Number of Available seats on this trip
  seats_available: { type: Number, min: 1, required: true },

  pickup_preference: {
    allow_pickup: { type: Boolean, required: false, default: false },
    // Maximum distance from the route to pickup a passenger
    distance: {
      type: Number,
      required: function () {
        return this.pickup_preference.allow_pickup;
      },
    },

    // Additional charge for using the pickup service
    pickup_extra_charge: {
      amount: {
        type: Number,
        min: 0,
        required: function () {
          return this.pickup_preference.allow_pickup;
        },
      }, // Ensuring non-negative value
      currency: {
        type: String,
        required: function () {
          return this.pickup_preference.allow_pickup;
        },
      },
    },
  },

  passengers: [
    {
      pickup_location: { type: Schema.Types.ObjectId, ref: 'Location' },
      passenger: { type: Schema.Types.ObjectId, ref: 'User' },
      price: {
        amount: { type: Number, min: 0, required: true }, // Ensuring non-negative value
      },
    },
  ],

  // Total price for the trip
  currency: { type: String, required: true },
  description: { type: String, required: false },
});

// Add appropriate indexes based on your query patterns
TripSchema.index({ driver: 1, resort: 1 });

export default mongoose.model('Trip', TripSchema);
