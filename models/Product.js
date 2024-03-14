const { string, func } = require('joi')
const mongoose= require('mongoose')
const productSchema=  new mongoose.Schema({
    name:{
        type:String,

        //essseintila if there any  white spcae will trim it 
        trime:true,
        required: [true,'Please Provide product name'],
        maxlength:[100,"name cannot be more than 100 charticars"]
    },
    price:{
        type:Number,
        required: [true,'Please Provide product price'],
        default:0,
        
    },
    description:{
        type:String,
        required: [true,'Please Provide product description'],
        maxlength:[1000,"description cannot be more than 1000 charticars"]

    },
    image:{
        type:String,
        // this default will poin to an image in server when the client doesn't provide image
        default:'/uploads/example.png',
        
    },
    category:{
        type:String,
        required: [true,'Please Provide product category'],
        //array of possible values the values are string 

        enum:['office','kitchen','bedroom'],
        
    },
    company:{
        type:String,
        required: [true,'Please Provide product company '],
        enum:{
            //pssible values
            values:['ikea','liddy','marcos'],
            //when i send a product company that is not in this array i will get those values
            message:`{VALUE} is not supported`
        }
    },
    colors:{
        // a list of strings
        type:[String],
        required:true,
        default:['#222']
        
    },
    featured:{
        type:Boolean,
        default:false,
    },
    freeShipping:{
        type:Boolean,
        default:false,

    },
    inventory:{
        type:Number,
        required:true,
        default:15


    },
    averageRating:{
        type:Number,
       
        default:0

    },
    numOFReviews:{
        type:Number,
      
        default:0
    },  
    user:{
        //point my user model 
        // 
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true,
        

    },
    
    
// getting all the reviews that associted with the product 
//so we need mongoose virtulas becaus we don't have reviews propert in product
//mongoose virtulas:propertie that do not persist
//not stored in the database
//only the exsist logiclaay
//steps:
/*
1-where we have time stamps
, tojson:{} and we need to include virtuals:true property
also toobject
we setup model to accept virtuals
the productscchem.virtuals
ref:model
local field:the connection between the two
forieng in thr reviews
i wantt a list 
so jusoOne false
we can't do any queries on it because it is not actuall rproperty



*/

},{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}},)
productSchema.virtual('reviews',{
    ref:'Review',
    localField:'_id',
    foreignField:'product',
    justOne:false
})
productSchema.pre('remove',async function(next) {
    // we can acess difrren model usnig this.model(mdelname)
    await this.model('Review').deleteMany({
        product:this._id
    })
    //Aggregation Pipeline
    //we need it to update average reting
    //automatically when we create update remove reviews
    //go to reviews model

})
module.exports=mongoose.model('Product',productSchema)