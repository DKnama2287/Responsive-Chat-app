import { useappStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Contactscontainer from "./Components/contacts-container";
import Emptychatcontainer from "./Components/empty-chat-container";
import Chatcontaiers from "./Components/chat-container";


const Chat = () => {
  const { userInfo, selectedChatType } = useappStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo?.profilesetup === false) {
      // ✅ Use optional chaining
      toast("Please setup profile to continue.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div  className="flex h-[100vh] text-white overflow-hidden" >
      <Contactscontainer />
      {
        selectedChatType === undefined ? <Emptychatcontainer/> : <Chatcontaiers/>
      }
    </div>
  );
};

export default Chat;
