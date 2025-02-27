import React, { useState } from "react";
import "./AddProperty.css";
import axios from "axios";
import axiosInstance from "./interceptor/interceptor";
import { Link, Outlet, useNavigate } from "react-router";
import FileUpload from "./components/FileUpload";

const featuresList = ["AC & Heating","Clubhouse","Fitness Center","Swimming Pool", "Gym", "Garden", "Fireplace", "Balcony", "Security System","Parking"];
const stylesList = ["A-Frame", "Office", "Building", "Industrial", "Shop"];

const AddProperty = () => {
  const [property_name, setPropertyName] = useState("");
  const [property_type, setPropertyType] = useState("");
  const [property_price, setPropertyPrice] = useState("");
  const [property_location, setPropertyLocation] = useState("");
  const [property_city, setPropertyCity] = useState("");
  const [property_status, setPropertyStatus] = useState("Available");
  const [property_area, setPropertyArea] = useState("");
  const [property_bedrooms, setPropertyBedrooms] = useState("");
  const [property_bathrooms, setPropertyBathrooms] = useState("");
  const [property_features, setPropertyFeatures] = useState([]);
  const [property_style, setPropertyStyle] = useState("");
  const [property_details, setPropertyDetails] = useState("");
  const [property_image, setProperty_image] = useState({
    preview: "",
    data: "",
  });

  const toggleFeature = (feature) => {
    setPropertyFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
    console.log(property_features);
    
  };

  const propertyFormData = {
    property_name,
    property_type,
    property_price,
    property_location,
    property_city,
    property_status,
    property_area,
    property_bedrooms,
    property_bathrooms,
    property_features,
    property_style,
    property_details,
  };

  const handleForm = async (e) => {
    e.preventDefault();
    console.log(property_features);
    
    console.log("Form Submitted", propertyFormData);
    let formData = new FormData();
    if (property_image) {
      formData.append("file", property_image);
    } else {
      console.error("No file selected");
      return;
    }
    Object.keys(propertyFormData).forEach((key) => {
      formData.append(key, propertyFormData[key]);
    });
    // formData.append(propertyFormData)

    try {
      const { data } = await axiosInstance.post("/api/property", formData);
      console.log("Form Submitted Successfully:", data);

      // Reset form fields
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response?.data || error.message
      );
    }
  };
  return (
    <div className="add-property">
      <form onSubmit={handleForm}>
        <FileUpload setFileImage={setProperty_image} />
        <div className="property-row">
          <div className="property-field">
            <label htmlFor="property_name">Property Name</label>
            <input
              type="text"
              placeholder="Enter property name"
              id="property_name"
              name="property_name"
              value={property_name}
              onChange={(e) => setPropertyName(e.target.value)}
            />
          </div>
          <div className="property-field">
            <label htmlFor="property_type">Property Type</label>
            <select
              id="property_type"
              name="property_type"
              value={property_type}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Office">Office</option>
              <option value="Building">Building</option>
              <option value="Shop">Shop</option>
            </select>
          </div>
          <div className="property-field">
            <label htmlFor="property_price">Price</label>
            <input
              type="number"
              min={0}
              placeholder="Enter price"
              id="property_price"
              name="property_price"
              value={property_price}
              onChange={(e) => setPropertyPrice(e.target.value)}
            />
          </div>
        </div>
        <div className="property-row">
          <div className="property-field">
            <label htmlFor="property_location">Location</label>
            <input
              type="text"
              id="property_location"
              placeholder="Enter location"
              name="property_location"
              value={property_location}
              onChange={(e) => setPropertyLocation(e.target.value)}
            />
          </div>
          <div className="property-field">
            <label htmlFor="property_city">City</label>
            <input
              type="text"
              id="property_city"
              placeholder="Enter city"
              name="property_city"
              value={property_city}
              onChange={(e) => setPropertyCity(e.target.value)}
            />
          </div>
          <div className="property-field">
            <label htmlFor="property_status">Current Status</label>
            <select
              id="property_status"
              name="property_status"
              value={property_status}
              onChange={(e) => setPropertyStatus(e.target.value)}
            >
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
        <div className="property-row">
          <div className="property-field">
            <label htmlFor="property_area">Square Feet</label>
            <input
              type="number"
              id="property_area"
              min={0}
              placeholder="Enter area"
              name="property_area"
              value={property_area}
              onChange={(e) => setPropertyArea(e.target.value)}
            />
          </div>
          <div className="property-field">
            <label htmlFor="property_bedrooms">Bedrooms</label>
            <input
              type="number"
              id="property_bedrooms"
              min={0}
              placeholder="Enter no. of bedrooms"
              name="property_bedrooms"
              value={property_bedrooms}
              onChange={(e) => setPropertyBedrooms(e.target.value)}
            />
          </div>
          <div className="property-field">
            <label htmlFor="property_bathrooms">Bathrooms</label>
            <input
              type="number"
              id="property_bathrooms"
              min={0}
              placeholder="Enter no. of bathrooms"
              name="property_bathrooms"
              value={property_bathrooms}
              onChange={(e) => setPropertyBathrooms(e.target.value)}
            />
          </div>
        </div>
        <div className="property-row">
          <div className="property-field">
          <label>Property Features</label>
          <div className="features">
            {featuresList.map((feature) => (
              <label key={feature}>
                <input type="checkbox" checked={property_features.includes(feature)} onChange={() => toggleFeature(feature)} /> {feature}
              </label>
            ))}
          </div>

          </div>
          <div className="property-field">
            <label htmlFor="property_style">Property Style</label>
            <select id="property_style" name="property_style" value={property_style} onChange={(e) => setPropertyStyle(e.target.value)}>
              {stylesList.map((style) => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
          </div>
        </div>
        {/* <div className="property-row"> */}
        {/* </div> */}
        <div className="property-row">
          <div className="property-field-textarea">
          <label htmlFor="property_details">Property Details</label>
          <textarea
            id="property_details"
            name="property_details"
            placeholder="Enter property details"
            value={property_details}
            onChange={(e) => setPropertyDetails(e.target.value)}
          ></textarea>
          </div>
        </div>
        <div className="buttons">
          <button type="cancel" className="cancel">Cancel</button>
          <button type="submit" className="submit">Add Property</button>
        </div>
      </form>
    </div>
  );
};

export default AddProperty;
