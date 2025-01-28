const userProduct = require("../../models/userProduct")

async function UserUploadMarketController(req,res){
    try{
    
        const UserUploadMarket = new userProduct(req.body)
        const saveProduct = await UserUploadMarket.save()

        res.status(201).json({
            message : "Submitted!",
            error : false,
            success : true,
            data : saveProduct
        })

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = UserUploadMarketController