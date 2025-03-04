const {
  createProperty,
  getProperties,
  getPropertyDetails,
} = require("../db/property-db");

const createPropertyService = async (data) => {
  try {
    const savedProperty = await createProperty(data);
    return savedProperty;
  } catch (e) {
    console.error("Error saving property:", e);
    throw e;
  }
};

const getPropertiesService = async () => {
  try {
    const properties = await getProperties();
    console.log("Properties returned:", properties);

    return properties;
  } catch (error) {
    console.error("Error fetching properties");
    throw e;
  }
};

const getPropertyDetailsService = async (data) => {
  try{
    const propertyDetails = await getPropertyDetails(data);
    console.log(propertyDetails,"details or");
    
    return propertyDetails;
  }catch(e){
    console.error("Error fetching property details");
    throw e;
  }
}
module.exports = {
  createPropertyService,
  getPropertiesService,
  getPropertyDetailsService
};
