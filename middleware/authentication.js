const { json } = require('express')
const customeError= require('../errors/')
const {isTokenValid}=require('../utils/')
const authenticateUser = async(req,res,next)=>{
    const token= req.signedCookies.token
   if(!token){
    throw new  customeError.UnauthenticatedError("authenticattion1 invalid")
   }
   try {
    const {payload }= isTokenValid({token})
     console.log();
     req.user=payload
    next()
    //console.log(req.user);
   } catch (error) {
    throw new  customeError.UnauthenticatedError("authenticattion invalid")
    
   }
   //console.log(isTokenValid({token}));
   
}
const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        console.log(req.user);
      if (!roles.includes(req.user.role)) {
        throw new customeError.UnauthorizedError(
          'Unauthorized to access this route'
        );
      }
      next();
    };
  };
  
module.exports={authenticateUser, authorizePermissions}
