import React, { useState } from "react";

const MapEmbed = ({ embedUrl }) => (
  <div style={{ width: "100%", height: "450px", border: "1px solid #ccc" }}>
    {embedUrl ? (
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    ) : (
      <p>Enter a valid Google Maps link</p>
    )}
  </div>
);

export default MapEmbed ;