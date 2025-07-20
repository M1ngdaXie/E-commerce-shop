import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const LoadingSpinner = ({ text = "Loading", fullScreen = true }) => {
  const [loadingDots, setLoadingDots] = useState(".");

  // Animated dots for the loading text
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingDots((dots) => (dots.length >= 3 ? "." : dots + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const containerClasses = fullScreen
    ? "flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#111827] via-[#151a23] to-[#101010]"
    : "flex flex-col items-center justify-center py-12";

  return (
    <div className={containerClasses}>
      {/* Subtle background blur elements */}
      <div className="absolute w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div
        className="absolute w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl -z-10 animate-pulse"
        style={{ animationDelay: "0.5s" }}
      />

      <div className="relative flex flex-col items-center">
        {/* Outer spinning ring */}
        <motion.div
          className="w-24 h-24 rounded-full border-4 border-transparent border-t-emerald-400 border-b-cyan-400"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Middle spinning ring */}
        <motion.div
          className="w-16 h-16 rounded-full border-4 border-transparent border-l-emerald-500 border-r-cyan-500 absolute"
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Inner glowing element */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full shadow-lg"
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.7, 0.9, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Loading text with animated dots */}
        <p className="mt-8 text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
          {text}
          {loadingDots}
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
