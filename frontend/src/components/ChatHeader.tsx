import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { setSelectedUser, selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="w-full p-3 flex items-center gap-3 border-b border-slate-200">
      <img
        src={selectedUser?.profilePic || "img/avatar.jpg"}
        alt={selectedUser?.fullName}
        className="size-12 object-cover rounded-full"
      />
      <div className="block text-left">
        <div className="font-medium truncate">{selectedUser?.fullName}</div>
        <div className="text-sm text-zinc-400">
          {selectedUser && onlineUsers.includes(selectedUser._id)
            ? "Online"
            : "Offline"}
        </div>
      </div>
      <button className="ml-auto" onClick={() => setSelectedUser(null)}>
        <X className="size-6" />
      </button>
    </div>
  );
};

export default ChatHeader;
