const router = require("express").Router()
const mainController = require("./controllers/mainController")


router.get('/', mainController.gethome)
router.get('/commands', mainController.getcommands)

module.exports = router