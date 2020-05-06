import React,{useState,useEffect} from 'react';
import {Link,useHistory} from 'react-router-dom';

const Signup = ()=>
{
    const [name,setName]=useState("");
    const  [password,setPassword]=useState("");
    const [email,setEmail]=useState("");
    const [image,setImage]=useState("")
    const [url,setUrl]=useState(undefined)
    const history=useHistory();
useEffect   (()=>
{
    if(url)
    {
        uploadFields();
    }
},[url])
     const uploadPic= async ()=>
     {
        const data=new FormData();
        var res=null;
        data.append("file",image);
        data.append("upload_preset","insta-clone");
        data.append("cloud_name","instagramclone")
      try{ res=await  fetch("https://api.cloudinary.com/v1_1/instagramclone/image/upload",
        {
            method:"post",
            body:data
        })
    }catch(err)
    {
        console.log({error:"Cannot fetch from cloudinary"});
    }
        res=await res.json();
        await console.log(res);
        const uri=res.url;
        setUrl(uri);
        console.log(url);
      
     }
        const uploadFields=()=>
        {
            

        if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
        {
            return console.log({error:"invalid email"});
        }
        fetch("/signup",{
            method:"post",
            headers:
            {
                "Content-Type":"application/json"
            },
            body:JSON.stringify(
            {
                    name,
                    email,
                    password,
                    pic:url
            })
        }).then(res=>res.json()).then(data=>
            {
                if(data.error)
                {
                    console.log(data.error);
                }
                else
                {
                    console.log(data);
                    history.push('/signin');
                }
            }).catch(err=>
                {
                    console.log(err);
                })

        }
    const postData=()=>
    {   
        if(image)
        uploadPic();
        else
        uploadFields();
     }
    return (<div className="mycard">
    <div class="card auth-card input-field">

    <h2>Instagram</h2>
    <input type="text" placeholder="name" value={name} onChange={(e)=>setName(e.target.value)}/>
    <input type ="text" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
    <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
    <div className="file-field input-field">
        <div className="btn waves-effect waves-light btn #64b5f6 blue lighten-2">
            <span>Upload Image</span>
            <input type="file" onChange={(e)=>{setImage(e.target.files[0])}}/>
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
                </div>
                </div>
        
    <button class="waves-effect waves-light btn #64b5f6 blue lighten-2" onClick={()=>postData()}>Register</button>
    <h5>
        <Link to="/signin">Already Have an account?</Link>
    </h5> 

    </div>
</div>
)}

export default Signup;