const mongoose= require('mongoose')

const SingelCartItemSchema=mongoose.Schema({
    name:{type:String,required:true},
    image:{type:String,required:true},

    price:{type:Number,required:true},

    amount:{type:Number,required:true},
    product :{
        type:mongoose.Schema.ObjectId,
        ref:'Product',
        required:true
    }

})







const OrderSchema= new  mongoose.Schema({
    tax:{
        type:Number,
        required:true

    },
    shippingFee:{
        type:Number,
        required:true

    },
    subtotal:{
        type:Number,
        required:true,
        //the total for the cart item =price*quntity

    },
    total:{
        type:Number,
        required:true,
        //tax+shipping fee+subtotal

    },
    caretItems:[SingelCartItemSchema],
    //cartItems:[],
    //we can set cart items like this
    //or set it in a diffrent schem

    status:{
        type:String,
        enum:['pending','failed','paid','delivered','canceled'],
        default:'pending'

    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true,



    },
    clientSecret:{
        type:String,
        required:true,


    },
    paymentId:{
        type:String,

    },

},{timestamps:true,})
module.exports=mongoose.model('Order',OrderSchema)