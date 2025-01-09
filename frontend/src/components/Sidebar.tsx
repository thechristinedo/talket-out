import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Contact } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const sortedUsers = [...users].sort((a, b) => {
    const temp1 = onlineUsers.includes(a._id) ? 1 : 0;
    const temp2 = onlineUsers.includes(b._id) ? 1 : 0;
    return temp2 - temp1;
  });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="lg:w-80 w-20 bg-gray-200 h-full flex flex-col">
      <div className="flex flex-col items-center drop-shadow-sm shadow p-6">
        <div className="flex items-center gap-2 justify-center">
          <Contact className="size-6" />
          <p className="text-lg font-semibold lg:block hidden">Friends</p>
        </div>
      </div>

      <div className="overflow-y-auto w-full">
        {sortedUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 ${
              selectedUser?._id === user._id ? "bg-slate-300" : ""
            }`}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "img/avatar.jpg"}
                alt={user.fullName}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-2.5 bg-green-400 rounded-full ring-1 ring-green-500" />
              )}
            </div>

            <div className="hidden lg:block text-left">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
