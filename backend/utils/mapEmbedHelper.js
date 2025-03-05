const https = require("https");

const getEmbedMapUrl = async (inputUrl) => {
  if (!inputUrl) return { error: "No URL provided" };

  if (inputUrl.includes("www.google.com/maps/embed")) {
    return { embedUrl: inputUrl };
  }

  const extractCoordinates = (urlString, originalUrl) => {
    const decodedUrl = decodeURIComponent(urlString);
    console.log("Extracting coordinates from (decoded):", decodedUrl);

    // Match decimal coordinates after @ (e.g., @26.722067,88.386738)
    let match = decodedUrl.match(/@([-]?\d+\.\d+),([-]?\d+\.\d+)/);
    if (match) {
      console.log("Matched @ pattern:", match[1], match[2]);
      return { lat: match[1], lng: match[2] };
    }

    // Match coordinates in data parameter (e.g., !3d26.7222799!4d88.3814454)
    match = decodedUrl.match(/!3d([-]?\d+\.\d+)!4d([-]?\d+\.\d+)/);
    if (match) {
      console.log("Matched data pattern:", match[1], match[2]);
      return { lat: match[1], lng: match[2] };
    }

    // Match coordinates in query param (e.g., ?q=26.7220556,88.3867500)
    match = decodedUrl.match(/[?&]q=([-]?\d+\.\d+),([-]?\d+\.\d+)/);
    if (match) {
      console.log("Matched query pattern:", match[1], match[2]);
      return { lat: match[1], lng: match[2] };
    }

    // Match coordinates in search format (e.g., /search/26.788964,+88.364274) - for short URL redirects
    if (originalUrl.includes("maps.app.goo.gl")) {
      const searchIndex = decodedUrl.indexOf("/search/");
      if (searchIndex !== -1) {
        const searchPart = decodedUrl.substring(searchIndex);
        console.log("Extracted search part:", searchPart);
        const searchRegex = /\/search\/(\d+\.\d+),\+(\d+\.\d+)/; // Simplified to match ,+ explicitly
        let searchMatch = searchPart.match(searchRegex);
        console.log("Testing search regex on:", searchPart);
        console.log("Search regex result:", searchMatch);
        if (searchMatch) {
          console.log("Matched search pattern (short URL):", searchMatch[1], searchMatch[2]);
          return { lat: searchMatch[1], lng: searchMatch[2] };
        } else {
          console.log("Search pattern failed to match, expected format: /search/lat,+lng");
        }
      } else {
        console.log("No /search/ found in URL");
      }
    }

    console.log("No coordinate match found in URL");
    return null;
  };

  const expandShortUrl = async (shortUrl, maxRedirects = 5, totalTimeoutMs = 10000) => {
    let currentUrl = shortUrl;
    let redirects = 0;

    const followRedirect = (url) => {
      return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
          hostname: urlObj.hostname,
          path: urlObj.pathname + urlObj.search,
          headers: { 
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Referer": "https://www.google.com/",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1"
          },
          timeout: 2000
        };

        console.log("Making request to:", url);
        const req = https.get(options, (res) => {
          console.log(`Response status code: ${res.statusCode}`);
          if (res.statusCode === 301 || res.statusCode === 302) {
            const nextUrl = res.headers.location;
            console.log("HTTP Redirect to:", nextUrl);
            resolve({ redirect: nextUrl });
          } else {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
              console.log("Response body excerpt:", data.substring(0, 200));
              const placeMatch = data.match(/https:\/\/www\.google\.com\/maps\/place\/[^"'<>\s]+/);
              if (placeMatch) {
                console.log("Found place URL in response:", placeMatch[0]);
                resolve({ final: placeMatch[0] });
              } else {
                console.log("No place URL found, using current:", url);
                resolve({ final: url });
              }
            });
          }
        });

        req.on("timeout", () => {
          req.destroy();
          console.log("Request timed out for:", url);
          resolve({ final: url });
        });

        req.on("error", (err) => {
          console.log("Request error for:", url, "Error:", err.message);
          reject(err);
        });
        req.end();
      });
    };

    return Promise.race([
      (async () => {
        while (redirects < maxRedirects) {
          const result = await followRedirect(currentUrl);
          
          if (result.final) {
            console.log("Final URL after redirects:", result.final);
            return result.final;
          }
          if (result.redirect) {
            currentUrl = result.redirect.startsWith("http") 
              ? result.redirect 
              : `https://www.google.com${result.redirect}`;
            redirects++;
            console.log("Redirected to:", currentUrl);
            
            if (currentUrl.includes("maps/place")) {
              return currentUrl;
            }
          }
        }
        console.log("Max redirects reached, final URL:", currentUrl);
        return currentUrl;
      })(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Total timeout exceeded")), totalTimeoutMs)
      )
    ]);
  };

  try {
    let finalUrl = inputUrl;

    if (inputUrl.includes("maps.app.goo.gl")) {
      finalUrl = await expandShortUrl(inputUrl);
    }

    const coords = extractCoordinates(finalUrl, inputUrl);
    if (coords) {
      const { lat, lng } = coords;
      return {
        embedUrl: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0:0x0!2z${encodeURIComponent(
          `${lat},${lng}`
        )}!5e0!3m2!1sen!2sus!4v${Date.now()}`
      };
    }

    return { error: "Invalid URL format. Please use a Google Maps short URL (maps.app.goo.gl) or a /place/ URL.", finalUrl };
  } catch (error) {
    return { error: `Error processing URL: ${error.message}`, finalUrl };
  }
};

// Test function
async function testUrls() {
  const testUrls = [
    "https://www.google.com/maps/@26.7285745,88.3908542,857m/data=!3m1!1e3?entry=ttu&g_ep=EgoyMDI1MDMwMi4wIKXMDSoASAFQAw%3D%3D"
    // "https://maps.app.goo.gl/EfAEEEbNfS2EkCnC7", // Mobile
    // "https://www.google.com/maps/place/26%C2%B043'19.4%22N+88%C2%B023'12.3%22E/@26.722067,88.386738,751m/data=!3m2!1e3!4b1!4m4!3m3!8m2!3d26.722067!4d88.386738",
    // "https://maps.app.goo.gl/JgE7r8e2pyneytif6?g_st=com.google.maps.preview.copy", // Mobile
    // "https://maps.app.goo.gl/ZYYYtzX5RTSQJRq26", // Desktop
    // "https://maps.app.goo.gl/rC4o2K1vtLCycByx5" // Desktop
    ,"https://maps.app.goo.gl/Ph2LgYkEB3JNTd2Y6"
  ];

  for (const testUrl of testUrls) {
    const result = await getEmbedMapUrl(testUrl);
    console.log(`Input: ${testUrl}`);
    console.log(`Output:`, result);
    console.log("---");
  }
}

testUrls();

module.exports = { getEmbedMapUrl };