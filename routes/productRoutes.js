const express = require('express')
const router = express.Router()
const { createProduct
    , deleteProduct,
     getAllProducts,
    getSingleProduct,
     updateProduct,
     uploadImage } = require('../controllers/productController')
     const {getSingleProductReviews}= require('../controllers/reviewController')
const { authenticateUser, authorizePermissions } = require('../middleware/authentication')
router.route('/').get(getAllProducts).post(authenticateUser,authorizePermissions('admin'),createProduct)
router.route('/uploadimage').post(authenticateUser,authorizePermissions('admin'),uploadImage)
router.route('/:id').get(getSingleProduct).
//restricted to admin only 
patch(authenticateUser,authorizePermissions('admin'),updateProduct).
delete(authenticateUser,authorizePermissions('admin'),deleteProduct)
router.route('/:id/reviews').get(getSingleProductReviews)
module.exports= router