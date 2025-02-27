import React from "react";
import "./PropertyCard.css";
import PropertyImage from "../assets/pro.png"
const PropertyCard = ({name,price,status,bedrooms,bathrooms,features,image, id}) => {
  const imageUrl = image ? `http://localhost:8000/property-images/${image}` : ""; 

  return (
    <div className="property-card" key={id} style={{ viewTransitionName: `property-${id}` }}
>
      <div className="image">
        <img src={imageUrl} alt={name} />
      </div>
      <div className="price">
        <p>{price.toLocaleString()}</p>
        <p>{status}</p>
      </div>
      <h4>{name}</h4>
      <div className="features">
        <div>{bedrooms} beds</div>
        <div>{bathrooms} baths</div>
        <div>{features[0]}</div>
      </div>
    </div>
  );
};

export default PropertyCard;
