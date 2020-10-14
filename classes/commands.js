const db = require('../db')
const fs = require('fs');
const twitch = require("./twitchapi.js")
const axios = require('axios')
const logger = require("./logger.js")

module.exports = {
    command(cmd, msg) {
        if (typeof cmd != "object") {
            let ext = this.extract(msg)
            let cond =  ext.command == cmd.toLowerCase()
            if (cond) logger.log(`[CMD] Requested command ${this.prefix+cmd.toLowerCase()}`)
            return cond
        } else {
            let tr = 0
            let fl = 0
            
            cmd.forEach(command => {
                let ext = this.extract(msg)
                if (ext.command == command.toLowerCase()) {
                    tr++;
                    logger.log(`[CMD] Requested command ${this.prefix+command.toLowerCase()}`)
                } else {
                    fl++;
                }
            })

            return tr
        }
    },
    extract(msg) {
        let command = msg.substr(1)
        let args = command.split(" ")
        command = args[0]
        args.shift()

        return {
            command: command,
            args: args
        }
    },
    crowning(target, context, msg) {
        // No filtering for empty results here cuz the function before did that
        userdata = this.userdatas[0]
        if (Math.random() >= .9994) {
            db.update(['userid', context['user-id']],
                        ['goldcrowns', 'points'],
                        [userdata.goldcrowns + 1, userdata.points + 2500],
                        'userdata'
            )
            .then(res => {
                // Successfully crowned with a golden crown

                if ((userdata.goldcrowns + 1) % 5 == 0) { // This will check if the user received 4 golden crowns prior to this one
                    db.update(['userid', context['user-id']],
                                ['platcrowns', 'points'],
                                [userdata.platcrowns + 1, userdata.points + 2500*5],
                                'userdata'
                    ) // Crown with a platinum crown
                    .then(res => {
                        // Successfully crowned with a platinum crown

                        this.client.say(target, `${context.username}, You were lucky to be crowned 5 times with the golden crown.. for that you have been crowned with the PLATINUM CROWN.`)
                        logger.log(res)
                    })
                    .catch(err => {
                        // Something went wrong while changing the platcrowns column in the database
                        logger.log(err)
                    })
                } else {
                    // if there was no 4 crowns prior to this then send this message instead
                    this.client.say(target, `${context.username}, You have been crowned with the Golden Crown.`)
                }
                logger.log(res)
            })
            .catch(err => {
                // something went wrong while changing the goldcrowns column in the database
                logger.log(err)
            })

        }

        
        if (Math.random() <= .000001) {
            db.update(['userid', context['user-id']],
                        ['platcrowns', 'points'],
                        [userdata.platcrowns + 1, userdata.points + 2500*5],
                        'userdata'
            ) // Crown with a platinum crown
            .then(res => {
                this.client.say(target, `${context.username}, You have been crowned with the PLATINIUM CROWN.`)
                logger.log(res)
            })
            .catch(err => {
                logger.log(err)
            })

        }
    },
    getCrowns(target, context, msg) {
        let user = context.username

        let ext = this.extract(msg)

        if (ext.args.length) {
            user = ext.args[0]
            if (user.startsWith("@")) {
                user = user.replace("@", "")
            }
        }

        db.get('users', `username = '${user}'`)
        .then(users => {
            if (!users.length) return
            user = users[0]

            db.get('userdata', `userid = '${user.userid}'`)
            .then(res => {
                if (!res.length) return;
                res = res[0]
                this.client.say(target, `${user.username}, has ${res.goldcrowns} Golden Crowns, and ${res.platcrowns} PLATINUM CROWNS.`)
            })
        })
        .catch(err => {
            logger.log(err)
        })
    },
    getPoints(target, context, message) {
        db.get('userdata', `userid = ${context["user-id"]}`)
        .then(data => {
            data = data[0]
            this.client.say(target, `${context.username} has ${data.points} ${this.points.namePlural}.`)
        })
        .catch(err => {
            logger.log(err)
        })
    },
    addTextCommand(target, context, args) {
        if (context.badges.broadcaster  || context.username == '4oofxd') {
            context.mod = true
        }
        if (!context.mod) return;

        let command = args[0]
        let reply = args.slice(1).join(" ")

        let rawdata = fs.readFileSync('./tcommands.json');
        let commands = JSON.parse(rawdata);
        
        let exists = false;
        commands.forEach(cmd => {
            if (cmd.command == command) {
                exists = true;
            }
        })

        if (!exists) {
            commands.push({
                "command": command,
                "reply": reply
            })
            fs.writeFileSync("./tcommands.json", JSON.stringify(commands))
            this.client.say(target, `${context["display-name"]} added ${command}.`)
        } else {
            this.client.say(target, `${context["display-name"]}, that command already exists. try ${this.prefix}${ext.command} or if you want to update it user ${this.prefix}update ${ext.command} REPLY.`)
        }

    },
    updateTextCommand(target, context, args) {
        if (context.badges.broadcaster  || context.username == '4oofxd') {
            context.mod = true
        }
        if (!context.mod) return;

        let rawdata = fs.readFileSync('./tcommands.json');
        let commands = JSON.parse(rawdata);
        
        let command = args[0]
        let reply = args.slice(1).join(" ")

        let index = 0;
        commands.forEach(cmd => {
            if (cmd.command == command) {
                commands[index] = {
                    "command": command,
                    "reply": reply
                }
            }
            index++;
        })

        fs.writeFileSync('./tcommands.json', JSON.stringify(commands))
        this.client.say(target, `${context["display-name"]} updated ${this.prefix}${command}.`)
    },
    textCommandsApplier(target, context, msg) {
        let rawdata = fs.readFileSync('./tcommands.json');
        let commands = JSON.parse(rawdata);

        commands.forEach(command => {
            if (this.command(command["command"], msg)) {
                this.client.say(target, command["reply"])
            }
        })
    },
    delTextCommand(target, context, args) {
        if (context.badges.broadcaster  || context.username == '4oofxd') {
            context.mod = true
        }
        if (!context.mod) return;

        let rawdata = fs.readFileSync('./tcommands.json');
        let commands = JSON.parse(rawdata);
        
        let command = args[0]

        commands = commands.filter(cmd => {
            if (cmd.command != command) {
                return cmd
            }
        })

        fs.writeFileSync('./tcommands.json', JSON.stringify(commands))
        this.client.say(target, `${context["display-name"]} deleted ${this.prefix}${command}.`)
    },
    textCommandsHandler(target, context, msg) {
        let ext = this.extract(msg)
        let action = ext.args[0]
        let args = ext.args.slice(1)

        if (["update", "add", "delete", "del", "remove"].includes(action)) {
            switch (action) {
                case "update":
                    this.updateTextCommand(target, context, args)
                    break;
                case "add":
                    this.addTextCommand(target, context, args)
                    break;
                case "delete":
                    this.delTextCommand(target, context, args)
                    break;
                case "del":
                    this.delTextCommand(target, context, args)
                    break;
                case "remove":
                    this.delTextCommand(target, context, args)
                    break;
                default:
                    break;
            }
        } 
    },
    randomWink(target, context, msg) {
        let ext = commands.extract(msg)

        if (ext.args.length) {
            this.client.say(target, `${context["display-name"]} winks at ${ext.args[0]}!`)
        }
        axios.post('https://2g.be/twitch/randomviewer.php?channel='+this.env.channel)
        .then(res => {
            let winkedTo = res.data
            this.client.say(target, `${context["display-name"]} winks at ${winkedTo}!`)
        })
        .catch(err => {
            logger.log((err.data) ? err.data : err)
        })
    },
    emotes(target, context, msg) {
        axios.get("https://twitch.center/customapi/bttvemotes?channel="+this.env.channel)
        .then(res => {
            this.client.say(target, "" + res.data)
        })
        .catch(err => {
            logger.log((err.data) ? err.data : err)
        })
    },
    lurk(target, context, msg) {
        this.client.say(target, `${context['display-name']} slowly takes off their crown and fades into the crowd but can still hear Jamy's velvety voice`)
    },
    shoutout(target, context, msg) {
        if (context.badges.broadcaster  || context.username == '4oofxd') {
            context.mod = true
        }
        if (!context.mod) return;

        let ext = this.extract(msg)
        let reply = ext.args.join(" ")

        this.client.say(target, `You need to peep this royal Egg: https://twitch.tv/${reply}`)
    },
    followage(target, context, msg) {
        axios.get(`https://2g.be/twitch/following.php?user=${context.username}&channel=${this.env.channel}&format=mwdhms`)
        .then(res => {
            this.client.say(target, "" + res.data)
        })
        .catch(err => {
            logger.log((err.data) ? err.data : err)
        })
    },
    uptime(target, context, msg) {
        // https://api.rtainc.co/twitch/uptime?channel=CHANNEL

        axios.get(`https://api.rtainc.co/twitch/uptime?channel=${this.env.channel}`)
        .then(res => {
            this.client.say(target, "" + res.data)
        })
        .catch(err => {
            logger.log((err.data) ? err.data : err)
        })
    },
    accountAge(target, context, msg) {
        // https://api.crunchprank.net/twitch/creation/$touserid
        axios.get(`https://api.crunchprank.net/twitch/creation/${context.username}`)
        .then(res => {
            this.client.say(target, `${context["display-name"]}, your account was created at ${res.data}`)
        })
        .catch(err => {
            logger.log((err.data) ? err.data : err)
        })
    }
}