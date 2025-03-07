import "./DashboardHome.css";
import Table from "./components/Table";
import { useNavigate } from "react-router";
import axiosInstance from "./interceptor/interceptor";
import { useState, useEffect } from "react";

export default function DashboardHome() {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();
  console.log(properties);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axiosInstance.get("/api/properties"); // Replace with your actual API URL
        console.log(response.data);
        console.log("asdfasdf");

        setProperties(response.data); // Assuming you have a state for properties
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []); // Runs only once when the component mounts

  return (
    <div className="dashboard-layout">
      <div className="container">
        <div className="top">
          <h3>Properties</h3>
          <button type="button" onClick={() => navigate("./add-property")}>
            Add new property
          </button>
        </div>
        <Table data={properties} />
      </div>
    </div>
  );
}
