import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";

function App() {
  return (
    <div className="min-h-screen bg-github-dark text-github-text relative overflow-hidden">
      {/* GitHub Dark Theme Background */}
      {/* <DarkThemeBackground /> */}

      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
