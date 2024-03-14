
const { string, func } = require('joi')


const mongoose= require('mongoose')


const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please provide rating'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Please provide review title'],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, 'Please provide review text'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  
  { timestamps: true }
);
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });
//we have pre save or remove and we have post 
//they are trigreed we update or delete using save remove methodes
//and create
//difrrence between statics and methodes
//methodes are created on instance product or reviews
//statics are created on the schema it self 
//we use the static method ion the schema
ReviewSchema.post('remove',async  function () {
    await this.constructor.calculateAverageRating(this.product)
  
})

ReviewSchema.post('save',async function () {
 // console.log('post save methode');
 await this.constructor.calculateAverageRating(this.product)

    
})
ReviewSchema.statics.calculateAverageRating=async function (productId) {
 //doing the aggregate pipling using code
    const result= await this.aggregate([
        //step 1:
        //mathcing
        {
            //matching on whate ever product id iam getting 
            $match:{product:productId},

        },
        {
            //this is the object we creating
            $group:{
                _id:null,
                averageRating:{$avg:'$rating'},
                numOFReviews:{$sum:1}
            },
        },
    ]);
    
    //console.log(result);
    //we need to set thes values we get from result to product
    //we use this.model to acess it
    //now we go to optional chainning
    
    //in order to call it in pi=ost we use this because irt refrence the model
    // weput it in try catch statment so if we don't find this product 
  
        
       
      
        
       
  try {
    await this.model('Product').findOneAndUpdate({
        _id:productId,
    },
    {//it is like a if statment 
        //if the average rating exsist go with it
        //else 0
        //same for number of reviews 
        averageRating:Math.ceil(result[0]?.averageRating || 0)
        ,
        numOFReviews:result[0]?.numOFReviews|| 0

    }
    
    );
  } catch (error) {
    
  }
};

module.exports = mongoose.model('Review', ReviewSchema);
