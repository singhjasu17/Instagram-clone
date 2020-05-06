const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema.Types
const userSchema=new mongoose.Schema(
{
    name:
    {
        type:String,
        required:true
    },
    email:
    {
        type:String,
        required:true
    },
    
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}],
    
    resetToken:String,
    expireToken:Date,
    
    pic:{
    type:String,
    default:"https://res.cloudinary.com/instagramclone/image/upload/v1587629891/download_f5uwiz.jpg"
    },
    password:
    {
        type:String,
        required:true
    }

})
mongoose.model("User",userSchema);