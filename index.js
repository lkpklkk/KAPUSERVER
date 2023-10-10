import express from 'express';
import mongoose from 'mongoose';
import json from 'body-parser';
import User from './Models/User.js';
import morgan from 'morgan';

const app = express();

app.use(morgan('dev'));
// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/skiCarpoolDB', {})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB', err);
  });

// Sample route to create a user
app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
