const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userCtrl = {
  register: async (req, res) => {
    try {
      const { firstName, lastName, email, phone, password } = req.body;
      const user = await Users.findOne({ email });
      if (user) return res.status(400).json({ msg: "User already exists" });
      if (password.length < 8)
        return res
          .status(400)
          .json({ msg: "Password must be of at least 8 characters" });

      const encrypted_pass = await bcrypt.hash(password, 10);

      const newUser = new Users({
        firstName,
        lastName,
        email,
        phone,
        password: encrypted_pass,
      });
      await newUser.save();

      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });

      res.json({
        accesstoken: accesstoken,
        refreshtoken: refreshtoken,
        msg: "Registered successfully!",
      });
      // res.json({msg: "Registered successfully!"})
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });
      if (!user)
        return res.status(400).json({ msg: "No match found. Register first" });
      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ msg: "Wrong password!" });
      }
      const id = user._id + "";

      //Login success so creating web tokens
      const accesstoken = createAccessToken({ id: id });
      const refreshtoken = createRefreshToken({ id: id });

      res.json({ accesstoken: accesstoken, refreshtoken: refreshtoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      await res.clearCookie("refreshtoken");
      return res.json({ msg: "Logged out successfully!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) return res.json({ msg: "User not authenticated" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) return res.status(400).json({ msg: err.message });
        const accesstoken = createAccessToken({ id: user.id });
        res.json({ user, accesstoken });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("-password");
      if (!user) return res.status(400).json({ msg: "User not found!" });
      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  roleChange: async (req, res) => {
    try {
      await Users.findByIdAndUpdate(req.user.id, { $set: { role: 1 } });
      res.json({ msg: "Updated successfully!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      await Users.remove({ _id: req.user.id });
      res.json({ msg: "User deleted successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  pushCart: async (req, res) => {
    try {
      console.log(req.body);
      const { cart } = req.body;
      await Users.updateOne({ _id: req.user.id }, { $push: { cart: cart } });
      res.json({ msg: "Added to cart successfully!" });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ msg: err.message });
    }
  },
  changeCart: async (req, res) => {
    try {
      const { cart } = req.body;
      console.log(cart);
      await Users.updateOne({ _id: req.user.id }, { $set: { cart: cart } });
      res.json({ msg: "Cart changed successfully! :)" });
    } catch {
      return res.status(500).json({ msg: err.message });
    }
  },
  cookie: async (req, res) => {
    try {
      const id = "60b27173f3d8832bd83fac89";
      const accesstoken = createAccessToken({ id: id });
      const refreshtoken = createRefreshToken({ id: id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
        domain: "http://localhost:3000",
        path: "/user/refreshToken",
      });

      res.json({ accesstoken: accesstoken });
    } catch {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "12h" });
};

const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN, { expiresIn: "7d" });
};

module.exports = userCtrl;
