const mongoose=require('mongoose');
const Post=mongoose.model("Post");
const express=require('express');
const router=express.Router();
const middleware=require('../middleware/middleware');

router.get('/posts',middleware,(req,res)=>
{
    Post.find().populate("postedBy", "_id name").populate("comments.postedBy","_id name").then(user=>
        {
            res.json(user);
        }).catch(err=>
            {
                console.log(err);
            })

})


router.get('/myPosts',middleware,(req,res)=>
{
    Post.find({postedBy:req.user._id}).populate("postedBy","id name").then(posts=>
        {
            res.json(posts);
        }).catch(err=>
        {
            console.log(err);
        })
})
router.put('/like',middleware,(req,res)=>
{
    Post.findByIdAndUpdate(req.body.postId,
        {
            $push:{likes:req.user._id}
        },
        {
            new:true
        }).exec((err,result)=>
        {
            if(err)
            {
                res.status(422).json({error:err});
            }
            else{
                res.json(result);
            }
        })
})
router.put('/unlike',middleware,(req,res)=>
{
    Post.findByIdAndUpdate(req.body.postId,
        {
            $pull:{likes:req.user._id}
        },
        {
            new:true
        }).exec((err,result)=>
        {
            if(err)
            {
                res.status(422).json({error:err});
            }
            else{
                res.json(result);
            }
        })
})

router.delete('/delete/:postId',middleware,(req,res)=>
{
    Post.findOne({_id:req.params.postId}).populate("postedBy","_id").
    exec((err,post)=>
    {
        if(err || !post)
        {
            return res.status(422).json({error:err});
        }
        console.log(post.postedBy._id +""+req.user._id)
        if(post.postedBy._id.toString() === req.user._id.toString())
        {
            post.remove().then(result=>
                
                {
                    res.json(result)
                }).catch(err=>
                    {
                        console.log(err);
                    })
        }
    })
})

router.put('/comment',middleware,(req,res)=>
{
    const comment={
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,
        {
            $push:{comments:comment}
        },
        {
            new:true
        }).populate("comments.postedBy","_id name").populate("postedBy","_id name").exec((err,result)=>
        {
            console.log("err")
            if(err)
            {
                res.status(422).json({error:err});
            }
            else{
                res.json(result);
            }
        })
})
router.get('/subpost',middleware,(req,res)=>
{
    Post.find({postedBy:{$in:req.user.following}}).populate("postedBy","_id name").then(posts=>
        {
            res.json({posts})
        }).catch(err=>
            {
                console.log(err);
            })
})
router.post('/createPost',middleware,(req,res)=>
{

const {title,body,image}=req.body;
if(!title || !body || !image)
{
    
    return res.send({error:"Incomplete title, body or image"+title+body+image});
}
const post = new Post({
    title,body,image,postedBy:req.user
})
post.save().then(result=>
    {
        res.json({post:result})
        console.log(result);
    }).catch(err=>
        {
            console.log(err);
        })
})

module.exports=router;