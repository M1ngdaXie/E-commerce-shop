import { motion } from "framer-motion"; // Add this package for animations
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "../lib/axios";
import ProductCard from "./ProductCard";

const PeopleAlsoBought = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get("/products/recommendations");
        setRecommendations(res.data);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Couldn't load recommendations right now"
        );
        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // Return early if no recommendations and not loading
  if (!isLoading && recommendations.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 py-8 border-t border-gray-800">
      <div className="flex items-center mb-6">
        <h3 className="text-2xl font-bold text-emerald-400">
          People Also Bought
        </h3>
        <div className="ml-4 h-px flex-grow bg-gradient-to-r from-emerald-500/50 to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? // Skeleton loading state
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="bg-gray-800/50 rounded-lg p-4 h-[300px] animate-pulse"
              >
                <div className="bg-gray-700 h-40 rounded-md mb-4"></div>
                <div className="bg-gray-700 h-4 rounded-full w-3/4 mb-3"></div>
                <div className="bg-gray-700 h-4 rounded-full w-1/2"></div>
              </div>
            ))
          : // Actual products with animation
            recommendations.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
      </div>
    </section>
  );
};

export default PeopleAlsoBought;
