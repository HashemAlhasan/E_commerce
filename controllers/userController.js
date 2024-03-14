const { default: mongoose } = require('mongoose')
const User= require('../models/User')
const{ReasonPhrases,StatusCodes}=require('http-status-codes')
const customeError =require('../errors')
const { createTokenUser,attachCookiesToResponse,checkPermission } = require('../utils')



const getAllUsers= async(req,res)=>{
    const users= await User.find({role:'user'},{password:0})
//    const users= await User.find({role:'user'}).select(-passowrd)

    res.status(StatusCodes.OK).json({users,nHits:users.length})
    
    
}
const getSingleUser= async(req,res)=>{
   const id = req.params.id
   
   const user = await User.findOne({_id:id},{password:0})
   if(!user){
    throw new customeError.NotFoundError(`no user with ${id}`)
   }
   console.log(req.user);
   checkPermission(req.user,user._id)
   res.status(StatusCodes.OK).json({user})
}
const showCurrentUser= async(req,res)=>{
    res.status(StatusCodes.OK).json({user:req.user})
}
//update user
/*const updateUser= async(req,res)=>{
    const {email,name}=req.body
    if(!email||!name){
        throw new customeError.BadRequestError('Please Provide Both Values')
    }
    const user = await User.findOneAndUpdate({_id:req.user.userId},{email,name},{new:true,runValidators:true})
    const tokenUser=createTokenUser(user)
    attachCookiesToResponse({res,user:tokenUser})
    res.status(StatusCodes.OK).json({user:tokenUser})
   }*/
   const updateUser= async(req,res)=>{
    const {email,name}=req.body
    if(!email||!name){
        throw new customeError.BadRequestError('Please Provide Both Values')
    }
    const user =await User.findOne({_id:req.user.userId})
    user.name=name
    user.email=email
    await user.save()

    const tokenUser=createTokenUser(user)
    attachCookiesToResponse({res,user:tokenUser})
    res.status(StatusCodes.OK).json({user:tokenUser})
   }
const updateUserPassword= async(req,res)=>{
    const {oldPassowrd,newPassword}=req.body
    if(!oldPassowrd||!newPassword){
     throw new customeError.BadRequestError("please provide poth values")
 
    }
    const user= await User.findOne({_id:req.user.userId})
    const isPassowrdCorrect= await user.comparePassowrd(oldPassowrd)
    if(!isPassowrdCorrect){
     throw new customeError.UnauthenticatedError('invalid creadentials ')
    }
    user.password= newPassword
   await user.save()
   res.status(StatusCodes.OK).json({msg:'updated sucessfuly'})
 
}
module.exports={
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}