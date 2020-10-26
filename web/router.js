const router = require("express").Router()
const mainController = require("./controller")


router.get('/', mainController.gethome)
router.get('/commands', mainController.getcommands)
router.get('/leaderboard', mainController.getleader)

module.exports = router