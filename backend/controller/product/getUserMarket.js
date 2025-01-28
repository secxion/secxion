const userProduct = require("../../models/userProduct")

const getMarketController = async(req,res)=>{
    try{
        const userMarket = await userProduct.find().sort({ createdAT : -1 })

        res.json({
            message : "All Product",
            success : true,
            error : false,
            data : userMarket
        })

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })

    }

}

module.exports = getMarketController