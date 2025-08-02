import { AnimatePresence, motion } from "framer-motion";
import { Lock, LogIn, LogOut, ShoppingCart, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useUserStore from "../stores/useUserStore.js";

const LogoutConfirmation = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
              className="w-[90%] max-w-sm rounded-xl overflow-hidden pointer-events-auto"
            >
              <div className="relative p-6 bg-[#111827]/80 backdrop-blur-xl border border-emerald-900/50 rounded-xl shadow-[0_10px_40px_-10px_rgba(16,185,129,0.3)]">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>

                {/* Content */}
                <div className="flex flex-col items-center gap-4">
                  {/* Icon with animation */}
                  <motion.div
                    className="w-16 h-16 rounded-full bg-emerald-900/30 flex items-center justify-center"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <LogOut className="h-8 w-8 text-emerald-400" />
                  </motion.div>

                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    Confirm Logout
                  </h3>

                  <p className="text-gray-300 text-center">
                    Are you sure you want to log out of your account?
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-3 w-full mt-4">
                    <button
                      onClick={onClose}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-[#1a1a1a] hover:bg-[#202020] border border-gray-800 transition-colors text-gray-300 hover:text-white font-medium"
                    >
                      Cancel
                    </button>

                    <motion.button
                      onClick={onConfirm}
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-medium transition-all shadow-lg shadow-emerald-900/30"
                    >
                      Logout
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

const Navbar = () => {
  const { user, logout } = useUserStore(); // Replace with actual user authentication logic
  const isAdmin = user?.role === "admin";
  const cart = []; // Define cart or replace with your actual cart state
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  return (
    <>
      <LogoutConfirmation
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />

      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300
          ${
            scrolled
              ? "bg-[#0a0a0a]/80 backdrop-blur-xl shadow-[0_10px_30px_-10px_rgba(16,185,129,0.3)] border-b border-emerald-900/60"
              : "bg-transparent"
          }`}
      >
        <div className="container mx-auto px-5 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="relative text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center group"
          >
            <span className="mr-1.5 group-hover:scale-110 transition-transform duration-300">
              E
            </span>
            -Commerce
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
          </Link>

          <nav className="flex items-center gap-5">
            <Link
              to={"/"}
              className="relative text-gray-400 hover:text-white transition duration-300 
                overflow-hidden group py-2"
            >
              <span className="relative z-10">Home</span>
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-cyan-500 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"></span>
            </Link>

            {user && (
              <Link
                to={"/cart"}
                className="relative text-gray-400 hover:text-white transition duration-300 group"
              >
                <div className="relative flex items-center">
                  <ShoppingCart
                    className="group-hover:text-emerald-400 transition-colors duration-300"
                    size={22}
                  />

                  <span className="absolute -top-2 -left-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                    3
                  </span>
                  <span className="hidden sm:inline ml-2">Cart</span>
                </div>
              </Link>
            )}

            {isAdmin && (
              <Link
                to={"/dashboard"}
                className="relative overflow-hidden px-4 py-2 rounded-md group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-800 to-emerald-900 opacity-50 group-hover:opacity-70 transition-opacity duration-300 rounded-md"></span>
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                  <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.8)_0%,transparent_70%)]"></div>
                </span>
                <div className="relative flex items-center">
                  <Lock className="text-emerald-300 mr-2" size={16} />
                  <span className="text-sm font-medium text-emerald-100">
                    Dashboard
                  </span>
                </div>
              </Link>
            )}

            <div className="h-6 w-px bg-gradient-to-b from-transparent via-gray-700 to-transparent mx-1"></div>

            {user ? (
              <button
                className="relative overflow-hidden px-4 py-2 rounded-md group"
                onClick={() => setShowLogoutConfirm(true)}
              >
                <span className="absolute inset-0 bg-[#1a1a1a] group-hover:bg-[#202020] border border-gray-800 group-hover:border-gray-700 transition-all duration-300 rounded-md"></span>
                <div className="relative flex items-center">
                  <LogOut
                    className="text-gray-400 group-hover:text-white transition-colors duration-300"
                    size={18}
                  />
                  <span className="hidden sm:inline ml-2 text-gray-400 group-hover:text-white transition-colors duration-300">
                    Log Out
                  </span>
                </div>
              </button>
            ) : (
              <>
                <Link
                  to={"/signup"}
                  className="relative overflow-hidden px-4 py-2 rounded-md group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-cyan-700 opacity-80 group-hover:opacity-100 transition-all duration-300 rounded-md"></span>
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-30 transition-opacity duration-500">
                    <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_70%)]"></div>
                  </span>
                  <div className="relative flex items-center">
                    <UserPlus className="text-white mr-2" size={16} />
                    <span className="text-sm font-medium text-white">
                      Sign Up
                    </span>
                  </div>
                </Link>

                <Link
                  to={"/login"}
                  className="relative overflow-hidden px-4 py-2 rounded-md group"
                >
                  <span className="absolute inset-0 bg-[#1a1a1a] group-hover:bg-[#202020] border border-gray-800 group-hover:border-gray-700 transition-all duration-300 rounded-md"></span>
                  <div className="relative flex items-center">
                    <LogIn
                      className="text-gray-400 group-hover:text-white transition-colors duration-300"
                      size={16}
                    />
                    <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors duration-300">
                      Login
                    </span>
                  </div>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Navbar;
