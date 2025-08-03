import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import useCartStore from "../stores/useCartStore.js";
import useUserStore from "../stores/useUserStore.js";

const ProductCard = ({ product }) => {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();
  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please log in to add items to your cart.", {
        id: "login_prompt",
      });

      return;
    }
    addToCart(product);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-xl hover:shadow-emerald-600/30 transition-shadow duration-300 w-full max-w-sm mx-auto">
      <div className="relative h-64 overflow-hidden rounded-2xl">
        <img
          className="object-cover w-full h-full scale-100 group-hover:scale-105 transition-transform duration-500"
          src={product.imageUrl}
          alt={product.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-600/90 text-xs text-white font-semibold shadow-md backdrop-blur-lg">
          {product.category}
        </span>
      </div>
      <div className="flex-1 flex flex-col justify-between px-6 py-5">
        <h5 className="text-2xl font-bold text-white tracking-tight mb-2">
          {product.name}
        </h5>
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-3xl font-extrabold text-emerald-400 drop-shadow-lg">
            ${Number(product.price).toFixed(2)}
          </span>
          <button
            className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium
    text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all duration-200"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={18} />
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
