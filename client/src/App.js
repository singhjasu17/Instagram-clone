import React,{useEffect,createContext,useReducer,useContext} from 'react';
import Navbar from './Components/Navbar'
import './App.css';
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import Home from './Components/screens/Home'
import Signup from './Components/screens/Signup'
import Signin from './Components/screens/Signin'
import Profile from './Components/screens/Profile'
import CreatePost from './Components/screens/CreatePost'
import {reducer,initialState} from './reducers/userReducer'
import UserProfile from './Components/screens/UserProfile'
import SuscribeUserPost from './Components/screens/SuscribeUserPost'
import Reset from './Components/screens/ResetPassword'
import Newpassword from './Components/screens/Newpassword'
   
export const UserContext=createContext();
let count=0;
const Routing = ()=>
{
  const history=useHistory();
  const {state,dispatch}=useContext(UserContext);
  useEffect(()=>
    {
      const user=JSON.parse(localStorage.getItem("user"));
      if(user)
      {
        dispatch({type:"USER",payload:user})
        
      }
      else
      {
        
        // history.push('/signin')
      }
    },[])

  return (
    <Switch>
   <Route exact path="/">
     <Home/>
   </Route>
   <Route path="/signin">
     <Signin/>
   </Route>
   <Route exact path="/profile">
     <Profile/>
   </Route>
   <Route path="/signup">
     <Signup/>
   </Route>
   <Route path="/Createpost">
     <CreatePost/>
   </Route>
   <Route path="/profile/:userid">
     <UserProfile/>
   </Route>
   <Route path="/myfollowingpost">
     <SuscribeUserPost/>
   </Route>
   <Route exact path="/reset">
     <Reset/>
   </Route> 
   <Route path="/reset/:token">
     <Newpassword/>
   </Route> 
</Switch>)
}
function App() {
  const [state,dispatch]=useReducer(reducer,initialState)
  
  return (
  <UserContext.Provider value={{state,dispatch}}>
  {console.log(count++)}
  <BrowserRouter>
  <Navbar/>
   <Routing/>
  </BrowserRouter> 
  </UserContext.Provider>
   )
}

export default App;
