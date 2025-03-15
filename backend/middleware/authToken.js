const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
    try {
        console.log("Cookies received:", req.cookies);
        console.log("Authorization Header:", req.headers.authorization);

        let token = req.cookies?.token || req.headers.authorization?.split(" ")[1]; 

        console.log("Extracted Token:", token);

        if (!token) {
            return res.status(401).json({
                message: "Please Login...!",
                error: true,
                success: false
            });
        }

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
            if (err) {
                console.log("JWT Error:", err);
                return res.status(403).json({ message: "Invalid Token", error: true });
            }

            console.log("Decoded Token:", decoded);
            req.userId = decoded?._id;
            next();
        });

    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            data: [],
            error: true,
            success: false
        });
    }
}

module.exports = authToken;
