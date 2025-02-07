const userProduct = require("../../models/userProduct");

const getMarketController = async (req, res) => {
    try {
        console.log("User ID from Middleware:", req.userId);

        if (!req.userId) {
            return res.status(401).json({
                message: "Unauthorized! Please login.",
                error: true,
                success: false
            });
        }

        const userMarket = await userProduct.find({ userId: req.userId }).sort({ createdAt: -1 });

        console.log("Fetched User Products:", userMarket);

        res.json({
            message: "User Products",
            success: true,
            error: false,
            data: userMarket
        });

    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = getMarketController;
