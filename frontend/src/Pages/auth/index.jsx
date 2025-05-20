import { React, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import victory from "../../assets/victory.svg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {appClient} from "@/lib/api-client";
import { LOGINROUTES, SIGNUPROUTES } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useappStore } from "@/store";

const App = () => {
  const navigate = useNavigate();
  const {setUserInfo} = useappStore();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [conpass, setConPass] = useState("");

  const validationchecksignup = ()=>{
    if(!email.length){
      toast.error("email is required");
      return false;
    }
    if(!pass.length){
      toast.error("password is required");
      return false;
    }
    if(pass !== conpass){
      toast.error("password and confirm password should be same");
      return false;
    }
    return true;
  }

  const validationchecklogin = ()=>{
    if(!email.length){
      toast.error("email is required");
      return false;
    }
    if(!pass.length){
      toast.error("password is required");
      return false;
    }
    return true;
  }

  const handleLogin = async () => {
     if(validationchecklogin()){
       //toast.success("login successfully");
       const response = await appClient.post(LOGINROUTES, {email , password : pass}, {withCredentials : true});
       if(response.data.user.id){
        setUserInfo(response.data.user);
        if(response.data.user.profilesetup) navigate("/chat");
        else navigate("/profile");
       }
       console.log(response);
     }
  };
  const handleSignup = async () => {
    if(validationchecksignup()){
      //toast.success("successfully done");
      const response  = await appClient.post(SIGNUPROUTES, {email ,password : pass}, {withCredentials:true});
      if(response.status===201){
        setUserInfo(response.data.user);
        navigate("/profile");
      }
      console.log(response);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center p-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      <div className="w-full max-w-[500px] bg-white bg-opacity-20 backdrop-blur-lg border-2 border-white text-opacity-90 shadow-2xl rounded-3xl flex flex-col items-center justify-center p-6 md:w-[80vw] md:max-w-[70vw] lg:max-w-[60vw]">
        {/* Welcome Section */}
        <div className="flex flex-col items-center justify-center text-center gap-4">
          <div className="flex items-center justify-center">
            <h1 className="text-4xl font-bold md:text-5xl text-black drop-shadow-lg">
              Welcome
            </h1>
            <img src={victory} alt="victory image" className="h-[60px] md:h-[80px]" />
          </div>
          <p className="font-medium pb-4 text-black drop-shadow-lg text-sm md:text-base">
            Stay connected, chat endlessly - Log in or create an account!
          </p>
        </div>

        {/* Tabs Section */}
        <div className="w-full flex items-center justify-center">
          <Tabs className="w-full" defaultValue="login">
            <TabsList className="bg-white bg-opacity-30 rounded-lg w-full flex justify-center">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-white text-black text-opacity-90 border-b-2 rounded-lg w-1/2 data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-white text-black text-opacity-90 border-b-2 rounded-lg w-1/2 data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-pink-500 p-3 transition-all duration-300"
              >
                Signup
              </TabsTrigger>
            </TabsList>

            {/* Login Section */}
            <TabsContent className="flex flex-col gap-4 mt-5" value="login">
              <Input
                placeholder="Enter email"
                type="email"
                className="rounded-full p-4 shadow-md bg-white bg-opacity-70"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Enter password"
                type="password"
                className="rounded-full p-4 shadow-md bg-white bg-opacity-70"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
              <Button
                className="rounded-full p-4 bg-purple-500 text-white font-bold hover:bg-purple-700 cursor-pointer transition-all duration-300 shadow-lg"
                onClick={handleLogin}
              >
                Login
              </Button>
            </TabsContent>

            {/* Signup Section */}
            <TabsContent value="signup" className="flex flex-col gap-4 mt-5">
              <Input
                placeholder="Enter email"
                type="email"
                className="rounded-full p-4 shadow-md bg-white bg-opacity-70"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Enter password"
                type="password"
                className="rounded-full p-4 shadow-md bg-white bg-opacity-70"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
              <Input
                placeholder="Confirm password"
                type="password"
                className="rounded-full p-4 shadow-md bg-white bg-opacity-70"
                value={conpass}
                onChange={(e) => setConPass(e.target.value)}
              />
              <Button
                className="rounded-full p-4 bg-pink-500 text-white font-bold hover:bg-pink-700 cursor-pointer transition-all duration-300 shadow-lg"
                onClick={handleSignup}
              >
                Signup
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default App;
