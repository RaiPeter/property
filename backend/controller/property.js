const Property = require("../models/Property");
const PropertyOwner = require("../models/PropertyOwner");
const {
  getPropertyOwnerService,
  createPropertyOwnerService,
} = require("../services/property.owner.service");
const {
  getPropertiesService,
  createPropertyService,
  getPropertyDetailsService,
} = require("../services/property.service");
const { getEmbedMapUrl, expandShortUrl } = require("../utils/mapEmbedHelper");

const postProperty = async (req, res, next) => {
  console.log("body ", req.body);
  console.log("files ", req.files);
  console.log("Khatiyan Image File:", req.files.khatiyan_img[0]);
  console.log("Siteplan Image File:", req.files.siteplan_img[0]);
  if (
    !req.body.property_location ||
    !req.body.property_area ||
    !req.body.property_owner_name ||
    !req.body.property_owner_contact ||
    !req.body.property_owner_email ||
    !req.files ||
    !req.files?.khatiyan_img?.[0] ||
    !req.files?.siteplan_img?.[0]
  ) {
    return res.status(400).json({ message: "All inputs are required." });
  }
  try {
    const {
      property_location,
      property_area,
      property_owner_name,
      property_owner_contact,
      property_owner_email,
      property_embed_map_link,
    } = req.body;

    console.log(req.body, "aasdfc");

    // Check if the owner already exists
    let owner = await getPropertyOwnerService({ name: property_owner_name });
    console.log(owner, "owenasd");

    if (!owner || owner !== null) {
      // Create a new landowner if not exists
      owner = new PropertyOwner({
        name: property_owner_name,
        contact: property_owner_contact,
        email: property_owner_email,
        lands_owned: [],
      });
      owner = await createPropertyOwnerService(owner);
    }
    if (!owner?._id) {
      return res.status(500).json({ message: "Failed to create owner." });
    }
    // for map link

    let embedResult = getEmbedMapUrl(property_embed_map_link);

    if (embedResult.shortUrl) {
      // If it's a short link, expand it first
      const expandedUrl = await expandShortUrl(embedResult.shortUrl);
      if (!expandedUrl)
        return res.status(400).json({ error: "Failed to expand short URL" });

      embedResult = getEmbedMapUrl(expandedUrl);
    }
    console.log("embned", embedResult);

    // return res.json(embedResult);
    const property = new Property({
      owner_id: owner?._id,
      land_area: property_area,
      maps_link: embedResult.embedUrl,
      // maps_link : property_embed_map_link,
      khatiyan_image: req.files?.khatiyan_img[0]?.filename,
      siteplan_image: req.files?.siteplan_img[0]?.filename,
      location: property_location,
    });
    console.log(property, " proerty asdf");

    const savedProperty = await createPropertyService(property);
    console.log("Property Saved:", savedProperty);

    // Link land to owner
    owner.lands_owned.push(savedProperty._id);
    await owner.save();

    return res.status(201).json(savedProperty);
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: e.message });
  }
};

const getProperties = async (req, res, next) => {
  try {
    const properties = await getPropertiesService();
    console.log(properties);

    return res.status(200).json(properties);
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: e.message });
  }
};

const getPropertyDetails = async (req,res, next) => {
  try{
    const { location } = req.params;
    console.log(location,"locasd f");
    
    const propertyDetails = await getPropertyDetailsService(location);
    return res.status(200).json(propertyDetails);
  }catch(e){
    return res.status(500).json({ message: e.message });
  }
}
module.exports = {
  postProperty,
  getProperties,
  getPropertyDetails
};
