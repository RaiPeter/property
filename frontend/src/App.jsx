import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { Dashboard } from "./Dashboard";
import { Home } from "./Home";

import DashboardHome from "./DashboardHome";
import Properties from "./Properties";
import Agents from "./Agents";
import Customers from "./Customers";
import Orders from "./Orders";
import Transactions from "./Transactions";
import Inbox from "./Inbox";
import Post from "./Post";
import Signup from "./Signup";
import Login from "./Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Logout from "./components/Logout";
import AddProperty from "./AddProperty";
import PropertyDetails from "./PropertyDetails";
import PropertyList from "./PropertyList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="properties" element={<Properties />} >
            <Route index element={<PropertyList />}/>
            <Route path="add-property" element={<AddProperty />} />
            <Route path="property-details" element={<PropertyDetails />} />
          </Route>
          <Route path="agents" element={<Agents />} />
          <Route path="customers" element={<Customers />} />
          <Route path="orders" element={<Orders />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="post" element={<Post />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
