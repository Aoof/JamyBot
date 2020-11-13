const bot = require("./bot")
const TwitchAPI = require("./classes/TwitchAPI")
const db = require("./db")
const logger = require("./classes/Logger")
const app = require("./web/app")

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

app.listen(process.env.PORT || 8080)
logger.log(`Listening to http://127.0.0.1:${process.env.PORT || 8080}/`)