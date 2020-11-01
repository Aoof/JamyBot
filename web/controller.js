const bot = require("../bot")
const db = require("../db")
const logger = require("../classes/Logger")

module.exports = {
    gethome(req, res, next) {
        res.render('index')
    },
    async getcommands(req, res, next) {
        await bot.getPrintableCommands()
        res.render("commands", {commands: bot.printableCommands})
    },
    getleader(req, res, next) {
        bot.updateleaderboard()
        res.render("leaderboard", {leaderboard: bot.leaderboard})
    },
    async getstore(req, res, next) {
        let items = await db.query('SELECT * FROM store ORDER BY price')
        items = items.rows
        res.render("store", {items: items})
    } 
}