const tmi = require("tmi.js")
const commands = require("./classes/commands.js")
const user = require("./classes/User.js")
const twitch = require("./classes/twitchapi.js")
const logger = require("./classes/logger.js")
const db = require("./db.js")
require("dotenv").config()

const mode = "jamy"

const env = (mode == "jamy") ? {
                                    name: process.env.NAMERELEASE,
                                    oauth: process.env.OAUTHRELEASE,
                                    channel: process.env.CHANNELRELEASE,
                                    client_id: process.env.CLIENTIDRELEASE,
                                    client_secret: process.env.CLIENTSECRETRELEASE
                                } : {
                                    name: process.env.NAME,
                                    oauth: process.env.OAUTH,
                                    channel: process.env.CHANNEL,
                                    client_id: process.env.CLIENTID,
                                    client_secret: process.env.CLIENTSECRET
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

    this.client = new tmi.client(opts)
    commands.client = this.client
    twitch.client = this.client

    commands.env = env
    twitch.env = env

    commands.prefix = "!"
    commands.points = {
        name: "Egg shell",
        namePlural: "Egg shells"
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

        user.users = []
        user.userdatas = []

        commands.users = []
        commands.userdatas = []
        
        let users = await db.get('users', `userid = '${context["user-id"]}'`)
        let userdatas = await db.get('userdata', `userid = '${context["user-id"]}'`)

        user.users.push(users[0])
        commands.users.push(users[0])

        user.userdatas.push(userdatas[0])
        commands.userdatas.push(userdatas[0])

        user.addUserOrUpdate(target, context, msg)
        commands.crowning(target, context, msg)
        if (commands.command("crowns", msg)) {
            commands.getCrowns(target, context, msg)
        }
        // if (commands.command("points", msg)) {
        //     commands.getPoints(target, context, msg)
        // }
        if (commands.command(["cmd", "command"], msg)) {
            commands.textCommandsHandler(target, context, msg)
        }
        if (commands.command("wink", msg)) {
            commands.randomWink(target, context, msg)
        }
        if (commands.command("emotes", msg)) {
            commands.emotes(target, context, msg)
        }
        if (commands.command("lurk", msg)) {
            commands.lurk(target, context, msg)
        }
        if (commands.command(["so", "shoutout"], msg)) {
            commands.shoutout(target, context, msg)
        }
        // if (commands.command("followage", msg)) {
        //     commands.followage(target, context, msg)
        // }
        if (commands.command("uptime", msg)) {
            commands.uptime(target, context, msg)
        }
        if (commands.command("accountage", msg)) {
            commands.accountAge(target, context, msg)
        }
        commands.textCommandsApplier(target, context, msg)
    }

    this.onConnectedHandler = (addr, port) => {
        logger.log(`* Connected   :  ${addr}:${port}`);
        logger.log(`  Username    :  ${env.name}`)
        logger.log(`  To Channel  :  ${env.channel}`)
    }

    this.client.on('message', this.onMessageHandler);
    this.client.on('connected', this.onConnectedHandler);

    this.client.connect()

    return this
}

bot = Bot()