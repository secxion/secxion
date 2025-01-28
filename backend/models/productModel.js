const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model("product", productSchema);

module.exports = productModel;
