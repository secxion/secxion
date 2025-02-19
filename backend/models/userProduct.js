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
            description: { type: String, default: "" }, 
          },
        ],
      },
    ],
    timestamp: { type: Date, default: Date.now },
    status: { 
      type: String,
      enum: ['DONE', 'CANCEL'], 
      default: null 
    },
    cancelReason: { 
      type: String,
      default: null 
    },
    crImage: { 
      type: [String],
      default: null 
    }
  },
  {
    timestamps: true,
  }
);

const userProduct = mongoose.model("userproduct", userProductSchema);
module.exports = userProduct;