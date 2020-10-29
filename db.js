const logger = require("./classes/Logger.js")
// const mysql = require("mysql")
const {Client} = require("pg")

require("dotenv").config()

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    secure: true,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect()

module.exports = client