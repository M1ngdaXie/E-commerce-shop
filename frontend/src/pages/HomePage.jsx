import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import CategoryItem from "../components/CategoryItem.jsx";
import FeaturedProducts from "../components/FeaturedProducts.jsx";
import useProductStore from "../stores/useProductStore.js";

const HomePage = () => {
  const [scrollY, setScrollY] = useState(0);
  const { fetchFeaturedProducts, products, isLoading } = useProductStore();
  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    {
      href: "/jeans",
      name: "Denim",
      imageUrl: "/jeans.jpg",
      items: 48,
    },
    {
      href: "/t-shirts",
      name: "T-shirts",
      imageUrl: "/tshirts.jpg",
      items: 124,
    },
    {
      href: "/shoes",
      name: "Footwear",
      imageUrl: "/shoes.jpg",
      items: 76,
    },
    {
      href: "/glasses",
      name: "Eyewear",
      imageUrl: "/glasses.png",
      items: 32,
    },
    {
      href: "/jackets",
      name: "Outerwear",
      imageUrl: "/jackets.jpg",
      items: 58,
    },
    {
      href: "/suits",
      name: "Formal",
      imageUrl: "/suits.jpg",
      items: 41,
    },
    {
      href: "/bags",
      name: "Accessories",
      imageUrl: "/bags.jpg",
      items: 83,
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-[#080808]">
        {/* Animated background elements */}
        <motion.div
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-transparent blur-3xl"
          animate={{
            y: [0, 15, 0],
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.6, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ y: scrollY * -0.1 }}
        />

        <motion.div
          className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-600/10 via-blue-500/10 to-transparent blur-3xl"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.08, 1],
            opacity: [0.4, 0.5, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          style={{ y: scrollY * 0.1 }}
        />

        {/* Hero content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif text-7xl sm:text-8xl md:text-9xl font-bold">
              <span className="text-white">Modern</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Fashion
              </span>
            </h1>
          </motion.div>

          <motion.p
            className="mt-8 text-lg sm:text-xl text-gray-300/80 max-w-2xl mx-auto font-light tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover sustainable luxury with our curated collections of
            eco-friendly designer fashion
          </motion.p>

          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <a
              href="#collections"
              className="inline-flex items-center px-8 py-4 border border-emerald-500/50 hover:border-emerald-500 bg-emerald-900/20 hover:bg-emerald-900/40 transition-all rounded-full text-emerald-300 group"
            >
              <span className="font-medium tracking-wide text-sm uppercase">
                Explore Collections
              </span>
              <motion.span
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ArrowRight size={18} />
              </motion.span>
            </a>
          </motion.div>
        </div>

        {/* Decorative grid lines */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9Im5vbmUiIGQ9Ik0wIDBoMTAwdjEwMEgweiIvPjxwYXRoIGQ9Ik0xMDAgMEgwdjEwMGgxMDBWMHoiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIuNSIvPjwvZz48L3N2Zz4=')] opacity-30 mix-blend-overlay" />
      </section>

      {/* Collections Section */}
      <section
        id="collections"
        className="relative min-h-screen bg-[#080808] py-24 overflow-hidden"
      >
        {/* Background decor */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9Im5vbmUiIGQ9Ik0wIDBoMTAwdjEwMEgweiIvPjxwYXRoIGQ9Ik0xMDAgMEgwdjEwMGgxMDBWMHoiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIuNSIvPjwvZz48L3N2Zz4=')] opacity-30 mix-blend-overlay" />

        <div
          className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-3xl"
          style={{ y: scrollY * 0.15 }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-3xl"
          style={{ y: scrollY * -0.1 }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-4">
              Curated Collections
            </h2>

            <div className="flex justify-between items-end mb-16">
              <p className="text-xl text-gray-300/80 max-w-2xl">
                Explore our carefully selected fashion categories with
                sustainable materials and timeless designs
              </p>

              <a
                href="/all-collections"
                className="hidden md:flex items-center text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span className="font-medium mr-2">View all</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categories.map((category, index) => (
              <CategoryItem
                category={category}
                key={category.name}
                index={index}
              />
            ))}
          </div>
          {!isLoading && products.length > 0 && (
            <FeaturedProducts featuredProducts={products} />
          )}

          <div className="mt-16 flex justify-center md:hidden">
            <a
              href="/all-collections"
              className="flex items-center px-6 py-3 rounded-full border border-emerald-700/50 hover:border-emerald-500 text-emerald-400 hover:text-emerald-300 transition-all"
            >
              <span className="font-medium mr-2">View all collections</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
