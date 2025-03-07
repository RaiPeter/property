import React, { useEffect, useState } from "react";
import "./AddProperty.css";
import axiosInstance from "./interceptor/interceptor";
import { useNavigate } from "react-router";
import FileUpload from "./components/FileUpload";

const AddProperty = () => {
  const navigate = useNavigate();
  const [property_location, setPropertyLocation] = useState("");
  const [property_area, setPropertyArea] = useState("");
  const [property_owner_name, setPropertyOwnerName] = useState("");
  const [property_owner_contact, setPropertyOwnerContact] = useState("");
  const [property_owner_email, setPropertyOwnerEmail] = useState("");
  const [property_embed_map_link, setPropertyEmbedMapLink] = useState("");
  const [property_khatiyan_image, setPropertyKhatiyanImage] = useState(null);
  const [property_siteplan_image, setPropertySiteplanImage] = useState(null);
  const [resetCounter, setResetCounter] = useState(0);

  const [owners, setOwners] = useState([]); // List of existing owners
  const [isNewOwner, setIsNewOwner] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState(""); // Add error state for user feedback

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await axiosInstance.get("/api/owners"); // Adjust endpoint
        setOwners(response.data); // Assuming response.data is [{ _id, name }, ...]
      } catch (error) {
        console.error(
          "Error fetching owners:",
          error.response?.data || error.message
        );
      }
    };
    fetchOwners();
  }, []);

  // Handle owner selection from dropdown
  const handleOwnerChange = (e) => {
    const value = e.target.value;
    if (value === "new") {
      setIsNewOwner(true);
      setPropertyOwnerName("");
    } else {
      setIsNewOwner(false);
      setPropertyOwnerName(value);
    }
    e.target.size = 1; // Shrink dropdown after selection
    e.target.style.minWidth = "0"; // Reset min-width
    e.target.blur(); // Remove focus
  };

  const handleFocus = (e) => {
    if (!isNewOwner) {
      e.target.size = 5; // Expand dropdown on focus
      e.target.style.minWidth = "290px";
    }
  };

  const handleBlur = (e) => {
    if (!isNewOwner) {
      e.target.size = 1; // Shrink dropdown on blur
      e.target.style.minWidth = "0";
    }
  };

  // Convert file to base64 string
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors

    // Validate required fields
    if (
      !property_location ||
      !property_area ||
      !property_owner_name ||
      !property_owner_contact ||
      !property_owner_email ||
      !property_embed_map_link
    ) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (!property_khatiyan_image || !property_siteplan_image) {
      setError("Both khatiyan and siteplan images are required.");
      setLoading(false);
      return;
    }

    try {
      // Convert images to base64
      const khatiyanBase64 = await convertToBase64(property_khatiyan_image);
      const siteplanBase64 = await convertToBase64(property_siteplan_image);

      // Prepare data for the backend
      const propertyData = {
        property_location,
        property_area,
        property_owner_name,
        property_owner_contact,
        property_owner_email,
        property_embed_map_link,
        khatiyan_img: khatiyanBase64, // Separate field for khatiyan image
        siteplan_img: siteplanBase64, // 
      };

      console.log("Submitting property data:", propertyData);

      const { data } = await axiosInstance.post(
        "/api/add-property",
        propertyData
      );
      console.log("Property added successfully:", data);

      // Reset form fields
      setPropertyLocation("");
      setPropertyArea("");
      setPropertyOwnerName("");
      setPropertyOwnerContact("");
      setPropertyOwnerEmail("");
      setPropertyEmbedMapLink("");
      setPropertyKhatiyanImage(null);
      setPropertySiteplanImage(null);
      setIsNewOwner(false);
      setResetCounter((prev) => prev + 1); // Trigger FileUpload reset

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response?.data || error.message
      );
      setError(
        error.response?.data?.error ||
          "Failed to add property. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-property">
      <div className="container">
        <h3>Add a property</h3>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleForm}>
          <div className="property-row">
            <div className="property-field">
              <label htmlFor="property_name">Property location</label>
              <input
                type="text"
                placeholder="Enter property location"
                id="property_location"
                name="property_location"
                required
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
                required
                value={property_area}
                onChange={(e) => setPropertyArea(e.target.value)}
              />
            </div>
          </div>
          <h3>Property owner</h3>
          <div className="property-row">
            <div className="property-field">
              <label htmlFor="property_owner_name">Owner name</label>
              <select
                id="property_owner_name"
                name="property_owner_name"
                value={isNewOwner ? "new" : property_owner_name}
                onChange={handleOwnerChange}
                onFocus={handleFocus}
                required
                onBlur={handleBlur}
                size={1} // Default size
              >
                <option value="">Select an owner</option>
                <option value="new">Add new owner</option>
                {owners.map((owner) => (
                  <option key={owner._id} value={owner.name}>
                    {owner.name}
                  </option>
                ))}
              </select>
              {isNewOwner && (
                <input
                  type="text"
                  placeholder="Enter new owner name"
                  value={property_owner_name}
                  onChange={(e) => setPropertyOwnerName(e.target.value)}
                  style={{ marginTop: "10px" }}
                />
              )}
            </div>
          </div>
          <div className="property-row">
            <div className="property-field">
              <label htmlFor="property_owner_contact">Owner contact</label>
              <input
                type="number"
                placeholder="Enter owner contact"
                id="property_owner_contact"
                required
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
                required
                name="property_owner_email"
                value={property_owner_email}
                onChange={(e) => setPropertyOwnerEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="property-row">
            <div className="property-field">
              <label htmlFor="property_embed_map_link">Property map link</label>
              <input
                type="text"
                placeholder="Enter map link"
                id="property_embed_map_link"
                required
                name="property_embed_map_link"
                value={property_embed_map_link}
                onChange={(e) => setPropertyEmbedMapLink(e.target.value)}
              />
            </div>
          </div>
          <div className="property-row">
            <div className="property-field">
              <h3 htmlFor="property_owner_khatiyan_image">
                Property khatiyan :
              </h3>
              <FileUpload
                setFileImage={setPropertyKhatiyanImage}
                reset={resetCounter}
              />
            </div>
          </div>
          <div className="property-row">
            <div className="property-field">
              <h3 htmlFor="property_owner_siteplan_image">
                Property siteplan :
              </h3>
              <FileUpload
                setFileImage={setPropertySiteplanImage}
                reset={resetCounter}
              />
            </div>
          </div>
          <div className="buttons">
            <button
              type="button"
              className="cancel"
              disabled={loading}
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
            <button type="submit" className="submit" disabled={loading}>
              {loading ? (
                <span className="loader"></span> // Add loader inside button
              ) : (
                "Add Property"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
