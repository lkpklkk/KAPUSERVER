import { Router } from 'express';
import User from '../Models/User.js';
const userRouter = Router();
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import auth from '../middleware/auth.js';
import twillio from 'twilio';
import populateUser from '../middleware/populateUser.js';

// Twillio Set Up
const accountSid = process.env.TWILLIO_ACCOUNT_SID;
const authToken = process.env.TWILLIO_AUTH_TOKEN;
const client = twillio(accountSid, authToken);

userRouter.post('/signup', async (req, res) => {
  try {
    // Check if user already exists
    console.log(req.body);
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (!req.body.password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    // Create new user
    user = new User(req.body);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    await user.save();

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY,
      { expiresIn: '30d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error\n' + error.message);
  }
});

userRouter.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Email is not associated with an account' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Password' });
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY,
      { expiresIn: '30d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

userRouter.get('/me', auth, populateUser, async (req, res) => {
  try {
    // Get user from database
    const user = await req.userDetails.populate([
      'cars',
      'trip_posted',
      'trip_joined',
    ]);

    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error\n' + error.message);
  }
});
userRouter.delete('/me', auth, populateUser, async (req, res) => {
  try {
    // Get user from database
    const user = req.userDetails;
    await user.deleteOne();
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Twillio verification
userRouter.post('/verify-phone', auth, populateUser, async (req, res) => {
  try {
    // Get user from database
    const user = req.userDetails;

    const phoneNumber = user.phone;
    client.verify.v2
      .services('VA921137b0e66175fddcc1509dc7cfced2')
      .verifications.create({ to: phoneNumber, channel: 'sms' })
      .then((verification) => console.log(verification.status));
    res.json({ message: 'Verification code sent' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

userRouter.post('/verify-sms-code/', auth, populateUser, async (req, res) => {
  try {
    // Get user from database
    const user = req.userDetails;
    const code = req.body.code;
    if (!code) {
      return res.status(400).json({ message: 'Verification code is required' });
    }

    const phoneNumber = user.phone;
    client.verify.v2
      .services('VA921137b0e66175fddcc1509dc7cfced2')
      .verificationChecks.create({ to: phoneNumber, code: code })
      .then(async (verification) => {
        await User.findByIdAndUpdate(req.user.id, {
          phone_verified: true,
        });
        console.log(verification.status);
        res.json({ message: 'verified' });
      });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

export default userRouter;
