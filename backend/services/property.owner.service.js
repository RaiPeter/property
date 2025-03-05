const {
  createPropertyOwner,
  getPropertyOwner,
  getPropertyOwners,
} = require("../db/property-owner-db");

const createPropertyOwnerService = async (data) => {
  try {
    const savedPropertyOwner = await createPropertyOwner(data);
    return savedPropertyOwner;
  } catch (e) {
    console.error("Error saving property owner:", e);
    throw e;
  }
};

const getPropertyOwnerService = async (data) => {
  try {
    console.log(data);
    
    const propertyOwner = await getPropertyOwner(data);
    console.log(propertyOwner, "asdf");
    
    return propertyOwner;
  } catch (e) {
    console.error("Error getting a property");
    throw e;
  }
};

const getPropertyOwnersService = async () => {
  try {    
    const propertyOwners = await getPropertyOwners();
    console.log(propertyOwners, "asdf");
    
    return propertyOwners;
  } catch (e) {
    console.error("Error getting property owners");
    throw e;
  }
}

module.exports = {
  createPropertyOwnerService,
  getPropertyOwnerService,
  getPropertyOwnersService
};
