const User = require("../model/user.model");
const { response } = require("../utils");


const handleGetAllUsers = async (req, res) => {
  try {
    // GET ALL USERS, SORTED BY NAME IN ASCENDING ORDER
    const users = await User.find({}).sort({ firstname: "asc" }).exec();
    res.status(200).send(response("All users", users));
  } catch (error) {
    res.status(400).send(response(error.message, null, false));
  }
}


const handleGetUser = async (req, res) => {
  try {
    // ENSURE THERE'S USER ID IN THE REQUEST PARAMS
    if(!req.params.id) throw new Error("User id required")

    const user = await User.find({ _id: req.params.id });
    res.status(200).send(response("User", user));
  } catch (error) {
    res.status(400).send(response(error.message, null, false));
  }
}



const handleUpdateUser = async (req, res) => {
  try {
    // ENSURE THERE'S USER ID IN THE REQUEST PARAMS
    if(!req.params.id) throw new Error("User id required")

    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(response("User updated!", user));
  } catch (error) {
    res.status(400).send(response(error.message, null, false));
  }
}


const handleDeleteUser = async (req, res) => {
  try {
    // ENSURE THERE'S USER ID IN THE REQUEST PARAMS
    if(!req.params.id) throw new Error("User id required")

    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).send(response("User deleted!", user));
  } catch (error) {
    res.status(400).send(response(error.message, null, false));
  }
}


module.exports = {
  handleGetAllUsers,
  handleUpdateUser,
  handleDeleteUser,
  handleGetUser
}