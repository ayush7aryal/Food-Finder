const router = require('express').Router()
const restaurantCtrl =  require('../controllers/restaurantCtrl')
const auth = require("../middleware/auth")
const authAdmin = require("../middleware/authAdmin")

router.get('/:id',restaurantCtrl.getInfo)
router.get('/',restaurantCtrl.getAll)
router.post('/post', restaurantCtrl.postInfo)
router.post('/update', auth, authAdmin, restaurantCtrl.updateInfo)
router.post('/similar',restaurantCtrl.getSimilar)

module.exports = router

//https://res.cloudinary.com/foodfinder/image/upload/v1619458129/41-dGxRSi1L._SX331_BO1_204_203_200__ozppxj.jpg