require('dotenv').config()
require('express-async-errors')
// express
const bodyPareser=require('body-parser')
const express=require('express')
const cookieParser=require('cookie-parser')
const expressFileUpload=require('express-fileupload')
/*
ofr the file uplad functionaltiy we can do it as cloudnairy 
or put it on server
in cloudnairy we use its pacakge and followed by v2
we use config methode on it and set the api keys 

for the local we just make the folde static


*/
const cors= require('cors')
//middelwware
const errorhandler=require('./middleware/error-handler')
const notfound=require('./middleware/not-found')

const morgan=require('morgan')
//Router
const authRouter=require('./routes/authRoutes')
const userRouter=require('./routes/userRoutes')
const productRouter=require('./routes/productRoutes')
const ReviewRouter=require('./routes/reviewRoutes')
const orderRouter= require('./routes/orderRoutes')
const app=express()
app.use(express.json())
app.use(bodyPareser.json())
app.use(
    bodyPareser.urlencoded({
      extended: true,
    }),
  );
  app.use(express.static('./public'))
  app.use(expressFileUpload())

//dotenv
///db
const connectToDb=require('./db/connect')

//setup express json
app.use(morgan('tiny'))
app.use(cookieParser(process.env.JWT_SECRET))
app.use(cors())
//get route

app.get('/api/v1/',(req,res)=>{
    console.log(req.signedCookies);
    res.send('The Home Page of ecommerce api ')
})
app.get('/',(req,res)=>{
    res.send('The Home Page of ecommerce api ')
})
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/users',userRouter)
app.use('/api/v1/products',productRouter)
app.use('/api/v1/reviews',ReviewRouter)
app.use('/api/v1/orders',orderRouter)

//errorhandler

app.use(notfound);
app.use(errorhandler)

const PORT= process.env.PORT||5000
const Start =async()=>{
    try {
         await connectToDb(process.env.MONGO_URI)
        app.listen( PORT,()=>{
            console.log(`server is listening on port ${PORT}...`);


        })
        
    } catch (err) {
        console.log(err);
    }
}
Start()