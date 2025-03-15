const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
    try {
        console.log("🟡 Cookies received:", req.cookies);
        console.log("🟡 Authorization Header:", req.headers.authorization);

        let token = req.cookies?.token || 
                    (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);

        console.log("🟡 Extracted Token:", token);

        if (!token) {
            console.log("🔴 No Token Provided");
            return res.status(401).json({
                message: "Please Login...!",
                error: true,
                success: false
            });
        }

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
            if (err) {
                console.log("🔴 JWT Verification Failed:", err.message);
                return res.status(403).json({ 
                    message: "Invalid or Expired Token", 
                    error: true 
                });
            }

            console.log("🟢 Token Verified:", decoded);

            req.user = decoded;  
            req.userId = decoded._id;
            next();
        });

    } catch (err) {
        console.error("🔥 authToken Error:", err);
        res.status(500).json({
            message: err.message || "Internal Server Error",
            data: [],
            error: true,
            success: false
        });
    }
}

module.exports = authToken;
