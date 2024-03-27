const Users = require("../models/userModel");
const Restaurant = require("../models/restaurantModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "12h" });
};

const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN, { expiresIn: "7d" });
};

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
        role: -1,
      });
      await newUser.save();

      const accesstoken = createAccessToken({
        id: newUser._id,
        role: newUser.role,
      });
      const refreshtoken = createRefreshToken({
        id: newUser._id,
        role: newUser.role,
      });

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
      const accesstoken = createAccessToken({ id: user._id, role: user.role });
      const refreshtoken = createRefreshToken({
        id: user._id,
        role: user.role
      });

      res.json({
        accesstoken: accesstoken,
        refreshtoken: refreshtoken,
        role: user.role
      });
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
        const accesstoken = createAccessToken({ id: user.id, role: user.role });
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
  updateInfo: async (req, res) => {
    try {
      const { tLoc } = req.body;
      await Users.updateOne({ _id: req.user.id }, { $set: { dLoc: tLoc } });
      res.json({ msg: "Location set success!" });
    } catch (err) {
      return res
        .status(500)
        .json({ msg: "Couldn't set the Location. Try again!" });
    }
  },
  roleChange: async (req, res) => {
    try {
      const restaurant_id = req.body.id;
      await Users.findByIdAndUpdate(req.user.id, {
        $set: { role: restaurant_id },
      });
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
        order: 1,
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
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            id: user.order.length,
          },
          status: "Pending",
        };
        Restaurant.updateOne(
          { id: result.ordered.restaurant },
          { $push: { orderList: order } }
        ).then((err, result) => {
          if (err) return res.json({ msg: err.message });
        });

        const restaurant = await Restaurant.findOne(
          { id: result.ordered.restaurant },
          { _id: 0, id: 1, name: 1 }
        );
        if (!restaurant) return res.status(500).json({ msg: err.message });

        var order_user = {
          id: user.order.length,
          menu: result.ordered.menu,
          quantity: result.quantity,
          restaurant: restaurant,
          location: {
            latitude: 0,
            longitude: 0,
          },
          status: "Pending",
        };

        await Users.updateOne({ _id: id }, { $push: { order: order_user } });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getOrder: async (req, res) => {
    const order = await Users.findById(
      { _id: req.user.id },
      { _id: 0, order: 1 }
    );
    if (!order) return res.status(500).json({ msg: err.message });
    res.json({ order });
  },
  cancelOrder: async (req, res) => {
    const { order, index } = req.body;
    const res_order = await Restaurant.findOne(
      { id: order[index].restaurant.id },
      { _id: 0, orderList: 1 }
    );
    const { email } = await Users.findById(req.user.id, { _id: 0, email: 1 });
    var temp = null;
    const orderList = res_order.orderList.filter((result) => {
      console.log("order id: ", order[index].id);
      console.log("user id: ", result.user.id);
      if (
        result.user.email === email &&
        order[index].id === result.user.id &&
        result.status === "Pending"
      ) {
        temp = order.splice(index, 1);
        return false;
      }
      return true;
    });
    if (temp === null) {
      return res.json({
        msg: "The order is already accepted. Couldn't cancel the order!",
      });
    }
    // console.log(temp[0]);
    await Users.updateOne({ _id: req.user.id }, { $set: { order: order } });
    await Restaurant.updateOne(
      { id: temp[0].restaurant.id },
      { $set: { orderList: orderList } }
    );
    res.json({ msg: "Order canceled successfully!" });
  },
};

module.exports = userCtrl;
