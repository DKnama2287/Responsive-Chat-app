import ChatHeader from "./Components/Chat-Header";
import MeassageContainer from "./Components/Meassages-container";
import MeassagesBar from "./Components/Messages-bar";

const Chatcontaiers = () => {
  return (
    <div className="fixed top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1">
      {/* Chatcontainer */}
      <ChatHeader/>
      <MeassageContainer/>
      <MeassagesBar/>
    </div >
  )
}

export default Chatcontaiers;
