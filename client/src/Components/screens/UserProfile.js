import React,{useEffect, useState,useContext} from 'react';
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom' 
const Profile = ()=>
{

    const [userProfile,setProfile]=useState(null)
     
    const {state,dispatch}=useContext(UserContext);
   console.log(state)
    const {userid}=useParams()
    const [showFollow,setFollow]=useState(state?!state.following.includes(userid):true)
    
    console.log(state)

    useEffect(()=>
    {fetch(`/user/${userid}`,
    {
      headers:
      {
          "Authorization":"Bearer "+localStorage.getItem("jwt")
      }  
    }).then(res=>res.json()).then(result=>
        {

                setProfile(result);
        })

    },[])

    const followUser=()=>
    {
        fetch("/follow",{
            method:"put",
            headers:
            {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt") 
            },
            body:JSON.stringify(
                {
                    followId:userid
                }
            )
        }).then(res=>res.json()).then(data=>{
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevstate)=>
            {
                return {...prevstate,
                    user:{...prevstate.user,
                    followers:[...prevstate.user.followers,data._id]}
            }})
            console.log(data);
            setFollow(false)
        }).catch(err=>
            {
                console.log(err);
            })
    }
    const unfollowUser=()=>
    {
        fetch("/unfollow",{
            method:"put",
            headers:
            {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt") 
            },
            body:JSON.stringify(
                {
                    unfollowId:userid
                }
            )
        }).then(res=>res.json()).then(data=>{
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevstate)=>
            {
                const newFollower = prevstate.user.followers.filter(item=>item != data._id )
                
                return {...prevstate,
                    user:{...prevstate.user,
                    followers:newFollower}
            }})
            console.log(data);
            setFollow(true)
        }).catch(err=>
            {
                console.log(err);
            })
    }


    return (
        <>
        {userProfile?
        <div style={{maxWidth:"700px",margin:"0 auto"}}>
            <div style={{display:"flex" ,justifyContent:"space-around",margin:" 18px 0",borderBottom:" 1px solid grey"}}>
               <div>
                <img style={{width:"160px",height:"160px",borderRadius:"80px"}} src={userProfile.user.pic} />
               </div>
               <div>
                <h4>{userProfile.user.name}</h4>
                <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                    <h6>{userProfile.posts.length}</h6>
                    <h6>{userProfile.user.followers.length}&nbsp;</h6>
                    <h6>{userProfile.user.following.length}&nbsp;</h6>    
                </div>
                {showFollow?
                <button style={{margin:"10px"}} class="waves-effect waves-light btn #64b5f6 blue lighten-2" onClick={()=>followUser()}>follow</button>
                :<button style={{margin:"10px"}}  class="waves-effect waves-light btn #64b5f6 blue lighten-2" onClick={()=>unfollowUser()}>unfollow</button>
                }</div>
            </div>
            <div className="gallery" >
                
               {
                     userProfile.posts.map(item=>
                   { 
                   return <img key={item._id} className="item" src={item.image} />
                    
                })
                   }
                

            </div>
        </div>:<h1>Loading</h1>}
        </>
    );
}

export default Profile;