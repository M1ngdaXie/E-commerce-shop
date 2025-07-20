import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const CategoryItem = ({ category, index }) => {
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -5 }}
    >
      <Link to={`/category${category.href}`}>
        <div className="w-full aspect-[5/6] cursor-pointer overflow-hidden">
          {/* Decorative corner elements */}
          <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-emerald-300/60 rounded-tl-lg z-30 transition-all duration-500 group-hover:scale-110 group-hover:border-emerald-300" />
          <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-emerald-300/60 rounded-br-lg z-30 transition-all duration-500 group-hover:scale-110 group-hover:border-emerald-300" />

          {/* Image and overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/40 to-gray-900/90 z-10" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 to-transparent opacity-0 z-10 transition-opacity duration-500 group-hover:opacity-100"
            whileHover={{ opacity: 1 }}
          />

          <motion.img
            src={category.imageUrl}
            alt={category.name}
            className="w-full h-full object-cover"
            loading="lazy"
            whileHover={{ scale: 1.07 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 z-20">
            <motion.h3
              className="text-white text-3xl font-bold mb-1 tracking-tight"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 + index * 0.1, duration: 0.7 }}
            >
              {category.name}
            </motion.h3>

            <div className="overflow-hidden">
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.7 }}
              >
                <p className="text-gray-200 text-sm font-medium mb-4 opacity-80">
                  {category.items || "35"} items in collection
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.7 }}
              className="flex items-center group-hover:text-emerald-300 text-white/80 transition-colors"
            >
              <span className="text-sm font-medium tracking-wide">
                DISCOVER
              </span>
              <motion.div className="ml-2" whileHover={{ x: 3, y: -3 }}>
                <ArrowUpRight size={16} className="stroke-2" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryItem;
