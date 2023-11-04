import { Router } from 'express';
import Location from '../models/Location.js';
const locationRouter = Router();
import dotenv from 'dotenv';
dotenv.config();
import auth from '../middleware/auth.js';

locationRouter.post('/', auth, async (req, res) => {
  try {
    const location = new Location(req.body);
    location.save();
    res
      .status(200)
      .json({ message: 'Location created successfully', location });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error\n' + error.message);
  }
});

locationRouter.get('/', auth, async (req, res) => {
  try {
    const locations = await Location.find().limit(10);
    if (!locations) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.status(200).json(locations);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error\n' + error.message);
  }
});
locationRouter.delete('/:id', auth, async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    await location.deleteOne();
    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error\n' + error.message);
  }
});

locationRouter.get('/:id', auth, async (req, res) => {
  try {
    const locations = await Location.findById(req.params.id);
    if (!locations) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.status(200).json(locations);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error\n' + error.message);
  }
});

export default locationRouter;
