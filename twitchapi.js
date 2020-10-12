const axios = require("axios")
require("dotenv").config()

module.exports = {
    auth(callback) {
        axios.post(`https://id.twitch.tv/oauth2/token`, {
            params: {
                'client_id'     : process.env.CLIENTID,
                'client_secret' : process.env.CLIENTSECRET,
                'grant_type'    : 'client_credentials'
            }
        })
        .then(callback)
        .catch(err => {
            console.log(err)
        })  
    },
    get(url, params, callback) {
        this.auth(autCall => {
            accessToken = autCall.data.access_token

            params.headers = {
                'Client-ID'     : process.env.CLIENTID,
                'Authorization' : "Bearer " + accessToken
            }

            axios.get(url, params)
            .then(callback)
            .catch(err => {
                console.log(err)
            })
        })
    },

}