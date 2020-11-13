const bot = require("../bot")
const db = require("../db")
const filter = require("../classes/Filter")
const User = require("../classes/User")
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
    },
    admin(req, res, next) {
        if (req.session.user) res.render("admin")
        else res.render('adminlogin')
    },
    adminLogin(req, res, next) {
        let username = req.body.username.toLowerCase()
        let password = req.body.password

        let errs = filter.User.username(username)
        errs = errs.concat(filter.User.password(password))

        if (errs.length) {
            errs.forEach(err => req.flash("errors", err))
            req.session.save(() => res.redirect('/admin'))
        } else {
            User.login(username, password).then(user => {
                req.flash("success", "Successfully signed in")
                req.session.user = user
                req.session.save(() => res.redirect('/admin'))
            }).catch(err => {
                req.flash("errors", err)
                req.session.save(() => res.redirect('/admin'))
            })

        } 
    },
    logout(req, res, next) {
        req.session.destroy(function() {
            res.redirect('/')
        })
    },
    getOnlineUsers(req, res, next) {
        res.json(bot.online_users.map(user => {
            return {
                displayname: user.user.displayname,
                userid: user.user.userid,
                points: user.userdata.points,
                recentCommands: user.recentCommands
            }
        }))
    }
}