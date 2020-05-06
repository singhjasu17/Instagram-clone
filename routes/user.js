const mongoose=require('mongoose');
const Post=mongoose.model("Post");
const express=require('express');
const router=express.Router();
const middleware=require('../middleware/middleware');
const User=mongoose.model("User");

router.put('/updatepic',middleware,(req,res)=>
{
    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},(err,result)=>
    {
        if(err)
        {
            return res.status(422).json({error:"pic not post"})
        }
        return res.json(result)
    })
})
router.put("/follow",middleware,(req,res)=>
{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{new:true},(err,result)=>
    {
        if(err)
        {
            return res.status(422).json({error:err});
        }
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        },{new:true}).select("-password").then(result=>
            {
                console.log(result);
                res.json(result)
            }).catch(err=>
                {
                    return res.status(422).return({error:err});
                })
    })
})


router.put("/unfollow",middleware,(req,res)=>
{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{new:true},(err,result)=>
    {
        if(err)
        {
            return res.status(422).json({error:err});
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        },{new:true}).select("-password").then(result=>
            {
                console.log(result);
                res.json(result)
            }).catch(err=>
                {
                    return res.status(422).return({error:err});
                })
    })
})


router.get('/user/:id',middleware,(req,res)=>
{
    console.log("sd");
    User.findOne({_id:req.params.id}).select("-password").then(user=>
        {
Post.find({postedBy:req.params.id}).populate("postedBy", "_id name").exec((err,posts)=>
{
    if(err)
    {
       return  res.status(422).json({error:err});
    }
    console.log(posts)

return res.json({user,posts});
})
                
        }).catch(err=>
            {
             return   res.status(422).json({error:err});
            })
})
router.post('/search-users',(req,res)=>
{
    let userPattern=new RegExp("^"+req.body.query);
    User.find({email:{$regex:userPattern}}).then(user=>
        {

            res.json({user})    
        }).catch(err=>
            {
                console.log(err=>
                    {
                        console.log(err);
                    })
            })
})

module.exports=router