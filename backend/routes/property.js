const express = require("express");

//some controller
const { postProperty, getProperties, getPropertiesStats } = require("../controller/property");
const { verifyJWT } = require("../middleware/auth.middleware");
const verifyRolesAndPermissions = require("../middleware/role.middleware");
const { upload } = require("../middleware/multer.middleware");

const router = express.Router();

router.post(
  "/property",
  verifyJWT,
  verifyRolesAndPermissions(["admin", "agent"], "create"),
  upload.single("file"),
  postProperty
);
router.get("/properties", verifyJWT, getProperties);
router.get("/properties-stats", verifyJWT, getPropertiesStats);


module.exports = router;
