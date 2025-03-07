const express = require("express");

//some controller
const { postProperty, getProperties, getPropertyDetails, getPropertyOwners } = require("../controller/property");
const { verifyJWT } = require("../middleware/auth.middleware");
const verifyRolesAndPermissions = require("../middleware/role.middleware");

const router = express.Router();
console.log('Property Controller:', { postProperty, getProperties, getPropertyDetails });
console.log('Verify JWT:', verifyJWT);
console.log('Verify Roles:', verifyRolesAndPermissions);
router.post(
  "/add-property",
  verifyJWT,
  verifyRolesAndPermissions(["admin", "agent"], "create"),
  postProperty
);
router.get("/properties", verifyJWT, getProperties);
router.get("/property/:location", verifyJWT, getPropertyDetails);

router.get("/owners", verifyJWT, getPropertyOwners)


module.exports = router;
