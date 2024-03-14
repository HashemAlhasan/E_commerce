

const { checkPermission } = require('../utils')
const Product=require('../models/Product')
const Review= require('../models/Review')


const{StatusCodes}=require('http-status-codes')
const CustomError=require('../errors/index')
const createReview=async(req,res)=>{
   const {product:productId}=req.body
   const isValidProduct= await Product.findOne({_id:productId})
   if(!isValidProduct){
    throw new CustomError.NotFoundError(`No Product With ID : ${productId}`)
   }
   const alreadySumbitted=await Review.findOne({
    product:productId,
    user:req.user.userId
   })

   
   console.log(alreadySumbitted);
   if(alreadySumbitted){
    throw new CustomError.BadRequestError('Already sumbitted revirew')

   }
   req.body.user=req.user.userId
   const review= await Review.create(req.body)
   res.status(StatusCodes.CREATED).json({review})
}
const getAllReviews=async(req,res)=>{
    //populate methode i tallowse us to refrence athor document in pther collections
    //we get specfifc info about the product
    const reviews= await Review.find({}).
    populate({path:'product'
    ,select:'name company price' // what attrbute i wanna get from product 
})
    .populate({path:'user' // the path is the refrence in user model that attrbute

    ,select:'name email'})
    res.status(StatusCodes.OK).json({reviews,count:reviews.length})
}
const getSingleReview=async(req,res)=>{
    const {id:reviewId}= req.params
    const review= await Review.findOne({_id:reviewId}).
    populate({path:'product'
    ,select:'name company price' // what attrbute i wanna get from product 
})
    .populate({path:'user' // the path is the refrence in user model that attrbute

    ,select:'name email'})
    if(!review){
        throw new CustomError.NotFoundError(`no review with id :${reviewId}`)
    }
    res.status(StatusCodes.OK).json(review)

}
const updateReview=async(req,res)=>{
    const {id:reviewId}= req.params
    const {rating,title,comment}=req.body
    const review= await Review.findOne({_id:reviewId})
    if(!review){
        throw new CustomError.NotFoundError(`no review with id :${reviewId}`)
    }
    checkPermission(req.user,review.user)
    review.rating=rating;
    review.title=title;
    review.comment=comment;
    await review.save();
    res.status(StatusCodes.OK).json(review)



}
const deleteReview=async(req,res)=>{
    const {id:reviewId}= req.params
    const review= await Review.findOne({_id:reviewId})
    if(!review){
        throw new CustomError.NotFoundError(`no review with id :${reviewId}`)
    }
    checkPermission(req.user,review.user)
    await review.remove()
    res.status(StatusCodes.OK).json({msg:`sucessfuly removed`})
    
}
//another way insted of virtuals
//we can query the data
const getSingleProductReviews=async(req,res)=>{
    const{id:productId}= req.params
    const reviews= await Review.find({
        product:productId
    })
    res.status(StatusCodes.OK).json({reviews,count:reviews.length})

}
module.exports={
createReview,
getAllReviews,getSingleReview,
updateReview,deleteReview,getSingleProductReviews
}