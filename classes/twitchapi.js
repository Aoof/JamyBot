const axios = require("axios")
const logger = require("./logger.js")

module.exports = {
    auth(callback) {
        axios.post(`https://id.twitch.tv/oauth2/token?client_id=${this.env.client_id}&client_secret=${this.env.client_secret}&grant_type=client_credentials`)
        .then(callback)
        .catch(err => {
            logger.log(err.response.data)
        })  
    },
    get(url, params, callback) {
        this.auth(autCall => {
            accessToken = autCall.data.access_token

            params.headers = {
                'Client-ID'     : this.env.client_id,
                'Authorization' : "Bearer " + accessToken
            }

            axios.get(url, params)
            .then(callback)
            .catch(err => {
                logger.log(err.response.data)
            })
        })
    }
}