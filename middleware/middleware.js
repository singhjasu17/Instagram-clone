const mongoose=require('mongoose');
const User=mongoose.model("User");
const express=require('express');
const router=express.Router();
const jwt=require('jsonwebtoken');
const keys=require('../config/keys');
const key=keys.SECRET_KEY;
module.exports= async (req,res,next)=>
{
    const {authorization}=req.headers;
    console.log(authorization);
    if(!authorization)
    {
        return res.status(401).send({error:"U are not authorized to access this resource"});
    }
    const token=authorization.replace("Bearer ","");
    var payload=null;
   try{ payload=await jwt.verify(token,key);}
   catch(err)
   {
      return res.send({error:token});
   }
    if(!payload)
    {
            return res.status(401).send({error:"U are not authorised to access this resource"});
    }
    const _id=payload.id;
    const user=await User.findById(_id);
    req.user=user;
    console.log(req)
    next();

}
