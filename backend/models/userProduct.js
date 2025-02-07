const mongoose = require("mongoose");

const userProductSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",       
      required: true
    },
    Image: [String],
    totalAmount: Number,
    userRemark: String,
    productName: String,
    brandName: String,
    category: String,
    productImage: [String],
    description: String,
    pricing: [
      {
        currency: String,
        faceValues: [
          {
            faceValue: String,
            sellingPrice: Number,
          },
        ],
      },
    ],
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const userProduct = mongoose.model("userproduct", userProductSchema);
module.exports = userProduct;
