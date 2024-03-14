//createProduct, getAllProducts,
//getSingleProduct, updateProduct, deleteProduct, uploadImage
const Product= require('../models/Product')
const {StatusCodes}=require('http-status-codes')
const CustomError=require('../errors')
const path= require('path')
const { log } = require('console')


const createProduct = async(req,res)=>{
    // the name should match the name in the model 
    req.body.user=req.user.userId
    const product= await Product.create( req.body)
    res.status(StatusCodes.CREATED).json({product})
}
const getAllProducts = async(req,res)=>{
    const products= await Product.find({}).populate('reviews')
    //console.log(products);
    res.status(StatusCodes.OK).json({products,count:products.length})

}
const getSingleProduct = async(req,res)=>{
    const {id:productId}= req.params
    const product= await Product.findOne({_id:productId}).populate('reviews')
    if (!product){
        throw new CustomError.NotFoundError(`no product found with id : ${productId}`)
    }
    res.status(StatusCodes.OK).json(product)
}
const updateProduct = async(req,res)=>{
    const {id:productId}= req.params
    
    const product= await Product.findOneAndUpdate({_id:productId},req.body,{
        new:true,
        runValidators:true
    })
    if (!product){
        throw new CustomError.NotFoundError(`no product found with id : ${productId}`)
    }
    res.status(StatusCodes.OK).json(product)
    
}
const deleteProduct = async(req,res)=>{
    const {id:productId}= req.params
    const product= await Product.findOne({_id:productId})
    if (!product){
        throw new CustomError.NotFoundError(`no product found with id : ${productId}`)
    }
    // insted of using findOne anad delete we use this 
    // it is like the save methode
//why do we user remove
//because if we remove product we need to remoce its reviews
// so we put a pre remove function to remove all the reviews asssocited wtih the product
//the delet many method won trigger the function
    await product.remove()

 res.status(StatusCodes.OK).json({msg:'sucessful product remove'})
}

const uploadImage = async(req,res)=>{
    /*
    the functionality goes like this 
    first we need to check if the image is ib=n req.files 'uploaded'
    the we check the file if its and image
    using mimetype
    the check the size 
    then we have the image
    so we create a path to the uplaods folder using path package 
    and we move it using mv function on the image object

    */
  const image= req.files.image
  if(!image){
    throw new CustomError.BadRequestError('No such file uploaded')
  }
  if(!image.mimetype.startsWith('image')){
    throw new CustomError.BadRequestError('Please Provide a image')

  }
  size=1024*1024
  if(image.size>size){
    throw new CustomError.BadRequestError('image size must be under 1MB')


}
imagepath=path.join(__dirname,'../public/uploads',`${image.name}`)
  await image.mv(imagepath)
  res.status(StatusCodes.OK).json({
    image:`uploads/${image.name}`
  })
}
module.exports={
createProduct,
deleteProduct,
getAllProducts,
getSingleProduct,
updateProduct,
uploadImage
}