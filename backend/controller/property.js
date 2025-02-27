const { getPropertiesStatsService, getPropertiesService, createPropertyService} = require("../services/property.service");

const postProperty = async (req, res, next) => {
  if (
    !req.body.property_name ||
    !req.body.property_type ||
    !req.body.property_price ||
    !req.body.property_location ||
    !req.body.property_city ||
    !req.body.property_status ||
    !req.body.property_area ||
    !req.body.property_bedrooms ||
    !req.body.property_bathrooms ||
    !req.body.property_features ||
    !req.body.property_style ||
    !req.body.property_details ||
    !req.file?.filename
  ) {
    return res.status(400).json({ message: "All inputs are required." });
  }
  try {
    req.body.property_features = req.body.property_features
    .split(",")
    .map((f) => f.trim());
    const property = await createPropertyService(req);   

    return res.status(201).json(property);
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: e.message });
  }
};

const getProperties = async (req,res, next) =>{
  try{
    let { city, type, features, style, minSize, maxSize, priceRange } = req.query;
    console.log(req.query, "queries");

    let filter = {};

    if (city) filter.property_city = city;
    if (type) filter.property_type = { $in: type.split(",") };
    if (features) filter.property_features = { $all: features.split(",") };
    if (style) filter.property_style = { $in: style.split(",") };
    if (minSize || maxSize) {
      filter.size = {};
      if (minSize) filter.property_area .$gte = parseInt(minSize);
      if (maxSize) filter.property_area .$lte = parseInt(maxSize);
    }
    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split(",").map(Number);
      console.log(minPrice, maxPrice);
      
      filter.property_price = { $gte: minPrice, $lte: maxPrice };
    }

    console.log("Final filter:", JSON.stringify(filter, null, 2));  // Debugging
    
    const properties = await getPropertiesService(filter);
    console.log(properties.length);
    
    
    return res.status(200).json(properties);
  }catch(e){
    console.log(e.message);
    return res.status(500).json({message: e.message})
    
  }
}

const getPropertiesStats = async (req,res,next) =>{
  try{
    const { totalProperties, availableProperties, soldProperties, totalIncome, lastMonthProperties} = await getPropertiesStatsService();
  
    const propertyChange = (((totalProperties - lastMonthProperties) / lastMonthProperties) * 100).toFixed(2);

    return res.status(200).json({
      totalProperties,
      availableProperties,
      soldProperties,
      totalIncome,
      propertyChange,
      availableChange: propertyChange,
      soldChange: propertyChange, 
      incomeChange: propertyChange,
    });

  }catch(e){
    console.log(e.message);
    return res.status(500).json({message : e.message})
    
  }
}
module.exports = {
  postProperty,
  getProperties,
  getPropertiesStats
};
