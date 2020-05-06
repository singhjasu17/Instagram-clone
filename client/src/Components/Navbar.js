import React, { useContext ,useRef,useEffect,useState} from 'react';
import {UserContext} from '../App'
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css'
import { stat } from 'fs';

const Navbar=()=>
{
  const [search,setSearch]=useState("")
  const [userDetails,setUserDetails]=useState([])
  const searchModal=useRef(null)
  const history=useHistory();
  const {state,dispatch}=useContext(UserContext);
  useEffect(()=>
  {
        M.Modal.init(searchModal.current)
  },[])
  const renderList=()=>
  {
    if(state)
    {
      return[
        <li><i class="large material-icons modal-trigger" data-target="modal1" style={{color:"black"}}>search</i></li>, <li><a href="/profile">Profile</a></li>,
      <li><a href="/CreatePost">Create Post</a></li>,
      <li><a href="/myfollowingpost">My following posts</a></li>,
      <li>
            <button class="btn #c62828 red darken-3" onClick={()=>{localStorage.clear();dispatch({type:"CLEAR"})}}>Logout</button>

      </li>
    ]
    }
    else
    {
      return [
        <li><a href="/signin">Login</a></li>,
        <li><a href="/signup">Signup</a></li>

      ]
    }
  }
  const fetchUsers=(query)=>
  {
    setSearch(query)
    fetch('/search-users',{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },body:JSON.stringify({
          query
      })
    }).then(res=>res.json()).then(results=>
      {
        console.log(results)
        setUserDetails(results.user)
      })
  }
    return (
<nav>
    <div class="nav-wrapper">
      <Link to={state?"/":"/signin"} class="brand-logo">Instagram</Link>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
       {renderList()}
         
      </ul>
    </div>
          <div id="modal1" class="modal" ref={searchModal} style={{color:"black"}}>
          <div className="modal-content">
          <input type ="text" placeholder="email" value={search} onChange={(e)=>fetchUsers(e.target.value)}/>
            <ul className="collection" style={{color:"black"}}>
            {
              userDetails.map(item=>
                {
                  return <Link to={item._id !== state._id ? "/profile/"+item._id : '/profile'} onClick={()=>
                  {
                    M.Modal.getInstance(searchModal.current).close()
                    setSearch(''); 
                  }}><li className="collection-item">{item.email}</li></Link>
                })
            }
              </ul>
          </div>
          <div className="modal-footer">
            <button href="#!" class="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch("  ")}>close</button>
          </div>
        </div>
  </nav>
        
    )
}
export default Navbar;