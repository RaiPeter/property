import React, { useState } from "react";
import "./AddProperty.css";
import axios from "axios";
import axiosInstance from "./interceptor/interceptor";
import { Link, Outlet, useNavigate } from "react-router";
import FileUpload from "./components/FileUpload";

const featuresList = ["AC & Heating","Clubhouse","Fitness Center","Swimming Pool", "Gym", "Garden", "Fireplace", "Balcony", "Security System","Parking"];
const stylesList = ["A-Frame", "Office", "Building", "Industrial", "Shop"];


const AddProperty = () => {
  const [property_location, setPropertyLocation] = useState("");
  const [property_area, setPropertyArea] = useState("");
  const [property_owner_name, setPropertyOwnerName] = useState("");
  const [property_owner_contact, setPropertyOwnerContact] = useState("")
  const [property_owner_email, setPropertyOwnerEmail] = useState("")
  const [property_embed_map_link, setPropertyEmbedMapLink] = useState("")
  const [property_khatiyan_image, setPropertyKhatiyanImage] = useState({
    preview: "",
    data: "",
  });
  const [property_siteplan_image, setPropertySiteplanImage] = useState({
    preview: "",
    data: "",
  });

  const [property_image, setProperty_image] = useState({
    preview: "",
    data: "",
  });

  const propertyFormData = {
    property_location,
    property_area,
    property_owner_name,
    property_owner_contact,
    property_owner_email,
    property_embed_map_link
  };

  const handleForm = async (e) => {
    e.preventDefault();
    console.log(property_location);
    
    console.log("Form Submitted", propertyFormData);
    let formData = new FormData();
    if (property_khatiyan_image && property_siteplan_image) {
      formData.append("khatiyan_img", property_khatiyan_image);
      formData.append("siteplan_img", property_siteplan_image);
    } else {
      console.error("No file selected");
      return;
    }
    Object.keys(propertyFormData).forEach((key) => {
      formData.append(key, propertyFormData[key]);
    });
    // formData.append(propertyFormData)

    try {
      const { data } = await axiosInstance.post("/api/add-property", formData);
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
      <div className="container">
        <h3>Add a property</h3>
      <form onSubmit={handleForm}>
        <div className="property-row">
          <div className="property-field">
            <label htmlFor="property_name">Property location</label>
            <input
              type="text"
              placeholder="Enter property location"
              id="property_location"
              name="property_location"
              value={property_location}
              onChange={(e) => setPropertyLocation(e.target.value)}
            />
          </div>
        </div>
        <div className="property-row">
          <div className="property-field">
            <label htmlFor="property_name">Property area</label>
            <input
              type="number"
              placeholder="Enter property area"
              id="property_area"
              name="property_area"
              value={property_area}
              onChange={(e) => setPropertyArea(e.target.value)}
            />
          </div>
        </div>
        <h3>Property owner</h3>
        <div className="property-row">
          <div className="property-field">
            <label htmlFor="property_owner">Owner name</label>
            <input
              type="text"
              placeholder="Enter owner name"
              id="property_owner_name"
              name="property_owner_name"
              value={property_owner_name}
              onChange={(e) => setPropertyOwnerName(e.target.value)}
            />
          </div>
        </div>
        <div className="property-row">
          <div className="property-field">
            <label htmlFor="property_owner_contact">Owner contact</label>
            <input
              type="number"
              placeholder="Enter owner contact"
              id="property_owner_contact"
              name="property_owner_contact"
              value={property_owner_contact}
              onChange={(e) => setPropertyOwnerContact(e.target.value)}
            />
          </div>
        </div>
        <div className="property-row">
          <div className="property-field">
            <label htmlFor="property_owner">Owner email</label>
            <input
              type="email"
              placeholder="Enter owner email"
              id="property_owner_email"
              name="property_owner_email"
              value={property_owner_email}
              onChange={(e) => setPropertyOwnerEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="property-row">
          <div className="property-field">
            <label htmlFor="property_embed_map_link">Property map lin</label>
            <input
              type="text"
              placeholder="Enter map link"
              id="property_embed_map_link"
              name="property_embed_map_link"
              value={property_embed_map_link}
              onChange={(e) => setPropertyEmbedMapLink(e.target.value)}
            />
          </div>
        </div>
        <div className="property-row">
          <div className="property-field">
            <h3 htmlFor="property_owner_khatiyan_image">Property khatiyan :</h3>
            <FileUpload setFileImage={setPropertyKhatiyanImage}/>
          </div>
        </div>
        <div className="property-row">
          <div className="property-field">
            <h3 htmlFor="property_owner_siteplan_image">Property siteplan :</h3>
            <FileUpload setFileImage={setPropertySiteplanImage}/>
          </div>
        </div>
        <div className="buttons">
          <button type="cancel" className="cancel">Cancel</button>
          <button type="submit" className="submit">Add Property</button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default AddProperty;
