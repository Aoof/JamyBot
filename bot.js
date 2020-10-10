const tmi = require("tmi.js")
const commands = require("./commands.js")
const db = require("./db.js")
require("dotenv").config()


async function Bot() {
    let channels = await db.get("channels")
    this.opts = {
        identity: {
            username: process.env.USERNAME,
            password: process.env.OAUTH
        },
        channels: channels.map(function(channel) {
            return channel.name
        })
    }

    this.client = new tmi.client(opts)
    commands.client = this.client
    
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

    }

    this.onConnectedHandler = (addr, port) => {
        console.log(`* Connected to ${addr}:${port}`);
    }

    this.client.on('message', this.onMessageHandler);
    this.client.on('connected', this.onConnectedHandler);

    this.client.connect()

    return this
}

Bot().then(bot => {
}).catch(err => {
    if (err) throw err;
})