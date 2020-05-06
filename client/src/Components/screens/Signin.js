import React,{useState,useContext} from 'react';
import {Link,useHistory} from 'react-router-dom';
import {UserContext} from '../../App'
const Signin = ()=>
{
    const {state,dispatch}=useContext(UserContext);
    const history=useHistory();    
    const  [password,setPassword]=useState("");
    const [email,setEmail]=useState("");
    const postData=()=>
    {

        if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
        {
            return console.log({error:"invalid email"});
        }
        fetch("/signin",{
            method:"post",
            headers:
            {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify(
            {
                    
                    email,
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
                    localStorage.setItem("jwt",data.token);
                    localStorage.setItem("user",JSON.stringify(data.user));
                    dispatch({type:"USER",payload:data.user}) 
                    console.log(data);
                    history.push('/');
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
    <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
    <button class="waves-effect waves-light btn #64b5f6 blue lighten-2" onClick={()=>postData()}>Login</button>
    <h5>
    <Link to="/signup">Don't have an account?</Link>
    </h5>
    </div>
</div>
)}

export default Signin;