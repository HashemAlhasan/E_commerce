const Order = require('../models/Order');
const Product = require('../models/Product');

const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {checkPermission} = require('../utils')

const fakeStripeAPI=async({amount,currency})=>{
   const  clientSecret='someRandomValue'
    return {amount,clientSecret}
}


const createOrder = async(req,res)=>{
   const {items:cartItems , tax ,shippingFee}=req.body
   if(!cartItems || cartItems.length <1 ){
    throw new CustomError.BadRequestError("No cart items provided")
   }
   if(!tax || !shippingFee){
    throw new CustomError
    .BadRequestError("Please provide tax and shipping fee")
   }
   let orderItems=[];
   let subtotal=0;
   for(const item of cartItems){
    const dbproduct= await Product.findOne({_id:item.product})
    if(!dbproduct){
        throw new CustomError.NotFoundError(`no product with id ${item.product}`)

    }
    const {name,price ,image, _id}=dbproduct
    const singleItem ={amount:item.amount,
        name,
        price,
        image,
        product:_id
    }
    orderItems=[...orderItems , singleItem]
    subtotal+=item.amount*price



   }
  const  total =subtotal+tax+shippingFee
   const paymentIntent= await fakeStripeAPI({
    amount:total,
    currency:'usd'
   })
   const order= await Order.create({
    tax,shippingFee,subtotal,total,caretItems:orderItems,user:req.user.userId,
    clientSecret:paymentIntent.clientSecret
   })
   res.status(StatusCodes.CREATED).json({order,clientSecret:paymentIntent.clientSecret})

}
const getAllOrders = async(req,res)=>{
    const orders=await Order.find({})
    res.status(StatusCodes.OK).json(orders)

}
const getSingleOrder = async(req,res)=>{
    const {id:orderId}= req.params
    const order = await Order.find({_id:orderId})
    if(!order){
        throw new CustomError.BadRequestError(`mo 
        order with id ${orderId}`)
    }
    checkPermission(req.user,order.user)
      res.status(StatusCodes.OK).json(order)
    
}
const getCurrentUserOrders = async(req,res)=>{
    const orders =await Order.find({user:req.user.userId})
    res.status(StatusCodes.OK).json(orders)
}
const updateOrder = async(req,res)=>{
    const {_id :orderId}= req.params
    const {paymentIntentId}= req.body

    const order= await Order.findOne({_id:orderId})
    if(!order){
        throw new CustomError.BadRequestError('No Such Order')
    }
    checkPermission(req.user,order.user)
    order.status='paid'
    order.paymentId=paymentIntentId
   await  order.save()
    res.json(StatusCodes.OK).json(order)

}
module.exports={
    createOrder,
    getAllOrders,
    getCurrentUserOrders,
    getSingleOrder,
    updateOrder,

    

}