const {
  createProperty,
  getProperties,
  getAllProperties,
  getAvailableProperties,
  getSoldProperties,
  getIncomeFromSoldProperties,
  getLastMonthProperties,
} = require("../db/property-db");

const createPropertyService = async (data) => {
  try {
    const savedProperty = await createProperty({
      ...data.body,
      property_image: data.file.filename,
    });
    return savedProperty;
  } catch (e) {
    console.error("Error saving property:", e);
    throw e;
  }
};

const getPropertiesService = async (filter) => {
  try {
    const properties = await getProperties(filter);
    console.log("Properties returned:", properties.length);

    return properties;
  } catch (error) {
    console.error("Error fetching properties");
    throw e;
  }
};

const getPropertiesStatsService = async () => {
  try {
    const totalProperties = await getAllProperties();
    const availableProperties = await getAvailableProperties();
    const soldProperties = await getSoldProperties();
    const totalIncome = await getIncomeFromSoldProperties();
    const lastMonthProperties = await getLastMonthProperties();
    return {
      totalProperties,
      availableProperties,
      soldProperties,
      totalIncome,
      lastMonthProperties,
    };
  } catch (e) {
    console.error("Error fetching stats");
    throw e;
  }
};

module.exports = {
  createPropertyService,
  getPropertiesService,
  getPropertiesStatsService,
};
