import { Link, Outlet, useNavigate } from "react-router"; // Fixed import syntax
import "./Dashboard.css";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "./interceptor/interceptor";
import { logoutAndClearSession } from "./features/slices/authSlice";
import { useEffect, useState, useRef } from "react";
import Logo from "./assets/Landify.png";

export function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth.user);
  const [currentUser, setCurrentUser] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      // await axiosInstance.post("/auth/logout");
      dispatch(logoutAndClearSession());
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setIsDropdownOpen(false);
  };

  // Sidebar click outside handler
  useEffect(() => {
    const handleClickOutsideSidebar = (event) => {
      if (
        isOpen &&
        !event.target.closest(".sidenav") &&
        !event.target.closest(".navbar img")
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutsideSidebar);
    return () =>
      document.removeEventListener("click", handleClickOutsideSidebar);
  }, [isOpen]);

  // Dropdown click outside handler
  useEffect(() => {
    const handleClickOutsideDropdown = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideDropdown);
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideDropdown);
  }, []);

  // Theme and user setup
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    if (auth?.user?.username) {
      setCurrentUser(auth.user.username);
    }
  }, [isDarkMode, auth]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className="body">
      <title>Dashboard : Home</title>
      <div className="sidenav" style={{ width: isOpen ? "250px" : "0" }}>
        <a className="closebtn" onClick={() => setIsOpen(false)}>
          x
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
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <Link
              to={"/user"}
              onClick={(e) => {
                e.preventDefault();
                setIsDropdownOpen(!isDropdownOpen);
              }}
            >
              {currentUser}
            </Link>
            {isDropdownOpen && (
              <div className="logout">
                <button
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
            <button onClick={toggleTheme} className="theme-toggle">
              {isDarkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
