const userModel = require("../models/userModel");

async function getAllAdmins(req, res) {
  try {
    const allUsers = await userModel.find();
    console.log("All Users:", allUsers);

    const admins = await userModel.find({ role: { $regex: /^admin$/i } }); 
    console.log("Admins Found:", admins);

    if (!admins.length) {
      return res.status(404).json({
        message: "No admins found",
        error: true,
        success: false,
      });
    }

    res.status(200).json({
      count: admins.length,
      admins,
      message: "Admin details fetched",
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Server error",
      error: true,
      success: false,
    });
  }
}

module.exports = { getAllAdmins };
