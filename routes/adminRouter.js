const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const Restaurant = require("../models/restaurantModel");

router.post("/setFeatured", auth, admin, async (req, res) => {
  try {
    const { id } = req.body;
    await Restaurant.updateOne({ featured: 1 }, { $set: { featured: 0 } });
    await Restaurant.updateOne({ id: id }, { $set: { featured: 1 } });
    return res.json({ msg: "Featured restaurant set successfully!" });
  } catch (err) {
    return res.status(500).json({ msg: err.msg });
  }
});
router.get("/getFeatured", async (req, res) => {
  try {
    const featuredRes = await Restaurant.findOne(
      { featured: 1 },
      { _id: 0, id: 1, name: 1, description: 1, contact: 1, featured: 1, mainPhoto: 1}
    );
    if (featuredRes) {
      return res.json(featuredRes);
    }

    return res.json({ msg: "Not any featured restaurant" });
  } catch (err) {
    return res.status(500).json({ msg: err.msg });
  }
});

router.get("/cancelFeatured", auth, admin, async (req, res) => {
  try {
    await Restaurant.updateOne({ featured: 1 }, { $set: { featured: 0 } });
    res.json({ msg: "Featured restaurant removed successfully!" });
  } catch (err) {
    return res.status(500).json({ msg: err.msg });
  }
});

module.exports = router;
