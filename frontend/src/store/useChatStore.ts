import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuthStore } from "./useAuthStore";
import { Socket } from "socket.io-client";

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

type MessageData = {
  text: string;
  image: string | null;
};

type ChatStoreProps = {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;

  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (messageData: MessageData) => Promise<void>;
  setSelectedUser: (selectedUser: User | null) => void;

  updateMessages: () => void;
  retireFromMessages: () => void;
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

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();

    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser!._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      if (axios.isAxiosError(error))
        toast.error(
          error.response?.data.message ||
            "Image file too big!" ||
            "Error in sendMessage"
        );
      else toast.error("Internal Server Error");
    }
  },

  updateMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket as Socket;

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;
      set({ messages: [...get().messages, newMessage] });
    });
  },

  retireFromMessages: () => {
    const socket = useAuthStore.getState().socket as Socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser: User | null) => set({ selectedUser }),
}));
