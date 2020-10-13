const fs = require("fs")

module.exports = {
    log(msg, doConsoleLog) {
        if (!doConsoleLog) console.log(msg);
            
        fs.writeFile(this.logFile, `[${new Date().toISOString().replace(/T/, " ").replace(/\..+/, "")}]  ` + msg + "\n", {flag: "a+"}, err => {
            if (err) throw err
        })
    },
    newSave() {
        this.logFile = `./logs/log-${new Date().toISOString().replace(/T/, "-").replace(/\..+/, "")}.txt`.replace(/:/g, "-")
        fs.writeFile(this.logFile, "", err => {
            if (err) throw err
        });
    } 
}