const twitch = require("./twitchapi.js")

twitch.isLive("jamystro", resp => {
    console.log(resp.data)
})