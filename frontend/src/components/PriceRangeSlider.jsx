import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css"; // Import default styles
import "./PriceRangeSlider.css"; // Custom styles

const PriceRangeSlider = ({setPriceRange}) => {
  const [range, setRange] = useState([10, 1500]); // Initial price range

  const handleChange = (value) => {
    setRange(value);
    setPriceRange(value);
    console.log(value);
    
  };

  return (
    <div className="price-range-container">
      <Slider
        range
        min={10}
        max={3500}
        defaultValue={range}
        onChange={handleChange}
        styles={{
          track: { backgroundColor: "#ff5a3c", height: 5 },
          handleStyle: [
            { backgroundColor: "#ff5a3c", borderColor: "#ff5a3c" },
            { backgroundColor: "#ff5a3c", borderColor: "#ff5a3c" }
          ]
        }}
      />
      <div className="price-labels">
        <span>${range[0]}</span>
        <span>${range[1]}</span>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
