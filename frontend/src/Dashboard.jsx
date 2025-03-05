import { Link, Route, Outlet, NavLink, useNavigate } from "react-router";
import "./Dashboard.css";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "./interceptor/interceptor";
import { logoutAndClearSession } from "./features/slices/authSlice";
import { useEffect, useState } from "react";
import Logo from "./assets/Landify.png";

const navMenu = [
  {
    name: "Dashboard",
    // img: AppIcon,
    link: "/dashboard",
  },
  // {
  //   name: "Properties",
  //   img: PropertyIcon,
  //   link: "/dashboard/properties",
  // }
];

export function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth); 
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  const handleLogout = async () => {
    try {
      //   await axiosInstance.post("/auth/logout"); // Hit the logout API
      dispatch(logoutAndClearSession()); // Clear Redux state and session storage
      navigate("/"); // Clear user data // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        !event.target.closest(".sidenav") &&
        !event.target.closest(".navbar img")
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      isDarkMode ? 'dark' : 'light'
    );
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <div
      className="body"
      // style={isOpen ? { backgroundColor: "#111111" } : {}}
    >
      <title>Dashboard : Home</title>
      <div className="sidenav" style={{ width: isOpen ? "250px" : "0" }}>
        <a className="closebtn" onClick={() => setIsOpen(false)}>
          &times;
        </a>
        <Link to="/dashboard">Home</Link>
        <Link to="/owners">Owners</Link>
        <Link to="/properties">Lands</Link>
      </div>
      <div id="main">
        <div className="navbar">
          <div
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
          >
            <img src={Logo} alt="" />
          </div>
          <div>
            <Link to={"/user"}>{auth.user.user.username}</Link>
            <button onClick={toggleTheme} className="theme-toggle">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
