import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import MapEmbed from "./components/MapEmbed";
import "./PropertyDetails.css"
import Img from "./assets/ggg.jpg";
import ImageShow from "./components/ImageShow";
import { useSelector } from "react-redux";

const PropertyDetails = () => {
  const { location } = useParams();
  const [currentProperty, setCurrentProperty] = useState(null);
  const properties  = useSelector((state) => state.properties.properties);
  useEffect(() => {
    if (properties.length > 0) {
      const foundProperty = properties.find((p) => p.location === location);
      setCurrentProperty(foundProperty || null);
    }
  }, [properties, location]);
  console.log(properties, 'from redux');
  
  if (!currentProperty) return <p>Loading property details...</p>;


  return (
    <div className="details">
      <div className="container">
        <div className="owner">
          <h2>Property Details</h2>
          <div>
            <div>
              <label>Property owner: </label>
              <p>{currentProperty?.owner_details?.[0]?.name}</p>
            </div>
            <div>
              <label>Contact no: </label>
              <a href={`${currentProperty?.owner_details?.[0]?.contact}`}>{currentProperty?.owner_details?.[0]?.contact}</a>
            </div>
            <div>
              <label>Email: </label>
              <a href={`${currentProperty?.owner_details?.[0]?.email}`}>{currentProperty?.owner_details?.[0]?.email}</a>
            </div>
          </div>
        </div>
        <div>
          <h3>Land area : {currentProperty?.land_area} (in kattha)</h3>
        </div>
        <div className="location-map">
            <h3>Location : {currentProperty?.location}</h3>
            <MapEmbed embedUrl={`${currentProperty?.maps_link}`} />
        </div>
        <div className="khatiyan">
            <h3>Khatiyan : </h3>
            <ImageShow url={`http://localhost:8000/property-images/${currentProperty?.khatiyan_image}`} />
        </div>
        <div className="siteplan">
            <h3>Siteplan :</h3>
            <ImageShow url={`http://localhost:8000/property-images/${currentProperty?.siteplan_image}`} />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
