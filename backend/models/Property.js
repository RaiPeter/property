const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PropertyOwner",
      required: true,
    },
    land_area: { type: String, required: true },
    maps_link: { type: String, required: true },
    khatiyan_image: { type: String, required: true },
    siteplan_image: { type: String, required: true },
    location: { type: String, required: true },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);
module.exports = Property;
