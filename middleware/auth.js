import jwt from 'jsonwebtoken';

function auth(req, res, next) {
  const token = req.header('Authorization');

  // Check for token
  if (!token)
    return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Add user from payload to request object
    req.user = decoded.user;

    next();
  } catch (e) {
    res.status(400).json({ message: 'Invalid token' + ' ' + e.message });
  }
}

export default auth;
