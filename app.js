const express=require('express');
const app=express();
const PORT = process.env.PORT || 5000;
const {MONGOURL}=require('./config/keys');
const mongoose=require('mongoose');
require('./models/user');
require('./models/post');

app.use(express.json());

const routes=require('./routes/auth');
const postRoutes=require('./routes/post');
app.use(postRoutes);
app.use(routes);
const userRoutes=require('./routes/user')
app.use(userRoutes)


const customMiddleware=(req,res,next)=>
{
    console.log(" middleware executed!");
    next();
}
mongoose.connect(MONGOURL,{useNewUrlParser:true,useUnifiedTopology:true});
mongoose.connection.on('connected',()=>
{
    console.log(" Connected");
    })
    mongoose.connection.on('error',()=>
    {
        console.log("error");
    })
    if(process.env.NODE_ENV=="production")
    {
        app.use(express.static('client/build'));
        const path=require('path')
        app.get("*",(req,res)=>
        {
            res.sendFile(path.resolve(__dirname,'client','build','index.html'))

        })
    }
    
app.listen(PORT,()=>
{
    console.log("Server is running on",PORT);
})

//3453S7Fe0xOTrda5 