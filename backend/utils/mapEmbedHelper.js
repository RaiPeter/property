// Function to generate Google Maps embed URL
const https = require("https");
const http = require("http");
const url = require("url");

const getEmbedMapUrl = (url) => {
    if (!url) return { error: "No URL provided" };
  
    // If it's already an embedded link, return as is
    if (url.includes("www.google.com/maps/embed")) {
      return { embedUrl: url };
    }
  
    // If it's a Google Maps Place URL with coordinates
    const coordsMatch = url.match(/@([-.\d]+),([-.\d]+)/);
    if (coordsMatch) {
      const lat = coordsMatch[1];
      const lng = coordsMatch[2];
      return {
        embedUrl: `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin`,
      };
    }
  
    // If it's a Google Maps Short URL (maps.app.goo.gl)
    if (url.includes("maps.app.goo.gl")) {
      return { shortUrl: url };
    }
  
    return { error: "Invalid Google Maps URL" };
  };
  
  // Function to expand Google Maps short URL
  const expandShortUrl = async (shortUrl) => {
    return new Promise((resolve, reject) => {
        const parsedUrl = url.parse(shortUrl);
        const httpModule = parsedUrl.protocol === "https:" ? https : http;
    
        const req = httpModule.get(shortUrl, (res) => {
          if (res.headers.location) {
            resolve(res.headers.location); // Final expanded URL
          } else {
            resolve(shortUrl); // No redirect, return original URL
          }
        });
    
        req.on("error", (err) => {
          reject("Error expanding URL: " + err.message);
        });
    
        req.end();
      });
  };

  module.exports = {
    getEmbedMapUrl,
    expandShortUrl
  }