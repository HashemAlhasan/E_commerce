const User=require('../models/User')
const {StatusCodes}=require('http-status-codes')
const CustomError=require('../errors/index')
//const jwt= require('jsonwebtoken')
const {attachCookiesToResponse,createTokenUser}=require('../utils')
const register = async(req,res)=>{
const {email,name,password}=req.body
const emailIsAlreadyExsist=await User.findOne({email})
if(emailIsAlreadyExsist){
    throw new CustomError.BadRequestError('Email Is Already Exsist ')
}
const isFirstAccount= await User.countDocuments({})===0;
const role =isFirstAccount?'admin':'user'
    const user =await User.create({email,name,password,role})
    const tokenUser=createTokenUser(user)
 
 attachCookiesToResponse({res,user:tokenUser})
//    res.cookie('token',token,{
//     httpOnly:true,
//     expries: new Date(Date.now())+oneDay

//    })

    res.status(StatusCodes.CREATED).json({user:tokenUser})
    

}
const login=async(req,res)=>{
const {email,password,name}= req.body
 if(!email||!password){
throw new CustomError.BadRequestError('Please Provide Email And Passowrd')

}
const user =await User.findOne({email}
)
if(!user) {
    throw new CustomError.UnauthenticatedError('invalid credential  ')
}
const isPassowrdCorrect= await user.comparePassowrd(password)
if(!isPassowrdCorrect){
    throw new CustomError.UnauthenticatedError('passowrd incorrect')
}
const tokenUser= createTokenUser(user)
attachCookiesToResponse({res,user:tokenUser})
res.status(StatusCodes.OK).json({tokenUser})
}
const logout=async(req,res)=>{
    res.cookie('token',"token",{
            httpOnly:true,
            exprires: new Date(Date.now())
        
           })
           res.status(StatusCodes.OK).send('user loged out')
}
module.exports={
    register,
    login,
    logout,
}