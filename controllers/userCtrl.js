const Users = require("../models/userModel");
const Restaurant = require("../models/restaurantModel");
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

      //Login success so creating web tokens
      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

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
  order: async (req, res) => {
    try {
      const ordered_item = req.body.ordered_item; // [{ordered, quantity}]
      const id = req.user.id;
      const user = await Users.findById(id, {
        _id: 0,
        firstName: 1,
        lastName: 1,
        email: 1,
        phone: 1,
      });
      console.log(ordered_item[0].ordered.restaurant);

      //in result: {cart, quantity} where cart also saves restaurantid as well as menu
      //format for menu : {title, description, price, image}
      ordered_item.map(async (result, index) => {
        var order = {
          menu: result.ordered.menu,
          quantity: result.quantity,
          location: {
            latitude: 0,
            longitude: 0,
          },
          user: user,
        };
        Restaurant.updateOne(
          { id: result.ordered.restaurant },
          { $push: { orderList: order } }
        ).then((err, result) => {
          if (err) return res.json({ msg: err.message });
        });

        const restaurant = await Restaurant.findOne({id: result.ordered.restaurant},{_id:0, id:1, name:1})
        if(!restaurant) return res.status(500).json({msg: err.message});

        var order_user = {
          menu: result.ordered.menu,
          quantity: result.quantity,
          restaurant: restaurant,
          location: {
            latitude: 0,
            longitude: 0,
          },
          status: "Pending",
        };

        Users.updateOne({ _id: id }, { $push: { order: order_user } }).then(
          (err, result) => {
            if (err) return res.json({ msg: err.message });

            res.json({ msg: "User updated succesfully!" });
          }
        );
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getOrder : async (req,res) =>{
    const order = await Users.findById({_id: req.user.id}, {_id:0, order:1})
    if(!order) return res.status(500).json({msg:err.message});
    res.json({order});
  }
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "12h" });
};

const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN, { expiresIn: "7d" });
};

module.exports = userCtrl;
