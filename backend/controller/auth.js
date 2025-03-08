const {
  createUserService,
  loginUserService,
  logoutUserService,
  refreshAccessTokenService,
  getUserService,
} = require("../services/auth.service");

const registerUser = async (req, res, next) => {
  try {
    if (!(req.body.email && req.body.password && req.body.username)) {
      return res.status(400).json({ message: "All inputs are required." });
    }

    const user = await createUserService(req.body);

    console.log("User registers successfully!");

    return res
      .status(201)
      .json({ user: user._id, message: "User created successfully" });
  } catch (err) {
    console.log("Got an error", err);
    return res.status(500).json({ message: e.message });
  }
};

const loginUser = async (req, res) => {
  try {
    console.log("Request headers:", req.headers);
    console.log("Request body:", req.body);
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json({ message: "All inputs are required." });
    }

    const user = await getUserService(email);
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not registered" });
    }

    const { accessToken, refreshToken, loggedInUser } = await loginUserService(
      email,
      password
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    };

    res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options);

    return res.status(200).json({
      message: "Logged in successfully",
      loggedInUser,
      accessToken,
      refreshToken
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: e.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    await logoutUserService(req.user);
    // console.log(req.body,"hasdf", req.file.filename);
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Enable in a production environment with HTTPS
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    };

    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);

    return res
      .status(200)
      .json({ user: {}, message: "Logged out successfully" });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: e.message });
  }
};

const refreshAccessToken = async (req, res) => {
  // const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken; // ✅ Get token from cookies
  let refreshToken;

  // Check body for refreshToken (sent via headers or body)
  if (req.body.refreshToken) {
    refreshToken = req.body.refreshToken;
    console.log('Refresh token from body:', refreshToken);
  }

  // Fallback to cookie
  if (!refreshToken && req.cookies.refreshToken) {
    refreshToken = req.cookies.refreshToken;
    console.log('Refresh token from cookie:', refreshToken);
  }

  if (!refreshToken) {
    return res.status(400).json({ error: 'No refresh token provided' });
  }

  try {
    const { accessToken } = await refreshAccessTokenService(refreshToken);
    console.log("access token refreshed", accessToken);
    
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Enable in a production environment with HTTPS
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    };
    
    res.cookie("accessToken", accessToken, options);

    return res.status(200).json({ accessToken, message: "Access token refreshed" });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: e.message });
  }
};

const protected = async (req, res) => {
  try {
    return res.json({
      message: "You have access to this route!",
      user: req.user,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: e.message });
  }
};
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  protected,
};
