import User from '../Models/User.js';
async function populateUser(req, res, next) {
  try {
    // Get user from database
    req.userDetails = await User.findById(req.user.id).select('-password');

    if (!req.userDetails) {
      return res.status(404).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
}
export default populateUser;
