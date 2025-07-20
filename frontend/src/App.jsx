import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import Navbar from "./components/Navbar.jsx";
import Homepage from "./pages/Homepage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import useUserStore from "./stores/useUserStore.js";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (checkingAuth) {
    return <LoadingSpinner />;
  }
  return (
    <div className="min-h-screen bg-github-dark text-github-text relative overflow-hidden">
      {/* GitHub Dark Theme Background */}
      {/* <DarkThemeBackground /> */}

      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route>
            <Route path="/" element={<Homepage />} />
            <Route
              path="/signup"
              element={!user ? <SignUpPage /> : <Navigate to="/" />}
            />
            <Route
              path="/login"
              element={!user ? <LoginPage /> : <Navigate to="/" />}
            />
          </Route>
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
