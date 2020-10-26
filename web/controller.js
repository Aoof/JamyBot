const bot = require("../bot")
const db = require("../db")
const logger = require("../classes/logger")

module.exports = {
    gethome(req, res, next) {
        res.render('index')
    },
    async getcommands(req, res, next) {
        await bot.getPrintableCommands()
        res.render("commands", {commands: bot.printableCommands})
    },
    async getleader(req, res, next) {
        await bot.updateleaderboard()
        res.render("leaderboard", {leaderboard: bot.leaderboard})
    }
}