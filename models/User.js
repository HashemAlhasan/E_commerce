const mongoose=require('mongoose')
const validator=require('validator')
const bycrypt=require('bcryptjs')
const userSchema= new mongoose.Schema({
name:{
    type:String,
    required: [true,'Please Enter The User Name'],
    minlength:3,
    maxlength:50
},
email:{
    type:String,
    unique:true,
    required: [true,'Please Enter The Email'],
    validate:{
        validator:validator.isEmail,
        message: 'Please provide a valid email X'
    }
},
password:{
    type:String,
    required: [true,'Please Enter The Passowrd'], 
    minlength:6
},
role:{type:String, 
    enum:['admin','user'],
    default:'user'
}

})//we use the function keyword because in that way it will points to the user unlike the attow function
userSchema.pre("save",async function(){
    if(!this.isModified('password')) return;
    
    const salt=await bycrypt.genSalt(10)
    this.password=await bycrypt.hash(this.password,salt)
//    console.log(this.modifiedPaths());
  //  console.log(this.isModified('password'));

})
userSchema.methods.comparePassowrd=async function(canditatePassword){
    const isMatch=await bycrypt.compare(canditatePassword,this.password)
    return isMatch


}
module.exports=mongoose.model('User',userSchema )