const jwt = require("jsonwebtoken");

const generateAccessToken = (id) => {  
  return jwt.sign(
    { id }, 
    process.env.ACCESS_TOKEN_KEY, {
    expiresIn: "1min",
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign(
    { id },
    process.env.REFRESH_TOKEN_KEY, 
    {
      expiresIn: "30d",
    }
)};
      
module.exports = {
  generateAccessToken,
  generateRefreshToken
};