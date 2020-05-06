import React,{useEffect, useState,useContext} from 'react';
import {UserContext} from '../../App'
const Profile = ()=>
{
    const [mypics,setPics]=useState([])
    const {state,dispatch}=useContext(UserContext);
    const[image,setImage]=useState("")
    const [url,setUrl]=useState(undefined )
    useEffect(()=>
    {fetch("/myPosts",
    {
      headers:
      {
          "Authorization":"Bearer "+localStorage.getItem("jwt")
      }  
    }).then(res=>res.json()).then(result=>
        {

                setPics(result);
        })

    },[])
    useEffect( ()=>
    {
        if(image)
        {const data = new FormData()
            data.append("file",image)
            data.append("upload_preset","insta-clone")
            data.append("cloud_name","instagramclone")
            fetch("https://api.cloudinary.com/v1_1/instagramclone/image/upload",{
                method:"post",
                body:data
            })
            .then(res=>res.json())
            .then(data=>{
        
           setUrl(data.url)
           fetch("/updatepic",{
               method:"put",
               headers:
               {
                   "Content-Type":"application/json",
                   "Authorization":"Bearer "+localStorage.getItem("jwt")
               },
               body:JSON.stringify
               (
               {
                    pic:data.url
               })
           }).then(res=>res.json()).then(result=>
            {
                console.log(result)
                dispatch({type:"UPDATEPIC",payload:result.url})
                localStorage.setItem("user",JSON.stringify({...state,pic:result.url}))
              
            })
            })
            .catch(err=>{
                console.log(err)
            }) 
        }

    },[image])
    const updatePhoto=async (file)=>
    {
        setImage(file);
      
     }
    
    return (
        <div style={{maxWidth:"700px",margin:"0 auto"}}>
            <div style={{margin:" 18px 0",borderBottom:" 1px solid grey"}}>
            <div style={{display:"flex" ,justifyContent:"space-around"}}>
               <div>
                <img style={{width:"160px",height:"160px",borderRadius:"80px"}} src={state?state.pic:"loading"} alt="loading pic" />
                

               </div>
               <div>
                <h4>{state?state.name:"loading"}</h4>
                   <h5>{state?state.email:"loading"}</h5>
                
                <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                    <h6>{mypics.length}&nbsp;posts</h6>
                    <h6>{state?state.followers.length:"0"}&nbsp;followers</h6>
                
                    <h6>{state?state.following.length:"0"}&nbsp;following</h6>    
                </div>
                </div>
            </div>
            <div className="file-field input-field" style={{margin:"10px"}}>

            <div className="btn waves-effect waves-light btn #64b5f6 blue lighten-2">
            <span>Update Image</span>
            <input type="file" onChange={(e)=>{updatePhoto(e.target.files[0])}}/>
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
                </div>
                </div>
            
            </div>
            <div className="gallery" >
                
               {
                   mypics.map(item=>
                   { 
                   return <img key={item._id} className="item" src={item.image} />
                    
                })
                   }
                

            </div>
        </div>
    );
}

export default Profile;