import ChatBox from "../components/ChatBox";
import EmptyChatBox from "../components/EmptyChatBox";
import Sidebar from "../components/Sidebar";
import { useChatStore } from "../store/useChatStore";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    // <div className="min-h-screen pt-16 flex items-center justify-center">
    <div className="h-[calc(100vh-4rem-2px)] flex items-center justify-center">
      {/* <div className="bg-gray-100 max-w-7xl rounded-lg drop-shadow-lg flex w-full h-[calc(100vh-8rem)]"> */}
      <div className="bg-gray-100 max-w-7xl flex w-full h-[calc(100vh-4rem-2px)] xl:h-[calc(100vh-8rem)] xl:mx-8">
        <Sidebar />
        {selectedUser ? <ChatBox /> : <EmptyChatBox />}
      </div>
    </div>
  );
};

export default HomePage;
