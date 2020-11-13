const router = require("express").Router()
const mainController = require("./controller")


router.get('/', mainController.gethome)
router.get('/commands', mainController.getcommands)
router.get('/leaderboard', mainController.getleader)
router.get('/store', mainController.getstore)
router.get('/admin', mainController.admin)
router.get('/online-users', mainController.getOnlineUsers)
router.post('/admin-login', mainController.adminLogin)
router.post('/logout', mainController.logout)

module.exports = router