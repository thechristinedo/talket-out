import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { useChatStore } from "./useChatStore";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

type User = {
  _id: string;
  email: string;
  fullName: string;
  password: string;
  profilePic: string;
  createdAt: string;
  isVerified: boolean;
};

type SignUpData = {
  fullName: string;
  email: string;
  password: string;
};

type LoginData = {
  email: string;
  password: string;
};

type UpdateProfileData = {
  profilePic: string;
};

type AuthStoreProps = {
  authUser: User | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isGettingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[];
  socket: Socket | null;

  checkAuth: () => Promise<void>;
  signup: (data: SignUpData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  getProfile: () => Promise<void>;

  connectSocket: () => void;
  disconnectSocket: () => void;
};

export const useAuthStore = create<AuthStoreProps>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isGettingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    set({ isCheckingAuth: true });

    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });

    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      if (axios.isAxiosError(error))
        toast.error(error.response?.data.message || "Error in signup");
      else toast.error("Internal Server Error");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      if (axios.isAxiosError(error))
        toast.error(error.response?.data.message || "Error in login");
      else toast.error("Internal Server Error");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      useChatStore.setState({ selectedUser: null });
      get().disconnectSocket();
    } catch (error) {
      if (axios.isAxiosError(error))
        toast.error(error.response?.data.message || "Error in logout");
      else toast.error("Internal Server Error");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      if (axios.isAxiosError(error))
        toast.error(error.response?.data.message || "Image file too big!");
      else toast.error("Internal Server Error");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  getProfile: async () => {
    set({ isGettingProfile: true });

    try {
      const res = await axiosInstance.get("/auth/get-profile");
      set({ authUser: res.data });
    } catch (error) {
      if (axios.isAxiosError(error))
        toast.error(error.response?.data.message || "Error in getProfile");
      else toast.error("Internal Server Error");
    } finally {
      set({ isGettingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();
    set({ socket });

    // whenever getOnlineUsers updates, set onlineUsers
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket?.disconnect();
  },
}));
