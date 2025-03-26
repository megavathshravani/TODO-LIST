import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogin = () => {
    if (username.trim() === "") {
      alert("Username cannot be empty!");
      return;
    }
    setIsLoggedIn(true);
    setShowLoginPopup(false);
    setShowWelcomePopup(true);
    setTimeout(() => setShowWelcomePopup(false), 3000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  return (
    <>
      <div className="navbar">
        {/* App Name (Left-Aligned) */}
        <div className="app-name">Smart Work</div>

        {/* Hamburger Menu (Mobile) */}
        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        {/* Navigation & Login */}
        <div className={`nav-container ${menuOpen ? "active" : ""}`}>
          <div className={`nav-links ${menuOpen ? "active" : ""}`}>
            <a href="#history">Task History</a>
            <a href="#incomplete">Incomplete Tasks</a>
            <a href="#complete">Completed Tasks</a>
          </div>

          {/* Login/Logout Button */}
          <div>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="login-btn">
                Logout
              </button>
            ) : (
              <button onClick={() => setShowLoginPopup(true)} className="login-btn">
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Login Popup */}
      {showLoginPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <h2>Login</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin} className="popup-login-btn">
              Login
            </button>
          </div>
        </div>
      )}

      {/* Welcome Popup */}
      {showWelcomePopup && (
        <div className="popup-overlay">
          <div className="logged-in-popup">
            Welcome, {username}! You are now logged in.
          </div>
        </div>
      )}
    </>
  );
}
