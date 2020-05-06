import React,{useState,useEffect, useContext} from 'react';
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'
import Navbar from '../Navbar';
const Home = ()=>
{
    const [data,setData]=useState([]);
    const {state,dispatch}=useContext(UserContext);

    const deletePost=(postId)=>
    {
        fetch('/delete/'+postId,
        {
            method:"delete",
            headers:
            {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json()).then(result=>
            {
                const newData=data.filter(item=>
                    {
                        return item._id !== result._id; 
                    })
                    console.log(result);
                    setData(newData);
            })

    }

    const makeComment=(text,postId)=>
    {
        fetch("/comment",{
            method:"put",
            headers:
            {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                text,postId
            })
        }).then(res=>res.json()).then(result=>
            {
                const newData=data.map(item=>
                    {
                        if(item._id===result._id)
                        return result;
                        else
                        return item;
                    })
                console.log(result);
                setData(newData);
            }).catch(err=>
                {
                    console.log(err);
                })

    }
    const likePost =(id)=>
    {
        fetch("/like",{
            method:"put",
            headers:
            {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({postId:id})
        }).then(res=>res.json()).then(result=>
            {
                    const newData=data.map(item=>
                        {
                            if(item._id===result._id)
                            return result;
                            else
                            return item;
                        })
                    setData(newData);
            }).catch(err=>
                {
                    console.log(err);
                })
    }
    const unlikePost =(id)=>
    {
        fetch("/unlike",{
            method:"put",
            headers:
            {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
            ,body:JSON.stringify({postId:id})
        }).then(res=>res.json()).then(result=>
            {

                const newData=data.map(item=>
                    {
                        if(item._id===result._id)
                        return result;
                        else
                        return item;
                    })
                setData(newData);
            }).catch(err=>
                {
                    console.log(err);
                })
    }

    useEffect(()=>
    {
        fetch("/posts",{
            headers:
            {
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json()).then(result=>
            {
               
                
                setData(result);
            })

    },[])
    return (<div className="home">
                     {
                         data?
                         data.map(item=>
                            
                            {
                                console.log(item)
                               return(<div className="card home-card">
                                {<h5><Link to={item.postedBy._id == state._id?"/profile":"profile/"+item.postedBy._id}>{item.postedBy.name}</Link>{item.postedBy._id == state._id && <i className="material-icons"
                                style={{float:"right"}} onClick={()=>{deletePost(item._id)}}>delete</i>}</h5>}
                                <div className="card-image">
                                    <img src={item.image} alt="prof"/>>
                                </div>
                                <div className="card-content">
                                <i className="material-icons" style={{color:"red"}}>favorite</i>
                                {item.likes.includes(state._id)?<i className="material-icons" onClick={()=>unlikePost(item._id)}>thumb_down</i>
                                    :<i className="material-icons" onClick={()=>likePost(item._id)}>thumb_up</i>
                                }
                                    <h6>{item.likes.length} likes</h6>
                                    <h6>{item.title}</h6>
                                    <p>{item.body}</p>
                                    {
                                        item.comments.map(record=>
                                            {
                                                return (<h6 key={record._id}><span style={{fontWeight:"500px",fontSize:"1.15em"}}>{record.postedBy.name}&nbsp;</span>{record.text}</h6>)
                                            })
                                    }
                                    <form onSubmit={(e)=>
                                    {
                                        e.preventDefault();
                                        makeComment(e.target[0].value,item._id);

                                    
                                    }}>                                        <input type="text" placeholder="add a comment"/>
                                    </form>
                                    
                                </div>
                            </div>)
                            }):<Navbar/>
                     }
       


    </div>)
}

export default Home;