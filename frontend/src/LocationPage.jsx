import React, { useEffect, useState } from "react";
import "./LocationPage.css";
import { useParams} from "react-router"
import { Link} from "react-router";
import axiosInstance from "./interceptor/interceptor";
import { useDispatch } from "react-redux";
import { setProperties } from "./features/slices/propertiesSlice";
    
const LocationPage = () => {
    const params = useParams();
    const [properties, setResProperties] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
      const fetchProperties = async () => {
        try {
          const response = await axiosInstance.get(`/api/property/${params.location}`); // Replace with your actual API URL
          console.log(response.data);
      
          setResProperties(response.data);
          dispatch(setProperties(response.data)); // Assuming you have a state for properties
        } catch (error) {
          console.error("Error fetching properties:", error);
        }
      };
    
      fetchProperties();
    },[params])
  return (
    <div className="location">
      <div className="container">
        <div className="top">
          <h3>Lands in {params.location.toUpperCase()}</h3>
        </div>
        <div className="location-details">
            {properties?.map((property, i) => (
                <div key={property._id}>
                    <label>{i+1}.   </label> 
                    <Link to={"./details"}>
                        <h3>{property.land_area} kattha</h3>
                    </Link>
                    <div>

                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LocationPage;
