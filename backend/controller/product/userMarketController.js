const userProduct = require("../../models/userProduct");
const userModel = require("../../models/userModel");

const fetchUserDetails = async (userId) => {
    try {
        const user = await userModel.findById(userId).select('name email profilePic role');
        return user;
    } catch (err) {
        console.error("Error fetching user details:", err);
        return null; 
    }
};

const getAllUserMarkets = async (req, res) => {
    try {
        const userMarkets = await userProduct.find().sort({ createdAt: -1 });

        const marketsWithUserDetails = await Promise.all(userMarkets.map(async (market) => {
            const userDetails = await fetchUserDetails(market.userId);
            return {
                ...market.toObject(), 
                userDetails, 
            };
        }));

        res.json({
            message: "Fetched all user markets successfully",
            success: true,
            error: false,
            data: marketsWithUserDetails,
        });
    } catch (err) {
        console.error("Error fetching user markets:", err);
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
};

const updateMarketStatus = async (req, res) => {
    try {
        const { status, cancelReason, crImage } = req.body; 
        const { id } = req.params;

        if (!status) {
            return res.status(400).json({
                message: "Status is required",
                error: true,
                success: false,
            });
        }

        const updateData = { status };

        if (status === 'CANCEL') {
            if (cancelReason) {
                updateData.cancelReason = cancelReason; 
            } else {
                return res.status(400).json({
                    message: "Cancel reason is required when status is CANCEL",
                    error: true,
                    success: false,
                });
            }
            if (crImage) {
                updateData.crImage = crImage; 
            }
        } else if (status === 'DONE') {
            updateData.cancelReason = null; 
            updateData.crImage = null; 
        }

        const updatedMarket = await userProduct.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedMarket) {
            return res.status(404).json({
                message: "Market not found",
                error: true,
                success: false,
            });
        }

        res.json({
            message: "Market status updated successfully",
            success: true,
            error: false,
            data: updatedMarket,
        });
    } catch (err) {
        console.error("Error updating market status:", err);
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
};

module.exports = {
    getAllUserMarkets,
    updateMarketStatus,
};