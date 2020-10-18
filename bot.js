const tmi = require("tmi.js")
const Commands = require("./classes/commands.js")
const user = require("./classes/User.js")
const twitch = require("./classes/twitchapi.js")
const logger = require("./classes/logger.js")
const db = require("./db.js")
const Points = require("./classes/points.js")
const express = require("express")
const path = require("path")

require("dotenv").config()

const mode = "jamy"

const env = (mode == "jamy") ? {
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

function Bot() {
    this.opts = {
        identity: {
            username: env.name,
            password: env.oauth
        },
        channels: [
            env.channel
        ]
    }

    logger.newSave()

    let commands = new Commands()
    let points = new Points()

    this.client = new tmi.client(this.opts)
    this.client.connect()

    points.client = 
    commands.client =
    twitch.client = this.client


    points.env =
    commands.env =
    twitch.env = env

    points.online_users = []

    points.prefix = 
    commands.prefix = "!"
    
    points.points =
    commands.points =  {
        name: "Egg shell",
        namePlural: "Egg shells"
    }

    this.online_users = []
    this.to_be_online = 10 // In minutes

    this.add_online = (user, userdata) => {
        if (typeof user != "object" || typeof userdata != "object") return
        let userTimer = setInterval(() => {
            this.online_users = this.online_users.filter(ou => {
                if (user.userid != ou.user.userid) {
                    return ou
                }
            })

            commands.online_users =
            twitch.online_users =
            user.online_users =
            points.online_users = this.online_users
        }, 1000*60*this.to_be_online)

        let online_user = {
            user: user,
            userdata: userdata,
            userTimer: userTimer
        }
        if (!this.online_users.map(x => x.user.userid).includes(online_user.user.userid)) {
            this.online_users.push(online_user)
        } else {
            this.online_users = this.online_users.map(usr => {
                if (usr.user.userid == online_user.user.userid) {
                    return {
                        user: user,
                        userdata: userdata,
                        userTimer: userTimer
                    }
                } else {
                    return usr
                }
            })
        }

        commands.online_users =
        twitch.online_users =
        user.online_users =
        points.online_users = this.online_users
    }

    this.onMessageHandler = async (target, context, msg, self) => {
        if (self) { return; }
        /*
            # Receive message
            # Insert user to database if not already registered
            # Randomly check if user will get crowned or not
            # # Golden crown 5% Chance
            # # Platinum crown .1% Chance
            # Save user's data accordingly
        */
        let users = await db.get('users', `userid = '${context["user-id"]}'`)
        let userdatas = await db.get('userdata', `userid = '${context["user-id"]}'`)
        
        this.add_online(users[0], userdatas[0])

        user.users =
        points.users =
        commands.users = users

        user.userdatas =
        points.userdatas =
        commands.userdatas = userdatas

        user.addUserOrUpdate(target, context, msg)
        commands.crowning(target, context, msg)

        let cmd = (cmdname, command) => {
            if (commands.command(cmdname, msg)) command(target, context, msg);
        }

        cmd("crowns",                 commands.getCrowns)
        cmd(["cmd", "command"],       commands.textCommandsHandler)
        cmd("wink",                   commands.randomWink)
        cmd("emotes",                 commands.emotes)
        cmd("lurk",                   commands.lurk)
        cmd(["so", "shoutout"],       commands.shoutout)
        cmd("followage",              commands.followage)
        cmd("uptime",                 commands.uptime)
        cmd("accountage",             commands.accountAge)
        cmd("points",                 points.getPoints)
        cmd(["gamble", "roulette"],   points.gamble)
        cmd(["startbet", "sb"],       commands.startbet)
        cmd("bet",                    commands.submitbet)
        cmd(["endbet", "eb"],         commands.endbet)

        commands.textCommandsApplier(target, context, msg)
    }

    this.onConnectedHandler = (addr, port) => {
        this.status = true
        logger.log(`* Connected   :  ${addr}:${port}`);
        logger.log(`  Username    :  ${env.name}`)
        logger.log(`  To Channel  :  ${env.channel}`)

        setTimeout(() => points.timedMessage(1.5), 1000*60*60*1.5)
        setTimeout(() => points.timedMessage2(2), 1000*60*60*2)
        points.onlineUsersHandler()
    }

    this.client.on('message', this.onMessageHandler);
    this.client.on('connected', this.onConnectedHandler);
    this.client.on('disconnected', (reason) => {
        this.status = false
        logger.log(reason)
        client.connect();
    });
}

let bot = new Bot()

const app = express()
const port = process.env.PORT || "8080";

app.set('view engine', 'ejs')

app.get("/", async (req, res) => {
    let cond
    try {
        cond = await db.get('users')
    } catch {
        cond = false
    }
    res.render('index', {
        status: {
            // bot: false,
            bot: bot.status,
            db: typeof cond != "boolean",
            phandler: true,
            chandler: true
        },
        bot: {
            name: env.name
        },
        channel: env.channel
    })
});

app.listen(port, () => {
    logger.log(`listening to http://127.0.0.1:${port}/`)
});