const { Property } = require("../models/Property");

const createProperty = async (data) => {
  return await Property.create(data);
};

const getProperties = async (filter) => {
  return await Property.find(filter);
};

const getAllProperties = async () => {
  return await Property.countDocuments();
};

const getAvailableProperties = async () => {
  return await Property.countDocuments({ property_status: "Available" });
};

const getSoldProperties = async () => {
  return await Property.countDocuments({ property_status: "Sold" });
};

const getIncomeFromSoldProperties = async () => {
  const totalIncomeData = await Property.aggregate([
    {
      $match: { property_status: "Sold" },
    },
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: "$property_price",
        },
      },
    },
  ]);
  const totalIncome =
    totalIncomeData.length > 0 ? totalIncomeData[0].totalIncome : 0;
  return totalIncome;
};

const getLastMonthProperties = async () => {
  return await Property.countDocuments({
    createdAt: {
      $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    },
  });
};
module.exports = {
  createProperty,
  getProperties,
  getAllProperties,
  getAvailableProperties,
  getSoldProperties,
  getIncomeFromSoldProperties,
  getLastMonthProperties,
};
