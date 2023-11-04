import { Router } from 'express';
import Trip from '../models/Trip.js';
const tripRouter = Router();
import dotenv from 'dotenv';
dotenv.config();
import auth from '../middleware/auth.js';

import populateUser from '../middleware/populateUser.js';
import Joi from 'joi';
import currencyCodes from 'currency-codes';
import Location from '../models/Location.js';

const hasTimeComponent = (value, helpers) => {
  const timePattern = /T((?!(00:00:00(\.000)?))\d{2}:\d{2}(:\d{2}(\.\d{3})?)?)/;
  console.log(value);
  const stringValue =
    value instanceof Date ? value.toISOString() : String(value);
  console.log(value);
  console.log(stringValue);
  if (!timePattern.test(stringValue)) {
    const errorMessage =
      "Date must include a time component or can't be midnight";
    return helpers.message(errorMessage);
  }
  return value;
};

// Validation schema

const tripValidationSchema = Joi.object({
  status: Joi.string()
    .valid('open', 'closed', 'cancelled', 'ongoing')
    .required(),
  arrival_time: Joi.date().iso().required(),
  leave_time: Joi.date().iso().required(),
  currency: Joi.string()
    .valid(...currencyCodes.codes())
    .required(),
  resort: Joi.string().required(),
  car: Joi.string().required(),
  seats_available: Joi.number().min(1).required(),
  description: Joi.string(),
});

tripRouter.post('/', auth, populateUser, async (req, res) => {
  try {
    console.log(req.body);
    const { error } = tripValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = req.userDetails;
    // find resort
    const resort = await Location.findById(req.body.resort);
    if (!resort) {
      return res.status(400).json({ message: 'Resort not found' });
    }
    // find car
    const cars = user.cars;
    if (!cars.includes(req.body.car)) {
      return res.status(400).json({ message: 'Car does not belong to user' });
    }
    // create trip

    const trip = new Trip(req.body);
    user.trip_posted.push(trip._id);
    trip.driver = user._id;
    trip.resort = resort._id;
    trip.car = req.body.car;
    await trip.save();
    await user.save();
    res.status(200).json({ message: 'Trip created successfully', trip });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default tripRouter;
