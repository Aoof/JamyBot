const express = require('express')
const app = express()

app.get("/", function (req, res) {
    res.send("Royal Butler is working!")
})

module.exports = app