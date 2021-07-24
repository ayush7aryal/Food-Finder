const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");
const auth = require("../middleware/auth");

router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);
router.get("/logout", userCtrl.logout);
router.get("/refreshToken", userCtrl.refreshToken);
router.get("/info", auth, userCtrl.getUser);
router.post("/roleChange", auth, userCtrl.roleChange);
router.post("/delete", auth, userCtrl.deleteUser);
router.post("/addCart", auth, userCtrl.pushCart);
router.post("/changeCart", auth, userCtrl.changeCart);
router.post("/order", auth, userCtrl.order);
router.get("/getOrder", auth, userCtrl.getOrder);
router.post("/cancel", auth, userCtrl.cancelOrder);
router.post("/update", auth, userCtrl.updateInfo)

module.exports = router;
