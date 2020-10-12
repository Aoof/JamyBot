const tmi = require("tmi.js")
const commands = require("./commands.js")
const user = require("./User.js")
const twitch = require("./twitchapi.js")
const twitchapi = require("./twitchapi.js")
require("dotenv").config()


function Bot() {
    this.opts = {
        identity: {
            username: process.env.NAME,
            password: process.env.OAUTH
        },
        channels: [
                      process.env.CHANNEL
        ]
    }

    this.client = new tmi.client(opts)
    commands.client = this.client
    twitch.client = this.client

    commands.prefix = "!"
    commands.points = {
        name: "Egg shell",
        namePlural: "Egg shells"
    }

    twitch.channel = process.env.CHANNEL
    commands.channel = process.env.CHANNEL
    
    this.onMessageHandler = (target, context, msg, self) => {
        if (self) { return; }
        /*
            # Receive message
            # Insert user to database if not already registered
            # Randomly check if user will get crowned or not
            # # Golden crown 5% Chance
            # # Platinum crown .1% Chance
            # Save user's data accordingly
        */
        user.addUser(target, context, msg)
        user.update(target, context, msg)
        commands.crowning(target, context, msg)
        if (commands.command("crowns", msg)) {
            commands.getCrowns(target, context, msg)
        }
        if (commands.command("points", msg)) {
            commands.getPoints(target, context, msg)
        }
        if (commands.command(["cmd", "command"], msg)) {
            commands.addTextCommand(target, context, msg)
        }
        if (commands.command("update", msg)) {
            commands.updateTextCommand(target, context, msg)
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
        if (commands.command("followage", msg)) {
            commands.followage(target, context, msg)
        }
        if (commands.command("uptime", msg)) {
            commands.uptime(target, context, msg)
        }
        if (commands.command("accountage", msg)) {
            commands.accountAge(target, context, msg)
        }
        commands.textCommandsHandler(target, context, msg)
    }

    this.onConnectedHandler = (addr, port) => {
        console.log(`* Connected to ${addr}:${port}`);
        console.log(`  Username  :  ${this.opts.identity.username}`)
    }

    this.client.on('message', this.onMessageHandler);
    this.client.on('connected', this.onConnectedHandler);

    this.client.connect()

    return this
}

bot = Bot()