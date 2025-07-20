import toast from "react-hot-toast";
import { create } from "zustand";
import axios from "../lib/axios";

const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async (name, email, password, confirmPassword) => {
    set({ loading: true });
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      set({ loading: false });
      return;
    }
    try {
      const response = await axios.post("/auth/signup", {
        name,
        email,
        password,
      });
      set({ user: response.data, loading: false });
      toast.success("Signup successful!");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const response = await axios.post("/auth/login", { email, password });
      set({ user: response.data, loading: false });
      toast.success("Login successful!");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await axios.post("/auth/logout");
      set({ user: null, loading: false });
      toast.success("Logout successful!");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Logout failed");
    } finally {
      set({ loading: false });
    }
  },
  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("/auth/profile");
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      set({ user: null, checkingAuth: false });
    } finally {
      set({ checkingAuth: false });
    }
  },
}));
export default useUserStore;
