const jwt = require('jsonwebtoken');

const getTokenFromRequest = (req) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  
  return req.cookies?.token;
};

const authMiddleware = (req, res, next) => {
  const token = getTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided", error: true, success: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    req.user = decoded;  
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token", error: true, success: false });
  }
};

module.exports = authMiddleware;
