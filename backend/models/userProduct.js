const mongoose = require('mongoose')

const userProductSchema = mongoose.Schema({    
    Image : [],
    totalAmount : Number,
    description : String,
},{
    timestamps : true
})

const userProduct = mongoose.model("userproduct",userProductSchema)

module.exports = userProduct