import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  phone_verified: { type: Boolean, default: false },
  email_verified: { type: Boolean, default: false },
  password: { type: String, required: true },
  car: { type: Schema.Types.ObjectId, ref: 'Car', required: false },
  trip_posted: [{ type: Schema.Types.ObjectId, ref: 'Trips' }],
  trip_joined: [{ type: Schema.Types.ObjectId, ref: 'Trips' }],
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});
UserSchema.index({ email: 1 }, { unique: true });
export default mongoose.model('User', UserSchema);
