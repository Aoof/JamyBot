const tmi = require("tmi.js")
const commands = require("./commands.js")
const db = require("./db.js")
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

    commands.prefix = "!"
    commands.points = {
        name: "Egg shell",
        namePlural: "Egg shells"
    }
    
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
        commands.addUser(target, context, msg)
        commands.crowning(target, context, msg)
        if (commands.command("crowns", msg)) {
            commands.getCrowns(target, context, msg)
        }
        // if (commands.command("points", msg)) {
        //     commands.getPoints(target, context, msg)
        // }
    }

    this.onConnectedHandler = (addr, port) => {
        console.log(`* Connected to ${addr}:${port}`);
        console.log(`  USERNAME :   ${this.opts.identity.username}`)
    }

    this.client.on('message', this.onMessageHandler);
    this.client.on('connected', this.onConnectedHandler);

    this.client.connect()

    return this
}

bot = Bot()