const fs = require("fs")
const path = require("path")
const dir = path.resolve(__dirname, '..')
require("dotenv").config()

const mode = process.env.MODE || "prod" 

module.exports = {
    logs: [],
    log(msg, doConsoleLog) {
        this.logs.push(msg)
        if (mode == "prod") return
        if (!doConsoleLog) console.log(msg);

        fs.writeFile(this.logFile, `[${new Date().toISOString().replace(/T/, " ")}]  ` + msg + "\n", {flag: "a+"}, err => {
            if (err) throw err
        })
    },
    newSave() {
        if (mode == "prod") return 
        this.logFile = path.join(dir, `/logs/log-${new Date().toISOString().replace(/T/, "-").replace(/\..+/, "")}.txt`.replace(/:/g, "-"))
        fs.writeFile(this.logFile, "", err => {
            if (err) throw err
        });
    }
}
