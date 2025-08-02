import toast from "react-hot-toast";
import { create } from "zustand";
import axios from "../lib/axios";

const useProductStore = create((set, get) => ({
  products: [],
  setProducts: (products) => set({ products }),
  loading: false,
  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const response = await axios.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, response.data],
        loading: false,
      }));
      toast.success("Product created successfully!");
    } catch (error) {
      toast.error("Failed to create product.");
    } finally {
      set({ loading: false });
    }
  },
  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${id}`);
      set((prevState) => ({
        products: prevState.products.filter((product) => product._id !== id),
        loading: false,
      }));
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete product.");
    } finally {
      set({ loading: false });
    }
  },
  toggleFeaturedProduct: async (id) => {
    // Optimistically update UI
    set((prevState) => ({
      products: prevState.products.map((product) =>
        product._id === id
          ? { ...product, isFeatured: !product.isFeatured }
          : product
      ),
      loading: true,
    }));

    // Then call backend
    try {
      await axios.patch(`/products/${id}`); // or your correct endpoint
    } catch (error) {
      toast.error("Failed to toggle featured status.");
      // Roll back the change if error
      set((prevState) => ({
        products: prevState.products.map((product) =>
          product._id === id
            ? { ...product, isFeatured: !product.isFeatured }
            : product
        ),
        loading: false,
      }));
    } finally {
      set({ loading: false });
    }
  },
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products");
      set({ products: response.data.products, loading: false });
    } catch (error) {
      toast.error("Failed to fetch products.");
      set({ loading: false });
    }
  },
}));
export default useProductStore;
