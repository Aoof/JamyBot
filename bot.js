const tmi = require("tmi.js")
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
    
    this.onMessageHandler = function(target, context, msg, self) {
        if (self) { return; }
        
        let picker = Math.floor((Math.random() * 100));
        if (picker <= 5) {

            this.client.say(target, `@${context['display-name']} You have been crowned the Golden Egg`)
        }
        if (picker >= 99) {
            this.client.say(target, `@${context['display-name']} You have been crowned the Platinum Egg.. Now thats POG 'cuz this has 1 in 100 chance to happen.`)
        }
    }

    this.onConnectedHandler = function(addr, port) {
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