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
  cars: [{ type: Schema.Types.ObjectId, ref: 'Car' }],
  trip_posted: [{ type: Schema.Types.ObjectId, ref: 'Trip' }],
  trip_joined: [{ type: Schema.Types.ObjectId, ref: 'Trip' }],
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});
UserSchema.index({ email: 1 }, { unique: true });
export default mongoose.model('User', UserSchema);
