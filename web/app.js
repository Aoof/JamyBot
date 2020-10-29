const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const markdown = require('marked')
const csrf = require('csurf')
const path = require("path")
const PostgreSqlStore = require('connect-pg-simple')(session);
const bot = require("../bot")
const app = express()
const logger = require("../classes/Logger")
require("dotenv").config()

const env = (process.env.MODE || "prod" == "prod") ? {
    name: process.env.NAMERELEASE,
    oauth: process.env.OAUTHRELEASE,
    channel: process.env.CHANNELRELEASE,
    client_id: process.env.CLIENTIDRELEASE,
    client_secret: process.env.CLIENTSECRETRELEASE,
    channel_id: process.env.IDRELEASE
} : {
    name: process.env.NAME,
    oauth: process.env.OAUTH,
    channel: process.env.CHANNEL,
    client_id: process.env.CLIENTID,
    client_secret: process.env.CLIENTSECRET,
    channel_id: process.env.ID
}

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

let sessionOptions = session({
    secret: process.env.SESSIONSECRET,
    store: new PostgreSqlStore({
        conString: process.env.DATABASEURL
    }),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true }
})

app.use(sessionOptions)
app.use(flash())

app.use(async function(req, res, next) {
    // Make our markdown function available from within ejs templates
    res.locals.filterUserHTML = function(content) {
        return sanitizeHTML(markdown(content), { allowedTags: ['p', 'br', 'li', 'ol', 'ul', 'strong', 'bold', 'i', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'], allowedAttributes: {} })
    }

    // Make all error and success flash messages available from all templates
    res.locals.errors = req.flash('errors')
    res.locals.success = req.flash('success')

    
    
    let newEnv = {
        name: env.name,
        channel: env.channel
    }

    res.locals.status = {
        // bot: false,
        bot: bot.status,
        db: typeof cond != "boolean",
        phandler: true,
        chandler: true
    }

    res.locals.points = bot.points

    res.locals.env = newEnv

    res.locals.icons = [
        {name: 'fa fa-home', href: '/'},
        {name: 'fa fa-file', href: '/commands'},
        {name: 'fa fa-list-ol', href: '/leaderboard'},
    ]

    // Make current user id available on the req object
    if (req.session.user) { req.visitorId = req.session.user._id } else { req.visitorId = 0 }

    // Make user session data available from within view templates
    res.locals.user = req.session.user
    next()
})

const router = require('./router')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(express.static(path.join(__dirname, 'static')))
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs')

app.use(csrf())

app.use(async function(req, res, next) {
    res.locals.csrfToken = req.csrfToken()
    next()
})

app.use('/', router)

app.use(function(err, req, res, next) {
    if (err) {
        if (err.code == "EBADCSRFTOKEN") {
            req.flash('errors', 'Cross-site forgery detected')
            req.session.save(() => res.redirect('/'))
        } else {
            logger.log(err)
            res.render('404')
        }
    }
})


module.exports = app