import React,{useState,useEffect} from 'react';
import {Link,useHistory} from 'react-router-dom';


const CreatePost =()=>
{   
    var Image=null;
    const history=useHistory();
    const [title,setTitle]=useState("");
    const [body,setBody]=useState("");
    const [image,setImage]=useState("");
    const [url,setUrl]=useState("");
   useEffect(()=>
    {
        if(url)
        {
            fetch("/createpost",{
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    title,
                    body,
                    image:url
                })
            }).then(res=>res.json())
            .then(data=>{
        
               if(data.error){
                  console.log({error:data.error});
               }
               else{
                   console.log("Created post Successfully");
                   history.push('/');
               }
            }).catch(err=>{
                console.log(err)
            })
        }

    },[url])
        const postDetails = async()=>
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
                                
    return (<div className="card input-field" style={{margin:"5em auto",maxWidth:"500px",padding:"20px",textAlign:"center"}}>
        <input type="text"  placeholder="title" value={title} onChange={(e)=>setTitle(e.target.value)}/>
        <input type="text"  placeholder="body" value={body} onChange={(e)=>setBody(e.target.value)}/>
        <div className="file-field input-field">
        <div className="btn waves-effect waves-light btn #64b5f6 blue lighten-2">
            <span>Upload Image</span>
            <input type="file" onChange={(e)=>{setImage(e.target.files[0])}}/>
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
                </div>
                </div>
                <button class="waves-effect waves-light btn #64b5f6 blue lighten-2" onClick={()=>postDetails()}> Submit</button>
   
        

    </div>)
}
export default CreatePost