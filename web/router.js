const router = require("express").Router()
const mainController = require("./controller")


router.get('/', mainController.gethome)
router.get('/commands', mainController.getcommands)
router.get('/leaderboard', mainController.getleader)
router.get('/store', mainController.getstore)
router.get('/admin', mainController.admin)

router.post('/admin-login', mainController.adminLogin)
router.post('/logout', mainController.logout)
router.post('/command', mainController.executeCommand)

router.get('/get-updates', mainController.getUpdates)
router.get('/online-users', mainController.getOnlineUsers)
router.get('/logs', mainController.getLogs)
module.exports = router