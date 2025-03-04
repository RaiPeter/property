const Property = require("../models/Property");

const createProperty = async (data) => {
  return await Property.create(data);
};

const getProperties = async () => {
  return await Property.aggregate([
    {
      $addFields: {
        land_area_numeric: { $toDouble: "$land_area" }, // Convert land_area to number
      },
    },
    {
      $addFields: {
        land_range: {
          $switch: {
            branches: [
              { case: { $lte: ["$land_area_numeric", 2] }, then: "2" },
              { case: { $lte: ["$land_area_numeric", 4] }, then: "4" },
              { case: { $lte: ["$land_area_numeric", 6] }, then: "6" },
              { case: { $lte: ["$land_area_numeric", 8] }, then: "8" },
              { case: { $lte: ["$land_area_numeric", 10] }, then: "10" },
              {
                case: { $lte: ["$land_area_numeric", 15] },
                then: "15",
              },
              {
                case: { $lte: ["$land_area_numeric", 20] },
                then: "20",
              },
            ],
            default: "25",
          },
        },
      },
    },
    {
      $group: {
        _id: { location: "$location", land_range: "$land_range" }, // Group by location & land range
        totalProperties: { $sum: 1 }, // Count properties in this group
      },
    },
    {
      $group: {
        _id: "$_id.location",
        landDistribution: {
          $push: {
            land_range: "$_id.land_range",
            totalProperties: "$totalProperties",
          },
        },
      },
    },
    { $sort: { _id: 1 } }, // Sort by location
  ]);
};

const getPropertyDetails = async (data) => {
  return await Property.aggregate([
    {
      $match: {
        location: data,
      },
    },
    {
      $lookup: {
        from: "propertyowners",
        localField: "owner_id",
        foreignField: "_id",
        as: "owner_details",
      },
    },
  ]);
};

module.exports = {
  createProperty,
  getProperties,
  getPropertyDetails,
};
