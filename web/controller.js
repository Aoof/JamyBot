const bot = require("../bot")
const db = require("../db")
const logger = require("../classes/logger")

module.exports = {
    gethome(req, res, next) {
        res.render('index')
    },
    getcommands(req, res, next) {
        res.render("commands", {commands: bot.printableCommands})
    },
    getleader(req, res, next) {
        res.render("leaderboard", {leaderboard: bot.leaderboard})
    }
}