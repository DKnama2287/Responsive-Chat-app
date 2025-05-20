import { useappStore } from "@/store";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { appClient } from "@/lib/api-client";
import { ADDPROFILEIMAGE, HOST, REMOVEPROFILEIMAGE, UPDATEPROFILE } from "@/utils/constants";
import { useEffect } from "react";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useappStore();

  const [firstname, setFirstname] = useState(userInfo?.firstname || "");  
  const [lastname, setLastname] = useState(userInfo?.lastname || "");
  const [selectedColor, setSelectedColor] = useState(userInfo?.color || 0);

  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const  fileinputref = useRef(null);

  useEffect(() => {
    if (userInfo?.profilesetup) {
      setFirstname(userInfo.firstname || "");  // Ensure it's always a string
      setLastname(userInfo.lastname || "");
      setSelectedColor(userInfo.color ?? 0);   // Ensure it's always a number
    }
    if (userInfo.image) {
      setImage(`${HOST}${userInfo.image}`);
    }
    
  }, [userInfo]);
  
  const validateprofile = ()=>{
    if(! firstname){
      toast.error("First name is required");
      return false;
    }
    if( ! lastname){
      toast.error("Last name is required");
      return false;
    }
    return true;
  }

  const saveChanges = async () => {
    if(validateprofile()){
      //alert("complete set up");
      try {
        const response = await appClient.post(UPDATEPROFILE, { firstname, lastname, color : selectedColor}, {withCredentials : true});
        if(response.status===200 && response.data){
          setUserInfo({...response.data});
          toast.success("profile updated successfully");
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const handlenavigate = async () =>{
    if(userInfo.profilesetup){
      navigate("/chat");
    }else{
      toast.error("please setup profile first.");
    }
  }

  const handlefileinputclick = ()=>{
    fileinputref.current.click();
  }

  const handleImagechange = async (event) =>{
    const file  = event.target.files[0];
    console.log({file});
    if(file){
      const formdata = new FormData();
      formdata.append("profile-image", file);
      const response = await appClient.post(ADDPROFILEIMAGE, formdata, { withCredentials : true});
      if(response.status===200 && response.data.image){
        setUserInfo({...userInfo, image : response.data.image});
        toast.success("Image updated successfully.");
      }
    }
  }

  const Deleteimage = async() =>{
    try {
      const response = await appClient.post(REMOVEPROFILEIMAGE, null,  {withCredentials : true});
      if(response.status===200){
        setUserInfo({...userInfo, image : null});
        toast.success("Image removed successfully");
        setImage(null);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={handlenavigate}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                    selectedColor
                  )}`}
                >
                  {firstname
                    ? firstname.charAt(0).toUpperCase()
                    : userInfo.email.charAt(0).toUpperCase()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 ring-fuchsia-50 cursor-pointer"
                onClick={ image ? Deleteimage : handlefileinputclick}  >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input type="file" ref={fileinputref} className="hidden" onChange={handleImagechange} name="profile-image" accept=".png , .jpg , .jpeg , .svg , .webp"/>
          </div>
          <div className="flex min:-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="First name"
                type="text"
                onChange={(e) => setFirstname(e.target.value)}
                value={firstname}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Last name"
                type="text"
                onChange={(e) => setLastname(e.target.value)}
                value={lastname}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full flex gap-5 ">
              {colors.map((color, index) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                    selectedColor === index ? "outline outline-white" : ""
                  }`}
                  key={index}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300" onClick={saveChanges}> Save changes</Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
