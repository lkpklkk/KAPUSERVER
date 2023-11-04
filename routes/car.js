import { Router } from 'express';
import Car from '../models/Car.js';
const carRouter = Router();
import dotenv from 'dotenv';
dotenv.config();
import auth from '../middleware/auth.js';
import populateUser from '../middleware/populateUser.js';
carRouter.post('/', auth, populateUser, async (req, res) => {
  try {
    const user = req.userDetails;
    const car = new Car(req.body);
    car.user = user._id;
    user.cars.push(car);
    await user.save();
    await car.save();
    res.status(200).json({ message: 'Car created successfully', car });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error\n' + error.message);
  }
});
carRouter.delete('/:id', auth, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    await car.deleteOne();
    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error\n' + error.message);
  }
});

carRouter.get('/:id', async (req, res) => {
  try {
    const locations = await Car.findById(req.params.id);
    if (!locations) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json(locations);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error\n' + error.message);
  }
});

export default carRouter;
