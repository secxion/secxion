const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
  try {
    const token = req.cookies?.token;
    console.log("Token received:", token);

    if (!token) {
      return res.status(401).json({
        message: "Please Login...!",
        error: true,
        success: false
      });
    }

    jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
      if (err) {
        console.error("Error verifying token:", err);
        return res.status(403).json({
          message: "Invalid or expired token.",
          error: true,
          success: false
        });
      }

      req.userId = decoded?._id;
      console.log("Decoded token:", decoded);

      next();
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({
      message: "Internal server error.",
      error: true,
      success: false
    });
  }
}

module.exports = authToken;