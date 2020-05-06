import React,{useState,useContext} from 'react';
import {Link,useHistory,useParams} from 'react-router-dom';

const Newpassword = ()=>
{
    const history=useHistory();    
    const  [password,setPassword]=useState("");
    const {token}=useParams();
    console.log(token);

    const postData=()=>
    {

        fetch("/Newpassword",{
            method:"post",
            headers:
            {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify(
            {
                    token,
                    password
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
    return (<div className="mycard">
    <div class="card auth-card input-field">
    <input type="password" placeholder="Enter new password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
    <button class="waves-effect waves-light btn #64b5f6 blue lighten-2" onClick={()=>postData()}>Update Password</button>
    </div>
</div>
)}

export default Newpassword;