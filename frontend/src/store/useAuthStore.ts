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
  //   lastLogin: string;
  //   createdAt: string;
  //   updatedAt: string;
};

type SignUpData = {
  fullName: string;
  email: string;
  password: string;
};

type AuthStoreProps = {
  authUser: User | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;

  checkAuth: () => Promise<void>;
  signup: (data: SignUpData) => Promise<void>;
};

export const useAuthStore = create<AuthStoreProps>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth", error);
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
    } catch (error) {
      if (axios.isAxiosError(error))
        toast.error(error.response?.data.message || "Error in signup");
      else toast.error("Internal Server Error");
    } finally {
      set({ isSigningUp: false });
    }
  },
}));
