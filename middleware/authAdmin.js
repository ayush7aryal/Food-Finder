const Users = require("../models/userModel");

const authAdmin = async (req, res, next) => {
  try {
    //User info by id
    const user = await Users.findById(req.user.id);
    if (user.role == -1)
      return res.status(400).json({ msg: "Not the owner! Access denied!" });
    req.user.role = user.role;
    next();
  } catch (err) {
    return res.status(500).json(err.msg);
  }
};

module.exports = authAdmin;
