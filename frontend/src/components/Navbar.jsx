import { Lock, LogIn, LogOut, ShoppingCart, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const user = false; // Replace with actual user authentication logic
  const isAdmin = false;
  const cart = []; // Define cart or replace with your actual cart state
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
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
              to="/dashboard"
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
            <button className="relative overflow-hidden px-4 py-2 rounded-md group">
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
  );
};

export default Navbar;
