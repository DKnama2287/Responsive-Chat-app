import  {React,  useEffect, useState } from 'react'
import { Button } from './components/ui/button'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Auth from "./pages/auth";
import Chat from "./pages/chats";
import Profile from "./pages/profile";
import { useappStore } from './store';
import { appClient } from './lib/api-client';
import { GETUSERINFO } from './utils/constants';

const Privateroute = ({children}) =>{
  const {userInfo} = useappStore();
  const isauthunticated = !!userInfo;
  if(isauthunticated){
    return children;
  }else{
     return <Navigate to="/auth"/>
  }
}

const Authroute = ({children}) =>{
 const {userInfo} = useappStore();
 const isauthunticated = !!userInfo;
 if(isauthunticated){
    return <Navigate to="/chat"/>
 }else{
   return children;
 }
}

export default function App() {

  const {userInfo, setUserInfo} = useappStore();
  const [loading, setloading] = useState(true);

  useEffect(()=>{
    const getuserdata = async () =>{
      try {
        const response = await appClient.get(GETUSERINFO, {withCredentials : true,});
        //console.log({response});
        if(response.status === 200 && response.data.id){
          setUserInfo(response.data);
        }else{
          setUserInfo(undefined);
        }
        console.log({response});
      } catch (err) {
        setUserInfo(undefined);
        console.log(err)
      } finally {
        setloading(false);
      }
    };
    if(! userInfo){
      getuserdata();
    }else{
      setloading(false);
    }

  }, [userInfo, setUserInfo]);

  if(loading){
    return <div> Loading... </div>
  }

  return (
    <div>
      <BrowserRouter>
       <Routes>
        <Route path='/auth' element={
          <Authroute>
            <Auth/>
          </Authroute>
        }/>
        <Route path='/chat' element={
          <Privateroute>
            <Chat/>
          </Privateroute>
      }/>
        <Route path='/profile' element={
          <Privateroute>
            <Profile/>
          </Privateroute>
        }/>
        <Route path='*' element={<Navigate to='/auth'/>}/>
       </Routes>
      </BrowserRouter>
    </div>
  )
}
