const {
  createPropertyOwner,
  getPropertyOwner,
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
//   const getPropertiesService = async (filter) => {
//     try {
//       const properties = await getProperties(filter);
//       console.log("Properties returned:", properties.length);

//       return properties;
//     } catch (error) {
//       console.error("Error fetching properties");
//       throw e;
//     }
//   };

module.exports = {
  createPropertyOwnerService,
  getPropertyOwnerService
};
