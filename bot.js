const tmi = require("tmi.js")
const Commands = require("./classes/commands.js")
const user = require("./classes/User.js")
const twitch = require("./classes/twitchapi.js")
const logger = require("./classes/logger.js")
const db = require("./db.js")
const points = require("./classes/points.js")
// const website = require("./website/website.js")

require("dotenv").config()

function arrayEquals(a, b) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val == b[index]);
}

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

    this.client = 
    points.client = 
    commands.client =
    twitch.client = new tmi.client(this.opts)

    points.env = 
    commands.env =
    twitch.env = env

    points.online_users = []

    commands.prefix = "!"
    commands.points = {
        name: "Egg shell",
        namePlural: "Egg shells"
    }
    
    this.online_users = []
    this.to_be_online = 10 // In minutes

    this.add_online = (user, userdata) => {
        let userTimer = setInterval(() => {
            this.online_users = this.online_users.filter(online_user => {
                if (user.userid != online_user.user.userid) {
                    return online_user
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
        commands.users = [users[0]]

        user.userdatas =
        commands.userdatas = [userdatas[0]]

        user.addUserOrUpdate(target, context, msg)
        commands.crowning(target, context, msg)
        
        function cmd(cmdname, command) {
            if (commands.command(cmdname, msg)) command(target, context, msg);
        }

        cmd("crowns",            commands.getCrowns)
        cmd(["cmd", "command"],  commands.textCommandsHandler)
        cmd("wink",              commands.randomWink)
        cmd("emotes",            commands.emotes)
        cmd("lurk",              commands.lurk)
        cmd(["so", "shoutout"],  commands.shoutout)
        cmd("uptime",            commands.uptime)
        cmd("accountage",        commands.accountAge)
        // cmd("followage",      commands.followage)
        // cmd("points",         commands.getPoints)

        commands.textCommandsApplier(target, context, msg)
    }

    this.onConnectedHandler = (addr, port) => {
        logger.log(`* Connected   :  ${addr}:${port}`);
        logger.log(`  Username    :  ${env.name}`)
        logger.log(`  To Channel  :  ${env.channel}`)

        setTimeout(() => points.timedMessage (60), 1000*60*60)
        setTimeout(() => points.timedMessage2(90), 1000*60*90)
        points.onlineUsersHandler()
    }
    this.client.on('message', this.onMessageHandler);
    this.client.on('connected', this.onConnectedHandler);

    return this
}

bot = Bot()