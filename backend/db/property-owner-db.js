const PropertyOwner  = require("../models/PropertyOwner");
console.log(PropertyOwner, "owner");

const createPropertyOwner = async (data) => {
  return await PropertyOwner.create(data);
};

const getPropertyOwners = async () => {
  return await PropertyOwner.find();
}

const getPropertyOwner = async (filter) => {
  console.log(filter,"filter");
  
  return await PropertyOwner.findOne(filter);
};

const getAllPropertyOwnersCount = async () => {
  return await PropertyOwner.countDocuments();
};

module.exports = {
  createPropertyOwner,
  getPropertyOwner,
  getAllPropertyOwnersCount,
  getPropertyOwners
};
