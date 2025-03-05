const Property = require("../models/Property");
const PropertyOwner = require("../models/PropertyOwner");
const {
  getPropertyOwnerService,
  createPropertyOwnerService,
  getPropertyOwnersService,
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

    if (!owner) {
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
      return res.status(500).json({ message: "Failed to create or retrieve owner." });
    }

    // Generate embed map URL (for both new and existing owners)
    let embedResult = await getEmbedMapUrl(property_embed_map_link);
    if (!embedResult.embedUrl) {
      return res.status(400).json({
        message: "Failed to generate embed map URL",
        error: embedResult.error || "Unknown error",
        finalUrl: embedResult.finalUrl,
      });
    }
    const embedUrl = embedResult.embedUrl;
    console.log("Generated embed URL:", embedUrl);

    // Create new property (shared logic for new or existing owner)
    const property = new Property({
      owner_id: owner?._id,
      land_area: property_area,
      maps_link: embedUrl,
      khatiyan_image: req.files.khatiyan_img[0].filename,
      siteplan_image: req.files.siteplan_img[0].filename,
      location: property_location,
    });
    console.log("Property to save:", property);

    const savedProperty = await createPropertyService(property);
    console.log("Property Saved:", savedProperty);

    // Link property to owner
    owner.lands_owned.push(savedProperty._id);
    await owner.save();
    console.log("Owner updated with new property:", owner);

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

const getPropertyOwners = async (req,res,next) => {
  try{
    const propertyOwners = await getPropertyOwnersService();
    return res.status(200).json(propertyOwners);
  }catch(e) {
    return res.status(500).json({message : e.message})
  }
}
module.exports = {
  postProperty,
  getProperties,
  getPropertyDetails,
  getPropertyOwners
};
