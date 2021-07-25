const restaurants = require("../models/restaurantModel");
const Users = require("../models/userModel");
// const jwt = require('jsonwebtoken')

const restaurantCtrl = {
  getInfo: async (req, res) => {
    var id = req.params.id;

    if (!id) {
      return res
        .status(400)
        .json({ msg: "Id of the restaurant not provided to show info!" });
    }
    const restaurant = await restaurants.findOne({ id: id }, (err, result) => {
      if (err) return res.status(400).json({ msg: err.msg });
      return result;
    });
    res.json(restaurant);
  },
  postInfo: async (req, res) => {
    try {
      if (!req.body) return res.status(400).json({ msg: "Nothing to post!" });
      const {
        id,
        name,
        email,
        category,
        description,
        contact,
        mainPhoto,
        menus,
        bestSeller,
        location,
      } = req.body;
      const newRestaurant = new restaurants({
        id,
        name,
        email,
        category,
        description,
        contact,
        mainPhoto,
        menus,
        bestSeller,
        location,
      });
      await newRestaurant.save();

      await Users.findByIdAndUpdate(req.user.id, { $set: { role: id } });

      res.json({ msg: "Detail about the restaurant posted successfully!" });
    } catch (err) {
      res.json({ msg: err.msg });
    }
  },
  updateInfo: async (req, res) => {
    const {
      id,
      name,
      email,
      photos,
      category,
      description,
      contact,
      mainPhoto,
      bestseller,
      location,
    } = req.body;
    if (!id)
      return res
        .status(400)
        .json({ msg: "Please provide the id to process the update!" });
    await restaurants.findOneAndUpdate(
      { id: id },
      {
        $set: {
          name: name,
          email: email,
          photos: photos,
          category: category,
          description: description,
          contact: contact,
          mainPhoto: mainPhoto,
          bestSeller: bestseller,
          location: location,
        },
      },
      (err, result) => {
        if (err) return res.status(400).json(err.msg);
        return result;
      }
    );
    res.json({ msg: "Info about the restaurant updated successfully!" });
  },
  getAll: async (req, res) => {
    try {
      const allRestaurants = await restaurants.find(
        {},
        { _id: 0 },
        (err, result) => {
          if (err) {
            return res.status(500).json({ msg: err.msg });
          }
          return result;
        }
      );
      res.json(allRestaurants);
    } catch (err) {
      return res.status(500).json({ msg: err.msg });
    }
  },
  getSimilar: async (req, res) => {
    try {
      const { id } = req.body;
      const restaurant = await restaurants.findOne(
        { id: id },
        { _id: 0, category: 1 }
      );

      const similar = await restaurants.find(
        {
          category: {
            $in: restaurant.category,
          },
          id: { $ne: id },
        },
        { _id: 0, id: 1, name: 1, mainPhoto: 1, location: 1 },
        (err, result) => {
          if (err) return res.status(400).json({ msg: err.msg });
          return result;
        }
      );
      res.json(similar);
    } catch (err) {
      return res.status(500).json({ msg: err.msg });
    }
  },
  getId: async (req, res) => {
    try {
      const restaurant = await restaurants.find();
      if (!restaurant) {
        res.json(0);
      } else {
        restaurant.map((result) => {
          for (i = 0; i < restaurant.length; i++) {
            if (i != restaurant[i].id) {
              return res.json(i);
            } else {
              i++;
            }
          }
        });
        res.json(restaurant.length);
      }
    } catch (err) {
      return res.status(500).json({ msg: err.msg });
    }
  },
  setPopularity: async (req, res) => {
    try {
      const { id, popularity } = req.body;
      const Restaurant = await restaurants.updateOne(
        { id: id },
        { $set: { popularity: popularity } },
        (err, result) => {
          if (err) return res.json({ msg: err.message });
          return result;
        }
      );
      console.log(Restaurant);
      if (Restaurant) {
        res.json({ msg: "Popularity set success!" });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.msg });
    }
  },
  getPopular: async (req, res) => {
    try {
      const popular = await restaurants
        .find(
          {},
          {
            _id: 0,
            id: 1,
            name: 1,
            description: 1,
            mainPhoto: 1,
            popularity: 1,
          }
        )
        .sort({ popularity: -1 });

      res.json(popular);
    } catch (err) {
      return res.status(500).json({ msg: err.msg });
    }
  },
  getOrder: async (req, res) => {
    try {
      const orderList = await restaurants.findOne(
        { id: req.user.role },
        { _id: 0, orderList: 1 }
      );
      res.json(orderList);
    } catch (err) {
      return res.status(500).json({ msg: err.msg });
    }
  },
  updateOrder: async (req, res) => {
    try {
      const { email, orderList } = req.body;

      for (var i = 0; i < email.length; i++) {
        const { order } = await Users.findOne(
          { email: email[i] },
          { _id: 0, order: 1 }
        );
        const final_order = order.map((result) => {
          if (result.id == orderList[i].user.id) {
            result.status = orderList[i].status;
          }
          return result;
        });
        console.log("final order: ", final_order);
        await Users.findOneAndUpdate(
          { email: email[i] },
          { $set: { order: final_order } }
        );
      }

      await restaurants.findOneAndUpdate(
        { id: req.user.role },
        { $set: { orderList: orderList } }
      );
      res.json({ msg: "Order updated successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.msg });
    }
  },
};

module.exports = restaurantCtrl;
