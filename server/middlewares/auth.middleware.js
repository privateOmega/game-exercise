const jwt = require('jsonwebtoken');

const userModel = require('../models/user.model');

const { TOKEN_SECRET } = process.env;

const authMiddleware = async (req, res, next) => {
  const headerValue = req.header('Authorization');
  const token = headerValue.replace('Bearer ', '');

  const payload = jwt.verify(token, TOKEN_SECRET);

  try {
    const userInstance = userModel.findById(payload._id);
    if (!userInstance) {
      throw new Error({ error: 'unauthenticated' });
    }
    req.userInstance = userInstance;
    next();
  } catch (error) {
    res.status(401).json({ message: 'unauthenticated' });
  }
};

module.exports = authMiddleware;
