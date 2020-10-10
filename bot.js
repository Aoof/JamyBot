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
        /*
            # Receive message
            # Insert user to database if not already registered
            # Randomly check if user will get crowned or not
            # # Golden crown 5% Chance
            # # Platinum crown .1% Chance
            # Save user's data accordingly
        */

        db.get('users', `userid = '${context["user-id"]}'`).then(result => {
            if (result.length) return;

            db.insert( // User
                ['userid',
                 'username',
                 'badgesraw',
                 'room_id',
                 'moderator',
                 'subscriber'], // Keys
                [context["user-id"],
                 context.username,
                 context["badges-raw"],
                 context["room-id"],
                 context.mod,
                 context.subscriber], // Values
                 'users'
                ).then(res => {
                    console.log(res)
                }).catch(err => {
                    console.log(err)
                })
        }).catch(err => {
            console.log(err)
        })
        

        db.get('userdata', `userid = '${context["user-id"]}'`).then(result => {
            if (result.length) return;

            db.insert( // User Data
                ['userid'], // Keys
                [context["user-id"]], // Values
                 'userdata'
                ).then(res => {
                    console.log(res)
                }).catch(err => {
                    console.log(err)
                })
        }).catch(err => {
            console.log(err)
        })
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