const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    property_name: {
      type: String,
      required: true,
    },
    property_type: {
      type: String,
      required: true,
      enum: ["Apartment", "House", "Office", "Building", "Shop"],
    },
    property_price: {
      type: Number,
      required: true,
    },
    property_location: {
      type: String,
      required: true,
    },
    property_city: {
      type: String,
      required: true,
    },
    property_status: {
      type: String,
      required: true,
    },
    property_area: {
      type: Number,
      required: true,
    },
    property_bedrooms: {
      type: Number,
      required: true,
    },
    property_bathrooms: {
      type: Number,
      required: true,
    },
    property_features: { type: [String], default: [] },
    property_style: {
      type: String,
      enum: ["A-Frame", "Office", "Building", "Industrial", "Shop"],
      required: true,
    },
    property_details: {
      type: String,
      required: true,
    },
    property_image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);

module.exports = {
  Property,
};
