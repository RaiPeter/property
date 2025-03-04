import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { Dashboard } from "./Dashboard";
import { Home } from "./Home";

import DashboardHome from "./DashboardHome";
import Signup from "./Signup";
import Login from "./Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Logout from "./components/Logout";
import AddProperty from "./AddProperty";
import LocationPage from "./LocationPage";
import PropertyDetails from "./PropertyDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
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
          <Route path="add-property" element={<AddProperty />} />
          <Route path=":location">
            <Route index element={<LocationPage />} />
            <Route path="details" element={<PropertyDetails />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
