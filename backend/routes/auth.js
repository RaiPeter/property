const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  protected,
} = require("../controller/auth.js");
const { verifyJWT } = require("../middleware/auth.middleware.js");
const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);

// protected route
router.post("/verify-token", verifyJWT, protected);
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh", refreshAccessToken);

module.exports = router;
