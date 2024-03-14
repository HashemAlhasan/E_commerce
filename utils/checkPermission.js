const customeError=require('../errors/')
const checkPermission= (requsetUser,resourceId)=>{
    //  console.log(requsetUser,resourceId);
    if(requsetUser.role==='admin') return;
    if(requsetUser.userId===resourceId.toString()) return
    throw new customeError.UnauthorizedError('not authorized ')
    // return
}
module.exports={checkPermission}