const jwt = require('jsonwebtoken');

function verifyToken(token, secret) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                reject(err);  
            } else {
                resolve(decoded); 
            }
        });
    });
}

async function authToken(req, res, next) {
    try {
        const token = req.cookies?.token;

        console.log("Extracted Token:", token);

        if (!token) {
            return res.status(401).json({
                message: "Authentication required. Please login.",
                error: true,
                success: false
            });
        }

        const decoded = await verifyToken(token, process.env.TOKEN_SECRET_KEY);

        console.log("Decoded Token:", decoded);

        req.userId = decoded._id;
        
        next();  

    } catch (err) {
        console.error("Authentication Error:", err);

        let message = "An error occurred during authentication.";
        let statusCode = 400;

        if (err.name === "JsonWebTokenError") {
            message = "Invalid token.";
            statusCode = 401;
        } else if (err.name === "TokenExpiredError") {
            message = "Token has expired.";
            statusCode = 401;
        }

        res.status(statusCode).json({
            message,
            error: true,
            success: false
        });
    }
}

module.exports = authToken;
