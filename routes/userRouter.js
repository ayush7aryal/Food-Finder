const router = require('express').Router()
const userCtrl =  require('../controllers/userCtrl')
const auth = require("../middleware/auth")

router.post('/register', userCtrl.register)
router.post('/login',auth, userCtrl.login)
router.get('/logout', userCtrl.logout)
router.get('/user/refreshToken', userCtrl.refreshToken)
router.get('/info', userCtrl.getUser)
router.post('/roleChange', userCtrl.roleChange)
router.post('/delete', userCtrl.deleteUser)

module.exports = router;