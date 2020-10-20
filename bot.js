const tmi = require("tmi.js")
const Commands = require("./classes/commands")
const user = require("./classes/User")
const twitch = require("./classes/twitchapi")
const logger = require("./classes/logger")
const db = require("./db")
const Points = require("./classes/points")
const csrf = require('csurf')
const express = require("express")
const path = require("path")

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
    commands.points =  
    this.points = {
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

        cmd("eggs",                                   commands.getEggs)
        cmd(["cmd", "command"],                       commands.textCommandsHandler)
        cmd("wink",                                   commands.randomWink)
        cmd("emotes",                                 commands.emotes)
        cmd("lurk",                                   commands.lurk)
        cmd(["so", "shoutout"],                       commands.shoutout)
        cmd("followage",                              commands.followage)
        cmd("uptime",                                 commands.uptime)
        cmd("accountage",                             commands.accountAge)
        cmd(["points", "eggshells", "shells"],        points.getPoints)
        cmd(["gamble", "roulette"],                   points.gamble)
        cmd(["startbet", "sb"],                       commands.startbet)
        cmd("bet",                                    commands.submitbet)
        cmd(["endbet", "eb"],                         commands.endbet)

        commands.textCommandsApplier(target, context, msg)
    }

    this.getPrintableCommands = async () => {        
        this.printableCommands = [
            {
                command: "eggs",
                reply: "{user}, has ${goldeggs} Golden Eggs, and {plateggs} PLATINUM EGGS.",
                description: "Shows eggs you/user have, you can check the user's eggs by providing his name after !eggs"
            },
            {
                command: "cmd, command",
                reply: "{user} [updated, added, deleted] !{command}",
                description: "[ONLY MODS] adds/updates/deletes a plain-text-reply-command.. following syntax must be used !cmd [update/add] (command without prefix) reply | !cmd [delete] (command without prefix)"
            },
            {
                command: "wink",
                reply: "{user} winks at {sec-user}",
                description: "Randomly winks at someone.. or you can wink at a specific person by providing their name."
            },
            {
                command: "emotes",
                reply: "{emotes}",
                description: "I (for real) do not know what this does but it exist."
            },
            {
                command: "lurk",
                reply: "{user} slowly takes off their crown and fades into the crowd but can still hear Jamy's velvety voice",
                description: "User will now start lurking but still have jamy in the background"
            },
            {
                command: "so, shoutout",
                reply: "You need to peep this royal Egg: https://twitch.tv/{user}",
                description: "[ONLY MODS] Shouts out someone"
            },
            {
                command: "followage",
                reply: "[API RESPONSE] you have been following {channel} for ...",
                description: "Checks the time since you followed "+env.channel
            },
            {
                command: "uptime",
                reply: `[API RESPONSE] ${env.channel} has been streaming for...`,
                description: `Checks time since ${env.channel} started streaming or been off for.`
            },
            {
                command: "accountage",
                reply: `[API RESPONSE] {user} account was created at ..date..`,
                description: `Tells you when did you create your account.`
            },
            {
                command: "points, shells, eggshells",
                reply: `{user} has {amount} ${this.points.namePlural} and is rank {rank}/{participants_count} on the leaderboard.`,
                description: `Tells you how many ${this.points.plural} you have`
            },
            {
                command: "gamble",
                reply: `{user}, gambled with {amount} ${this.points.namePlural}, and won/lost PogChamp/LUL! and now has {points} ${this.points.namePlural}. PogChamp/LUL`,
                description: `Gambling with your ${this.points.namePlural}`
            }
        ]

        let cmds = await db.get('tcommands')
        cmds.forEach(cmd => {
            this.printableCommands.forEach(pc => {
                if (pc.reply == cmd.reply) {
                    this.printableCommands[this.printableCommands.indexOf(pc)] = {
                        command: cmd.command + ", " + pc.command,
                        reply: pc.reply,
                        description: pc.description
                    }
                }
            })

            if (this.printableCommands.map(pc => pc.reply).includes(cmd.reply)) return

            this.printableCommands.push({
                command: cmd.command,
                reply: cmd.reply,
                description: ""
            })
        })
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

module.exports = bot
const app = require("./web/app")
bot.getPrintableCommands()
app.listen(process.env.PORT || 8080)
logger.log(`Listening to http://127.0.0.1:${process.env.PORT || 8080}/`)
