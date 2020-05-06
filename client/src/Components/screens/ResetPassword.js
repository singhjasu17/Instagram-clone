import React,{useState,useContext} from 'react';
import {Link,useHistory} from 'react-router-dom';
const Reset = ()=>
{
    const history=useHistory();    

    const [email,setEmail]=useState("");
    const postData=()=>
    {

        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
        {
            return console.log({error:"invalid email"});
        }
        fetch("/reset-password",{
            method:"post",
            headers:
            {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify(
            {
                    
                    email
            })
        }).then(res=>res.json()).then(data=>
            {
                if(data.error)
                {
                    console.log(data.error);
                }
                else
                {

                    history.push('/signin');
                }
            }).catch(err=>
                {
                    console.log(err);
                })
    }
    return (<div className="mycard">
    <div class="card auth-card input-field">

    <h2>Instagram</h2>
    <input type ="text" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
    <button class="waves-effect waves-light btn #64b5f6 blue lighten-2" onClick={()=>postData()}>Reset Password</button>
  
    </div>
</div>
)}

export default Reset;