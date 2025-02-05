const userProduct = require("../../models/userProduct");

async function marketRecordController(req, res) {
    try {
      const { _id, ...resBody } = req.body;
      console.log("Received request body:", resBody);
  
      if (!_id) {
        throw new Error("Product ID (_id) is required");
      }
  
      const existingProduct = await userProduct.findById(_id);
      if (!existingProduct) {
        return res.status(404).json({
          message: "Product not found",
          data: null,
          success: false,
          error: true,
        });
      }
  
      if (!resBody.pricing && existingProduct.pricing) {
        resBody.pricing = existingProduct.pricing;
      }
  
      const marketRecord = await userProduct.findByIdAndUpdate(_id, resBody, {
        new: true,
        runValidators: true,
      });
  
      console.log("Updated product:", marketRecord);
  
      res.json({
        message: "Update successfully",
        data: marketRecord,
        success: true,
        error: false,
      });
    } catch (err) {
      console.error("Error updating product:", err);
      res.status(400).json({
        message: err.message || err,
        error: true,
        success: false,
      });
    }
  }
  

module.exports = marketRecordController;
