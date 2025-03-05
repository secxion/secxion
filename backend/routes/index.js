const express = require('express')

const router = express.Router()

const userSignUpController = require("../controller/user/userSignUp")
const userSignInController = require('../controller/user/userSignin')
const userDetailsController = require('../controller/user/userDetails')
const authToken = require('../middleware/authToken')
const userLogout = require('../controller/user/userLogout')
const allUsers = require('../controller/user/allUsers')
const updateUser = require('../controller/user/UpdateUser')
const UploadProductController = require('../controller/product/uploadProduct')
const getProductController = require('../controller/product/getProduct')
const updateProductController = require('../controller/product/updateProduct')
const getCategoryProduct = require('../controller/product/getCategoryProductOne')
const getCategoryWiseProduct = require('../controller/product/getCategoryWiseProduct')
const getProductDetails = require('../controller/product/getProductDetails')
const SearchProduct = require('../controller/product/searchProduct')
const filterProductController = require('../controller/product/filterProduct')
const UserUploadMarketController = require('../controller/product/userUploadMarket')
const getMarketController = require('../controller/product/getUserMarket')
const marketRecordController = require('../controller/product/marketRecord')
const { getAllUserMarkets, updateMarketStatus } = require('../controller/product/userMarketController')
const { createBlogNote, getAllBlogNotes, updateBlogNote, deleteBlogNote } = require('../controller/blogNoteController')

router.post("/signup", userSignUpController)
router.post("/signin",userSignInController)
router.get("/user-details",authToken,userDetailsController)
router.get("/userLogout",userLogout)

//admin panel
router.get("/all-user",authToken,allUsers)
router.post("/update-user",authToken,updateUser)
router.get("/get-all-users-market",authToken, getAllUserMarkets)
router.post("/update-market-status/:id", updateMarketStatus)

//product
router.post("/upload-product",authToken,UploadProductController)
router.get("/get-product",getProductController)
router.post("/update-product ",authToken,updateProductController)
router.get("/get-categoryProduct",getCategoryProduct)
router.post("/category-product",getCategoryWiseProduct)
router.post("/product-details",getProductDetails)
router.get("/search",SearchProduct)
router.post("/filter-product", filterProductController)

//user market
router.post("/upload-market",authToken,UserUploadMarketController)
router.get("/get-market",authToken, getMarketController)
router.post("/market-record",authToken,marketRecordController)

//system blog
router.post("/create-blog",createBlogNote)
router.get("/get-blogs",getAllBlogNotes)
router.put("/update-blog/:id",updateBlogNote)
router.delete("/delete-blog/:id",deleteBlogNote)

module.exports = router