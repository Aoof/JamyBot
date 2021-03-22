const tmi = require("tmi.js")
const Commands = require("./classes/Commands")
const user = require("./classes/User")
const twitch = require("./classes/TwitchAPI")
const logger = require("./classes/Logger")
const db = require("./db")
const Points = require("./classes/Points")
const csrf = require('csurf')
const express = require("express")
const path = require("path")

require("dotenv").config()

const env = ((process.env.MODE || "prod") == "prod") ? {
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


let Bot = function() {
    this.opts = {
        identity: {
            username: env.name,
            password: env.oauth
        },
        channels: [
            env.channel
        ]
    }
    let commands = new Commands()
    let points = new Points()

    this.logFile = logger.newSave()

    this.client = new tmi.client(this.opts)
    this.client.connect()

    points.client = 
    commands.client =
    twitch.client = this.client


    points.env =
    commands.env =
    twitch.env = env

    
    points.prefix = 
    commands.prefix =
    this.prefix = "!"
    
    points.points =
    commands.points =  
    this.points = {
        name: "Egg Shell",
        namePlural: "Egg Shells"
    }
    
    points.online_users =
    this.online_users = []
    this.pointGivers = []
    this.to_be_online = 30 // In minutes

    this.updates = []

    this.updateleaderboard = () => {
        db.query('SELECT ' + 
                'u.username, u.displayname AS "name", ud.goldeggs AS "geggs", ud.plateggs AS "peggs", ud.points AS "shells" ' +
                'FROM users u, userdata ud ' +
                'WHERE u.userid = ud.userid ' +
                'ORDER BY -ud.points', (err, results, fields) => {
                    if (err) {
                        logger.log(err.stack)
                        return
                    }
                    this.leaderboard = results.rows
                })
    }

    this.updateleaderboard()

    this.add_online = (user, userdata) => {
        let recentCommands = []
        if (this.online_users.map(ou => ou.user.userid).includes(user.userid)) {
            points.online_users =
            this.online_users = this.online_users.filter(on_user => {
                if (on_user.user.userid != user.userid) return on_user
                else recentCommands = on_user.recentCommands
                return on_user
            })
        }
        
        let pGiverFunc = () => {
            let multiplier = 1
            if (user.subscriber) multiplier = 1.2
            
            points.add_points(user, 20*multiplier)
            // this.updates.push(`Success giving ${user.username} ${20*multiplier} Egg Shells`)
            this.online_users = this.online_users.map(function(ou) {
                if (ou.user.userid == user.userid) {
                    userdata.points = userdata.points + 20*multiplier
                    return {
                        user: user,
                        userdata: userdata,
                        userTimer: ou.userTimer,
                        recentCommands: ou.recentCommands
                    }
                } else {
                    return ou
                }
            })
        }
        
        let userTimer = () => {
            points.online_users =
            this.online_users = this.online_users.filter(on_user => {
                if (on_user.user.userid != user.userid) return on_user
                else {
                    clearTimeout(on_user.userTimer)
                    this.pointGivers.filter(g => {
                        if (g.userid != on_user.user.userid) return g
                        else clearInterval(g.pgiver)
                    })
                }
            })
        }

        this.online_users = this.online_users.filter(ou => {
            if (ou.user.userid != user.userid) return ou
            else clearTimeout(ou.userTimer)
        })
        this.online_users.push({
            user: user,
            userdata: userdata,
            userTimer: setTimeout(userTimer, 1000*60*this.to_be_online), 
            recentCommands: recentCommands
        })

        if (!this.pointGivers.map(e => e.userid).includes(user.userid)) {
            this.pointGivers.push({
                userid: user.userid,
                pgiver: setInterval(pGiverFunc, 1000*60*10)
            })
        }
    }

    this.onMessageHandler = async (target, context, msg, self) => {
        if (self) { return; }
        
        if (!context.badges) context.badges = {broadcaster: false, mod: false}

        let users = await db.query(`SELECT * FROM royalbutler.users WHERE "userid" = '${context["user-id"]}'`)
        let userdatas = await db.query(`SELECT * FROM royalbutler.userdata WHERE "userid" = '${context["user-id"]}'`)
        
        user.req =
        points.req = 
        commands.req =
        req = {userdata: userdatas.rows[0],
               user    : users.rows[0]}
        
        user.addUserOrUpdate(target, context, msg)
        
        if (!userdatas.rows.length || !users.rows.length) {
            users = await db.query(`SELECT * FROM royalbutler.users WHERE "userid" = '${context["user-id"]}'`)
            userdatas = await db.query(`SELECT * FROM royalbutler.userdata WHERE "userid" = '${context["user-id"]}'`)
            
            user.req =
            points.req = 
            commands.req =
            req = {
                userdata: userdatas.rows[0],
                user    : users.rows[0]
            }
        }
        this.add_online(req.user, req.userdata)
            
        if (users.length) if (req.user.userid != "24544309") commands.gifting(target, context, msg)
        if (commands.command(["ul", "updateleaderboard"], msg)) this.updateleaderboard()

        function cmd(cmdname, command, delay=0) {
            if (commands.command(cmdname, msg)) command(target, context, msg)
        }

        let rigGamble = (target, context, msg) => {
            if (context.badges.broadcaster || context.username == '4oofxd') context.mod = true
            if (!context.mod) return;

            points.rigGambling(context)
            this.client.say(target, `${req.user.displayname}, Rigged the !gamble command for 10 minutes.`)
        }

        cmd("eggs",                                   commands.getEggs)
        cmd(["cmd", "command"],                       commands.textCommandsHandler)
        cmd("wink",                                   commands.randomWink)
        cmd("emotes",                                 commands.emotes)
        cmd("lurk",                                   commands.lurk)
        cmd(["so", "shoutout"],                       commands.shoutout)
        cmd(["points", "eggshells", "shells"],        points.pointsHandler)
        cmd(["gamble", "roulette"],                   points.gamble, .5)
        cmd(["startbet", "sb"],                       commands.startbet)
        cmd("bet",                                    commands.submitbet)
        cmd(["endbet", "eb"],                         commands.endbet)
        cmd(["redeem", "buy"],                        commands.getRedeem)
        cmd(["riggamble", "rigamble"],                rigGamble)
        // cmd("uptime",                                 commands.uptime)
        // cmd("accountage",                             commands.accountAge)
        // cmd("followage",                              commands.followage)

        commands.textCommandsApplier(target, context, msg)
    }

    this.getStoreItems = () => {
        return db.query('SELECT * FROM store ORDER BY price').rows
    }

    this.getPrintableCommands = async () => {        
        this.printableCommands = [
            {
                command: "eggs",
                reply: "{user}, has ${goldeggs} Golden Eggs, and {plateggs} PLATINUM EGGS.",
                description: "Shows the amount of Golden and Platinum Eggs you/user have. You can check the user's Eggs by providing their username after !eggs"
            },
            {
                command: "cmd, command",
                reply: "{user} [updated, added, deleted] !{command}",
                description: "ONLY MODS] adds/updates/deletes a plain-text-reply-command. The following syntax must be used: !cmd [update/add] (command without prefix) reply | !cmd [delete] (command without prefix)"
            },
            {
                command: "wink",
                reply: "{user} winks at {sec-user}",
                description: "Randomly winks at someone or you can wink at a specific user by providing their username"
            },
            {
                command: "emotes",
                reply: "{emotes}",
                description: "Shows BTTV emotes linked to the channel"
            },
            {
                command: "lurk",
                reply: "{user} slowly takes off their crown and fades into the crowd but can still hear Jamy's velvety voice",
                description: "User will now start lurking but will still have Jamystro in the background"
            },
            {
                command: "so, shoutout",
                reply: "You need to peep this royal Egg: https://twitch.tv/{user}",
                description: "[ONLY MODS] Shouts out another user"
            },
            {
                command: "followage",
                reply: "[API RESPONSE] you have been following {channel} for ...",
                description: "Shows how long you have been following Jamystro"
            },
            {
                command: "uptime",
                reply: `[API RESPONSE] ${env.channel} has been streaming for...`,
                description: `Shows how long Jamystro has been live for or been offline for`
            },
            {
                command: "accountage",
                reply: `[API RESPONSE] {user} account was created at ..date..`,
                description: `Shows when you created your Twitch account`
            },
            {
                command: "points, shells, eggshells",
                reply: `{user} has {amount} ${this.points.namePlural} and is rank {rank}/{participants_count} on the leaderboard.`,
                description: `Shows your amount of ${this.points.namePlural} and your place on the leaderboard`
            },
            {
                command: "gamble",
                reply: `{user}, gambled with {amount} ${this.points.namePlural}, and won/lost PogChamp/LUL! and now has {points} ${this.points.namePlural}. PogChamp/LUL`,
                description: `Gamble your livelihood away with your hard-earned ${this.points.namePlural}`
            }
        ]

        let cmds = await db.query('SELECT * FROM tcommands')
        cmds.rows.forEach(cmd => {
            this.printableCommands.forEach(pc => {
                if (pc.reply == cmd.reply && pc.command != cmd.command) {
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
                description: cmd.desc ? cmd.desc : ""
            })
        })

        	
        this.printableCommands = this.printableCommands.sort((a, b) => a.command.localeCompare(b.command, 'es', { sensitivity: 'base' }))
    }

    this.onConnectedHandler = (addr, port) => {
        this.status = true
        logger.log(`* Connected   :  ${addr}:${port}`);
        logger.log(`  Username    :  ${env.name}`)
        logger.log(`  To Channel  :  ${env.channel}`)

        setInterval(() => points.timedMessage('Don\'t mind me, just wanted to say the King\'s head looks extra shiny today.'), 1000*60*60)
        setInterval(() => points.timedMessage('If you see a bug, get my master Aoof to squash it.'), 1000*60*60*2)
        setTimeout(() =>
        setInterval(() => points.timedMessage('If the Egg overlord makes you giggle, capture is magic in the form of a clip. Give it a humorous title and go into the running for the monthly sub giveaway!'), 1000*60*60)
        , 1000*60*30)
        setInterval(this.updateleaderboard, 1000*60*10)
    }

    this.client.on('message', this.onMessageHandler);
    this.client.on('connected', this.onConnectedHandler);
    this.client.on('disconnected', (reason) => {
        this.status = false
        logger.log(reason)
        this.client.connect();
    });
}

let bot = new Bot()
module.exports = bot
