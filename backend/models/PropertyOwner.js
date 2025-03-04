const mongoose = require("mongoose");

const propertyOwnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    lands_owned: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
  },
  { timestamps: true }
);

const PropertyOwner = mongoose.model("PropertyOwner", propertyOwnerSchema);
module.exports = PropertyOwner;
