const tmi = require("tmi.js")

require("dotenv").config()

const env = ("prod" == "prod") ? {
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

let opts = {
    identity: {
        username: env.name,
        password: env.oauth
    },
    channels: [
        env.channel
    ]
}

let client = tmi.client(opts)
client.connect()

client.on('message', (target, context, msg, self) => {
    if (self) return
    console.log(context)
})

client.on('connect', (addr, port) => {
    this.status = true
    logger.log(`* Connected   :  ${addr}:${port}`);
    logger.log(`  Username    :  ${env.name}`)
    logger.log(`  To Channel  :  ${env.channel}`)
})
