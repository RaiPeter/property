import React, { useState } from "react";
import "./ImageShow.css"; // Ensure you create a CSS file for styling

const ImageShow = ({ url }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Thumbnail Image */}
      <div className="popup">
        <img src={url} alt="Thumbnail" onClick={() => setIsOpen(true)} />
      </div>

      {/* Popup Modal */}
      {isOpen && (
        <div className="show" onClick={() => setIsOpen(false)}>
          <div className="overlay"></div>
          <div className="img-show">
            <span onClick={() => setIsOpen(false)}>X</span>
            <img src={url} alt="Full View" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageShow;
