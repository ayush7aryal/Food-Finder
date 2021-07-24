const router = require("express").Router();
const restaurantCtrl = require("../controllers/restaurantCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.get("/:id", restaurantCtrl.getInfo);
router.get("/", restaurantCtrl.getAll);
router.post("/post", restaurantCtrl.postInfo);
router.post("/update", auth, authAdmin, restaurantCtrl.updateInfo);
router.post("/similar", restaurantCtrl.getSimilar);
router.post("/getId", restaurantCtrl.getId);
router.post("/setPopular", restaurantCtrl.setPopularity);
router.get("/get/popular", restaurantCtrl.getPopular);
router.get("/get/order", auth, authAdmin, restaurantCtrl.getOrder);
router.post("/updateOrder", auth, authAdmin, restaurantCtrl.updateOrder);
module.exports = router;
