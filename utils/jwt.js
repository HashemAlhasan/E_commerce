const jwt = require('jsonwebtoken')
const createToken= ({payload})=>{
const token= jwt.sign({payload},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
return token

}
const isTokenValid=({token})=>jwt.verify(token,process.env.JWT_SECRET)

const attachCookiesToResponse=({res,user})=>{
    const token = jwt.sign({payload:user},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
    const oneDay=1000*60*60*24
    res.cookie('token',token,{
        httpOnly:true,
        expries: new Date(Date.now())+oneDay,
        secure:process.env.NODE_ENV==='production',
        signed:true
    
       })
     
    

}
module.exports={
    createToken,
    isTokenValid,
    attachCookiesToResponse
}