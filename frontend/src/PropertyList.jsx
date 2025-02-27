import React, { useEffect, useTransition } from "react";
import { useState } from "react";
import "./PropertyList.css";
import axios from "axios";
import axiosInstance from "./interceptor/interceptor";
import PriceRangeSlider from "./components/PriceRangeSlider";
import Card from "./components/Card";
import PropertyIcon from "../src/assets/property1.png";
import PropertyCard from "./components/PropertyCard";
import { useNavigate, useSearchParams } from "react-router";

const cities = [{ name: "Chicago" }, { name: "Arizona" }];

const options = ["All", "Office", "Building", "Shop", "Apartment", "House"];

const features = [
  "AC & Heating",
  "Clubhouse",
  "Fitness Center",
  "Swimming Pool",
  "Gym",
  "Garden",
  "Fireplace",
  "Balcony",
  "Security System",
  "Parking",
];

const style = ["A-Frame", "Office", "Building", "Industrial", "Shop"];
const PropertyList = () => {
  const [isPending, startTransition] = useTransition(); // 🔹 Add useTransition
  const [propertiesStats, setPropertiesStats] = useState(null)
  const [properties, setProperties] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  const [selected, setSelected] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState([]);
  const [priceRange, setPriceRange] = useState([]);
  console.log(priceRange, "under price ranfe");

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleChange = (option) => {
    if (option === "All") {
      setSelected(selected.includes("All") ? [] : options);
    } else {
      let updatedSelection = selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option];

      // If all options are selected, check "All"
      if (updatedSelection.length === options.length - 1) {
        updatedSelection = ["All", ...updatedSelection];
      } else {
        updatedSelection = updatedSelection.filter((item) => item !== "All");
      }

      setSelected(updatedSelection);
    }
  };

  const handleChangeFeatures = (option) => {
    if (selectedFeatures.includes(option)) {
      // Remove option if already selected
      setSelectedFeatures(selectedFeatures.filter((item) => item !== option));
    } else {
      // Add option if not selected
      setSelectedFeatures([...selectedFeatures, option]);
    }
  };
  const handleChangeStyle = (option) => {
    if (selectedStyle.includes(option)) {
      // Remove option if already selected
      setSelectedStyle(selectedStyle.filter((item) => item !== option));
    } else {
      // Add option if not selected
      setSelectedStyle([...selectedStyle, option]);
    }
  };
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const fetchFilteredProperties = async (filters) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value) && value.length > 0) {
          params.set(key, value.join(","));
        } else if (!Array.isArray(value)) {
          params.set(key, value);
        }
      }
    });

    try {
      const response = await axiosInstance.get(
        `/api/properties?${params.toString()}`
      );
      console.log("heasdfasdfasd");

      document.startViewTransition(() => {
        // flushSync(() => {
          setProperties(response.data); // 🔹 Ensure state is updated before animation starts
        // });
      });
    } catch (error) {
      console.error("Error fetching filtered properties:", error);
    }
  };

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    console.log(e.target);
    console.log(e.target.minSize); // Check if it's `undefined`
    console.log(e.target.maxSize);
    // Check if minSize exists in the form

    // Construct the filter data
    const filterData = {
      city: selectedCity, // Get city from dropdown
      type: selected.filter((item) => item !== "All"), // Send selected options excluding "All"
      features: selectedFeatures,
      style: selectedStyle,
      minSize: e.target.minSize.value || null,
      maxSize: e.target.maxSize.value || null,
      priceRange: [priceRange[0], priceRange[1]], // Assuming you store range in state
    };

    updateSearchParams(filterData);
    fetchFilteredProperties(filterData);
  };

  const updateSearchParams = (newFilters) => {
    const params = new URLSearchParams(searchParams);
    // console.log(params.getAll());

    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        const filteredValues = value
          .map((v) => String(v).trim())
          .filter((v) => v !== "");

        if (filteredValues.length > 0) {
          params.set(key, filteredValues.join(","));
        } else {
          params.delete(key);
        }
      } else if (value !== "" && value !== null && value !== undefined) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Ensure priceRange is only included if both minPrice and maxPrice exist
    if (
      !newFilters.priceRange ||
      newFilters.priceRange.length !== 2 ||
      newFilters.priceRange.some((v) => v === null || v === "" || isNaN(v))
    ) {
      params.delete("priceRange");
    }

    setSearchParams(params);
    navigate(`?${params.toString()}`, { replace: true });
  };

  useEffect(() => {
    const city = searchParams.get("city") || "";
    const type = searchParams.get("type")?.split(",") || [];
    const features = searchParams.get("features")?.split(",") || [];
    const style = searchParams.get("style")?.split(",") || [];
    const minSize = searchParams.get("minSize") || "";
    const maxSize = searchParams.get("maxSize") || "";
    const priceRangeParam = searchParams.get("priceRange")?.split(",") || [];
    const minPrice =
      priceRangeParam[0] && !isNaN(priceRangeParam[0])
        ? Number(priceRangeParam[0])
        : null;
    const maxPrice =
      priceRangeParam[1] && !isNaN(priceRangeParam[1])
        ? Number(priceRangeParam[1])
        : null;

    setSelectedCity(city);
    setSelected(type);
    setSelectedFeatures(features);
    setSelectedStyle(style);
    setPriceRange(
      minPrice !== null || maxPrice !== null ? [minPrice, maxPrice] : []
    );

    const filterData = {
      city,
      type,
      features,
      style,
      minSize,
      maxSize,
      priceRange:
        minPrice !== null || maxPrice !== null
          ? [minPrice, maxPrice]
          : undefined,
    };

    console.log("Fetching properties with filters:", filterData);

    const fetchData = async () => {
      try {
        // Fetch both filtered properties and dashboard stats
        const [filteredProperties, dashboardStats] = await Promise.all([
          fetchFilteredProperties(filterData), // Your existing function
          axiosInstance.get("/api/properties-stats") // API call for stats
        ]);
        console.log(dashboardStats.data);
        
        setPropertiesStats(dashboardStats.data); // Store stats in state
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
    // fetchFilteredProperties(filterData);
  }, [searchParams]);

  return (
    <div className="property-list">
      <div className="row">
        <Card
          name="Total Property"
          amount={propertiesStats.totalProperties}
          update="-3.27"
          imgSrc={PropertyIcon}
        />
        <Card
          name="Properties Available"
          amount={propertiesStats.availableProperties}
          update="-3.27"
          imgSrc={PropertyIcon}
        />
        <Card
          name="Properties Sold"
          amount={propertiesStats.soldProperties}
          update="-3.27"
          imgSrc={PropertyIcon}
        />
        <Card
          name="Total Income"
          amount={propertiesStats.totalIncome.toLocaleString()}
          update="-3.27"
          imgSrc={PropertyIcon}
        />
      </div>
      <div className="row">
        <div className="left">
          <form onSubmit={handleFilterSubmit}>
            <div className="header-row">
              <p>Filter</p>
              <p>Clear all x</p>
            </div>
            <div className="filter-row">
              <select name="city" id="" onChange={handleCityChange}>
                <option value="" disabled>
                  Choose a city
                </option>
                {cities.map((city, i) => (
                  <option value={city.name} key={i}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-row">
              <label htmlFor="">Type of place</label>
              <div className="checkbox-group">
                {options.map((option) => (
                  <label key={option} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selected.includes(option)}
                      onChange={() => handleChange(option)}
                    />
                    <span className="custom-checkbox"></span>
                    {option}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="price-range">Price Range</label>
              <PriceRangeSlider setPriceRange={setPriceRange} />
            </div>
            <div className="size-filter">
              <label className="size-label">Size</label>
              <div className="size-input-container">
                {/* Min Input */}
                <div className="size-input">
                  <input type="number" name="minSize" placeholder="Min" />
                  <span className="unit">sq ft</span>
                </div>

                {/* Max Input */}
                <div className="size-input">
                  <input type="number" name="maxSize" placeholder="Max" />
                  <span className="unit">sq ft</span>
                </div>
              </div>
            </div>
            <div className="filter-row">
              <label htmlFor="features">Features</label>
              <div className="checkbox-group">
                {features.map((option) => (
                  <label key={option} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(option)}
                      onChange={() => handleChangeFeatures(option)}
                    />
                    <span className="custom-checkbox"></span>
                    {option}
                  </label>
                ))}
              </div>
            </div>
            <div className="filter-row">
              <label htmlFor="style">Style</label>
              <div className="checkbox-group">
                {style.map((option) => (
                  <label key={option} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedStyle.includes(option)}
                      onChange={() => handleChangeStyle(option)}
                    />
                    <span className="custom-checkbox"></span>
                    {option}
                  </label>
                ))}
              </div>
            </div>
            <button type="submit">Apply Filters</button>
          </form>
        </div>

        <div className="right">
          {isPending ? (
            <p>Loading properties...</p> // 🔹 Show loading indicator during transition
          ) : (
            properties.map((property, i) => (
              // <div key={property._id} style={{ viewTransitionName: `property-${property._id}` }}>
              <PropertyCard
                key={property._id}
                id={property._id}
                name={property.property_name}
                price={property.property_price}
                status={property.property_status}
                bedrooms={property.property_bedrooms}
                bathrooms={property.property_bathrooms}
                features={property.property_features}
                image={property.property_image}
              />
              // </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyList;
