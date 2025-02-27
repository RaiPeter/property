import { Link, Route, Outlet, NavLink, useNavigate } from "react-router";
import "./Dashboard.css";
import { useDispatch } from "react-redux";
import DashifyLogo from "./assets/Dashify-logo.png";
// import { New } from "./new";
import AppIcon from "./assets/apps.png";
import PropertyIcon from "./assets/property.png";
import AgentIcon from "./assets/agents.png";
import CustomersIcon from "./assets/customers.png";
import OrdersIcon from "./assets/orders.png";
import TransactionsIcon from "./assets/transactions.png";
import InboxIcon from "./assets/inbox.png";
import PostIcon from "./assets/post.png";
import NavMenu from "./components/NavMenu";
import SearchInput from "./components/SearchInput";
import axiosInstance from "./interceptor/interceptor";
import { logoutAndClearSession } from "./features/slices/authSlice";

const navMenu = [
  {
    name: "Dashboard",
    img: AppIcon,
    link: "/dashboard",
  },
  {
    name: "Properties",
    img: PropertyIcon,
    link: "/dashboard/properties",
  },
  {
    name: "Agents",
    img: AgentIcon,
    link: "/dashboard/agents",
  },
  {
    name: "Customers",
    img: CustomersIcon,
    link: "/dashboard/customers",
  },
  {
    name: "Orders",
    img: OrdersIcon,
    link: "/dashboard/orders",
  },
  {
    name: "Transactions",
    img: TransactionsIcon,
    link: "/dashboard/transactions",
  },
  {
    name: "Inbox",
    img: InboxIcon,
    link: "/dashboard/inbox",
  },
  {
    name: "Post",
    img: PostIcon,
    link: "/dashboard/post",
  },
];

export function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      //   await axiosInstance.post("/auth/logout"); // Hit the logout API
      dispatch(logoutAndClearSession()); // Clear Redux state and session storage
      navigate("/"); // Clear user data // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="sidebars">
      <title>Dashboard : Home</title>
      <div className="sidebar">
        <div className="company-logo">
          <img src={DashifyLogo} />
        </div>

        <div className="dashboard-links">
          <NavMenu navMenu={navMenu} />
        </div>
      </div>

      <div className="right-side">
        <div className="top-nav">
          <div className="left-menu">
            <SearchInput />
          </div>
          <div className="right-menu">
            <div>icons</div>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
            <div>user</div>
          </div>
        </div>
        <div className="outlet-page">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
