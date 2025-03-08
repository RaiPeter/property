const { User } = require("../models/User");

const createUser = async (user) => {
  return await User.create(user);
};

const findUserById = async (id) => {
  return await User.findById(id).select("-password -refreshToken");
};
const findUserByIdRefreshToken = async (id) => {
  return await User.findById(id).select("email username role refreshToken");
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email: email });
};

const findUserByIdAndUpdate = async (id) => {
  return await User.findByIdAndUpdate(
    id,
    {
      $unset: { refreshToken: 1 },
    },
    { new: true }
  );
};

module.exports = {
  createUser,
  findUserById,
  findUserByEmail,
  findUserByIdAndUpdate,
  findUserByIdRefreshToken
};
