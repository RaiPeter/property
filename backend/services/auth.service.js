const {
  createUser,
  findUserById,
  findUserByEmail,
  findUserByIdAndUpdate,
  findUserByIdRefreshToken,
} = require("../db/auth-db.js");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User.js");

const createUserService = async (data) => {
  try {
    const { email, password, username } = data;

    const oldUser = await findUserByEmail(email);
    if (oldUser) throw new Error("User Already Exists. Please login");

    // saving user with hased password
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });
    const user = await createUser(newUser);
    return user;
  } catch (e) {
    throw e;
  }
};

const loginUserService = async (email, password) => {
  try {
    const user = await findUserByEmail(email);
    if (!(user && (await bcrypt.compare(password, user.password)))) {
      return "Invalid credentials.";
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    const loggedInUser = await findUserById(user._id);
    console.log(loggedInUser, "Logged in successfully!");

    return { accessToken, refreshToken, loggedInUser };
  } catch (error) {
    console.log("Got an error", error);
    throw error;
    // res.status(500).json({message: error.message});
  }
};

const getUserService = async (email) => {
  try{
    const user = await findUserByEmail(email);
    return user;
  }catch(e){
    console.error("Error fetching a user", e);
    
  }
}

const logoutUserService = async (user) => {
  // Remove the refresh token from the user's information
  try {    
    await findUserByIdAndUpdate(user._id);
  } catch (e) {
    console.log(e.message);
    throw e;
  }
};
const refreshAccessTokenService = async (refreshToken) => {
  // If no refresh token is present, deny access with a 401 Unauthorized status
  if (!refreshToken) {
    throw new Error("Refresh token not found");
  }

  try {
    // Verify the incoming refresh token using the secret key
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_KEY
    );
    console.log(process.env.REFRESH_TOKEN_KEY, "refresh key");
    
    console.log('JWT Verification Success:', true);
    console.log('Decoded Token:', decodedToken);

    // Find the user associated with the refresh token
    const user = await findUserByIdRefreshToken(decodedToken?.id);
    console.log(user, "user");

    // If the user isn't found, deny access with a 404 Not Found status
    if (!user) {
      throw new Error("User not found");
    }

    // If the stored refresh token doesn't match the incoming one, deny access with a 401 Unauthorized status
    if (user?.refreshToken !== refreshToken) {
      console.log('Token mismatch detected');
      throw new Error("Refresh token is incorrect");
    }

    // Generate new access and refresh tokens for the user
    const accessToken = generateAccessToken(user._id);

    return { accessToken };
  } catch (error) {
    // Handle any errors during token refresh with a 500 Internal Server Error status
    throw error;
  }
};

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    // Find the user by ID in the database
    const user = await findUserById(userId);
    console.log(user, "genereate user");

    // Generate an access token and a refresh token
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save the refresh token to the user in the database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Return the generated tokens
    return { accessToken, refreshToken };
  } catch (error) {
    // Handle any errors that occur during the process
    throw error;
  }
};

module.exports = {
  createUserService,
  loginUserService,
  logoutUserService,
  refreshAccessTokenService,
  generateAccessAndRefreshTokens,
  getUserService
};
