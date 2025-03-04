const express = require("express");

//some controller
const { postProperty, getProperties, getPropertyDetails } = require("../controller/property");
const { verifyJWT } = require("../middleware/auth.middleware");
const verifyRolesAndPermissions = require("../middleware/role.middleware");
const { upload } = require("../middleware/multer.middleware");

const router = express.Router();
console.log('Property Controller:', { postProperty, getProperties, getPropertyDetails });
console.log('Verify JWT:', verifyJWT);
console.log('Verify Roles:', verifyRolesAndPermissions);
router.post(
  "/add-property",
  verifyJWT,
  verifyRolesAndPermissions(["admin", "agent"], "create"),
  upload.fields([
    { name: "khatiyan_img", maxCount: 1 },
    { name: "siteplan_img", maxCount: 1 }
  ]),
  postProperty
);
router.get("/properties", verifyJWT, getProperties);
router.get("/property/:location", verifyJWT, getPropertyDetails);



module.exports = router;
