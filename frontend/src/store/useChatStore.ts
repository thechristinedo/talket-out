import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import axios from "axios";

type User = {
  _id: string;
  email: string;
  fullName: string;
  password: string;
  profilePic: string;
  createdAt: string;
  isVerified: boolean;
};

type Message = {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  image: string;
  createdAt: Date;
};

type ChatStoreProps = {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;

  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  setSelectedUser: (selectedUser: User) => void;
};

export const useChatStore = create<ChatStoreProps>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      if (axios.isAxiosError(error))
        toast.error(error.response?.data.message || "Error in getUsers");
      else toast.error("Internal Server Error");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });

    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      if (axios.isAxiosError(error))
        toast.error(error.response?.data.message || "Error in getMessages");
      else toast.error("Internal Server Error");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  setSelectedUser: (selectedUser: User) => set({ selectedUser }),
}));
