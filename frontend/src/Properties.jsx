import "./Properties.css";
import { NavLink, Outlet, useNavigate } from "react-router";

const Properties = () => {
  return (
    <div className="properties">
      <div className="row">
        <h3>Property List</h3>
        <NavLink to="add-property">Add Property</NavLink>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Properties;
