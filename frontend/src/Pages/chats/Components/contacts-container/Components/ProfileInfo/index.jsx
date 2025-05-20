import { getColor } from "@/lib/utils";
import { useappStore } from "@/store";
import { HOST, LOGINROUTES, LOGOUTURL } from "@/utils/constants";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { IoPowerSharp } from "react-icons/io5";
import { appClient } from "@/lib/api-client";

const ProfileInfo = () => {
  const { userInfo, setUserInfo } = useappStore();

  const navigate = useNavigate();

  const LogOut = async () =>{

    try {

        const response  = await appClient.post(LOGOUTURL, {}, {withCredentials : true});
        if(response.status===200){
            navigate("/auth");
            setUserInfo(null);
        }
        
    } catch (error) {
        console.log(error)
    }

  }

  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33] ">
      <div className="flex items-center justify-center gap-3">
        <div className="h-12 w-12 relative">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}${userInfo.image}`}
                alt="profile"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                  userInfo.color
                )}`}
              >
                {userInfo.firstname
                  ? userInfo.firstname.charAt(0).toUpperCase()
                  : userInfo.email.charAt(0).toUpperCase()}
              </div>
            )}
          </Avatar>
        </div>
        <div>
          {userInfo.firstname && userInfo.lastname
            ? `${userInfo.firstname} ${userInfo.lastname}`
            : ""}
        </div>
      </div>
      <div className="flex gap-5 ">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
                <FiEdit2  className="text-purple-500 text-xl font-medium cursor-pointer" onClick={()=>navigate('/profile')} />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              Edit Profile
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
                <IoPowerSharp  className="text-red-500 text-xl font-medium cursor-pointer" onClick={LogOut} />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              Log Out
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
