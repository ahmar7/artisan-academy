//middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  try {
    // Check if the Authorization header is present
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized - Missing token' });
    }

    // Split the header to get the token part
    const [bearer, token] = authHeader.split(' ');

    // Check if the header starts with 'Bearer' and the token is present
    if (bearer !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token format' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_JWT);
    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }


    const user = await userModel.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }

    // Attach the user object to the request for further use in the route
    req.user = user;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error(error.message || error);
    res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

module.exports = authMiddleware;
