import { motion } from "framer-motion";
import { ArrowRight, Loader, Lock, LogIn, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import useUserStore from "../stores/useUserStore.js";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, loading } = useUserStore();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form with data:", formData);
    login(formData.email, formData.password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#111827] via-[#151a23] to-[#101010] px-4 py-12 relative overflow-hidden">
      {/* Liquid glass background accent shapes */}
      <div className="absolute -top-32 -left-32 w-[450px] h-[450px] bg-gradient-to-br from-emerald-500/40 via-cyan-400/30 to-blue-500/30 rounded-full blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[320px] h-[320px] bg-gradient-to-tr from-emerald-500/40 via-cyan-400/30 to-blue-500/30 rounded-full blur-2xl opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-32 bg-gradient-to-r from-white/20 via-emerald-400/10 to-cyan-300/10 rounded-full blur-2xl opacity-40 pointer-events-none" />

      <motion.div
        className="w-full max-w-md rounded-2xl bg-white/30 shadow-2xl ring-1 ring-emerald-900/50 border border-emerald-800/40 backdrop-blur-2xl relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        style={{
          background:
            "linear-gradient(120deg, rgba(23, 37, 84, 0.7) 0%, rgba(16, 185, 129, 0.25) 100%)",
        }}
      >
        <div className="px-8 pt-8 pb-6">
          <motion.h2
            className="text-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 drop-shadow-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Login to your account
          </motion.h2>
          <p className="text-center mt-2 text-gray-200 text-sm/relaxed drop-shadow">
            Welcome back! Please enter your details
          </p>
        </div>
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6 px-8 pb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-emerald-200"
            >
              Email address
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-cyan-300" aria-hidden="true" />
              </div>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="block w-full px-3 py-2 pl-10 bg-white/30 border border-emerald-700 rounded-md shadow-sm placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition backdrop-blur-sm"
                placeholder="you@example.com"
              />
            </div>
          </div>
          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-emerald-200"
            >
              Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-cyan-300" aria-hidden="true" />
              </div>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="block w-full px-3 py-2 pl-10 bg-white/30 border border-emerald-700 rounded-md shadow-sm placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition backdrop-blur-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            className="w-full flex justify-center py-2 px-4 rounded-lg shadow-xl text-md font-semibold tracking-wide text-white bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 hover:from-emerald-300 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300 transition disabled:opacity-50"
            whileTap={{ scale: 0.97 }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader
                  className="mr-2 h-5 w-5 animate-spin"
                  aria-hidden="true"
                />
                Loading...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5" aria-hidden="true" />
                Login
              </>
            )}
          </motion.button>
        </motion.form>

        <div className="px-8 pb-8">
          <p className="mt-8 text-center text-sm text-gray-400">
            Not a member?{" "}
            <Link
              to="/signup"
              className="font-medium text-emerald-400 hover:text-emerald-300"
            >
              Sign up here <ArrowRight className="inline h-4 w-4" />
            </Link>
          </p>
          <p className="text-center text-xs text-emerald-100/80 pt-4 opacity-90">
            By logging in, you agree to our{" "}
            <span className="underline decoration-cyan-300 underline-offset-2 cursor-pointer hover:text-emerald-200 transition">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="underline decoration-cyan-300 underline-offset-2 cursor-pointer hover:text-emerald-200 transition">
              Privacy Policy
            </span>
            .
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
