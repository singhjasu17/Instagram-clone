const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const User=mongoose.model("User");
const bcryt=require('bcryptjs');
const keys=require('../config/keys');
const jwt=require('jsonwebtoken');
const secret_key=keys.SECRET_KEY;
const middleware=require('../middleware/middleware');
const nodemailer=require('nodemailer');
const sendgridTransport=require('nodemailer-sendgrid-transport')
const crypto=require('crypto')
const {api_user}=require('../config/keys')
const {api_key}=require('../config/keys')
const {EMAIL}= require('../config/keys')


//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
const transporter = nodemailer.createTransport(sendgridTransport({
    auth:
    {
        api_user,
        api_key
    }
}))
router.get('/protected',middleware,(req,res)=>
{
res.send("hello user");
})



router.post('/signup',(req,res)=>
{
    
    const{name,email,password,pic}=req.body;
  
    if(!email || !password || !name)
    {
        console.log("sg" + email+password+name);
        return res.status(422).send({error:"please complete all the fields"});
    }
    
    User.findOne({email:email}).then((saveUser)=>
    {
        if(saveUser){
        return res.status(422).send({error:"USer already Exists"});}
        bcryt.hash(password,12).then(hashedpassword=>
            {
                const user=new User({name,email,password:hashedpassword,pic});
        
                user.save().then(user =>
                    {
                        transporter.sendMail({
                            to:user.email,
                            from:"no-reply_instagramclone@byom.de",
                            subject:"signup access",
                            html:"<h1>Welcome to Instagram </h1>"
                        },(err,res)=>
                        {
                            if(err)
                            {console.log("g"+err)}
                        })
                        res.json({message:"Save"});
                    }).catch(err=>
                        {
                            console.log(err);
                        })
            }).catch(err=>
                {
                    console.log(err);
                })

    }).catch(err=>
        {
            console.log(err);
        });
    })

    router.post('/signin',(req,res)=>
    {
        const {email,password}=req.body;
        if(!email || !password)
        { return res.status(422).json({error:"Enter both email and password"});
    }
        User.findOne({email:email}).then(savedUser=>
            {
                if(!savedUser)
                {
                  return  res.status(422).json({error:"No user found"});
                }
                bcryt.compare(password,savedUser.password).then(domatch=>
                    {
                        if(domatch)
                        {
                            const token=jwt.sign ({id:savedUser._id},secret_key);
                            const {_id,name,email,following,followers,pic}=savedUser;
                            const user={_id,name,email,pic,following,followers}
                            return res.json({token:token,user});
                        }
                        else
                        {
                            return res.status(422).json({error: "incorrect password"});
                        }
                    }).catch(err=>
                        {
                            console.log(err);
                        })

            })
    })

router.post('/reset-password',(req,res)=>
{
    crypto.randomBytes(32,(err,buffer)=>
    {
        if(err)
        {
            console.log(err);
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email}).then(user=>
            {
                if(!user)
                {
                    return res.status(422).json({error:"User dont exists that email"})      
                }
                    user.resetToken = token
                     user.expireToken = Date.now() + 3600000
                     user.save().then((result)=>
                     {
                         transporter.sendMail({
                             to:user.email,
                             from:"no-reply_instagramclone@byom.de",
                             subject:"password reset",
                             html:`
                             <p>You requested for password reset</p>
                             <h5>Click in this <a href="${EMAIL}reset/${token}">link</a> </h5>
                                `
                         })
                         res.json({message:"Check your mail"});
                     })   
            })
    })
})

router.post('/Newpassword',(req,res)=>
{
    const newpassword=req.body.password;
    const {token}=req.body;
    if(!token)
    return res.json({error:"Enter new password"})

    User.findOne({resetToken:token,expireToken:{$gt:Date.now()}}).then(user=>
        {
            if(!user)
            {
                return res.status(422).json({error:"Try again session expired"})
            } 
            bcryt.hash(newpassword,12).then(hashedpassword=>
                {
                    user.password=hashedpassword;
                    user.resetToken=undefined;
                    user.expireToken=undefined;
                    user.save().then((saveduser)=>
                    {
                        res.json({message:"password updated success"})
                    })
                })
        }).catch(err=>
            {
                console.log(err)
            })
})

module.exports=router;
// Addison Kilback
// addison.kilback71@ethereal.email
// JBwsAKHRd791vQAKcF