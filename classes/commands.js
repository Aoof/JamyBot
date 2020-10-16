const db = require('../db')
const fs = require('fs');
const axios = require('axios')
const logger = require("./logger.js");

let Commands = function() {
    this.extract = (msg) => {
        let command = msg.substr(1)
        let args = command.split(" ")
        command = args[0]
        args.shift()

        return {
            command: command,
            args: args
        }
    }
    this.command = (cmd, msg) => {
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
    }
    this.crowning = (target, context, msg) => {
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

                        this.client.say(target, `${context.username}, You were lucky to be given the golden egg 5 times.. for that you have been gifted with a PLATINUM EGG.`)
                        logger.log(res)
                    })
                    .catch(err => {
                        // Something went wrong while changing the platcrowns column in the database
                        logger.log(err)
                    })
                } else {
                    // if there was no 4 crowns prior to this then send this message instead
                    this.client.say(target, `${context.username}, You have been gifted with a Golden Egg.`)
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
                this.client.say(target, `${context.username}, You have been gifted with THE PLATINIUM EGG.`)
                logger.log(res)
            })
            .catch(err => {
                logger.log(err)
            })

        }
    }
    this.getCrowns = (target, context, msg) => {
        let user = context.username

        let ext = this.extract(msg)

        if (ext.args.length) {
            user = ext.args[0].toLowerCase()
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
                this.client.say(target, `${user.username}, has ${res.goldcrowns} Golden Eggs, and ${res.platcrowns} PLATINUM EGGS.`)
            })
        })
        .catch(err => {
            logger.log(err)
        })
    }
    this.addTextCommand = (target, context, args) => {
        let command = args[0]
        let reply = args.slice(1).join(" ")

        db.insert(["command", "reply"], [command, reply], 'tcommands')
        .then(res => {
            logger.log(res)
            this.client.say(target, `${context["display-name"]} added ${command}.`)
        })
        .catch(err => {
            logger.log(err)
        })
    }
    this.updateTextCommand = (target, context, args) => {
        let command = args[0]
        let reply = args.slice(1).join(" ")

        db.update(['command', command], ["reply"], [reply], 'tcommands')
        .then(res => {
            logger.log(res)
            this.client.say(target, `${context["display-name"]} updated ${this.prefix}${command}.`)
        })
        .catch(err => {
            logger.log(err)
        })

    }
    this.textCommandsApplier = (target, context, msg) => {
        db.get('tcommands')
        .then(commands => {
            commands.forEach(command => {
                if (this.command(command["command"], msg)) {
                    this.client.say(target, command["reply"])
                }
            })
        })
        .catch(err => {
            logger.log(err)
        })

    }
    this.delTextCommand = (target, context, args) => {        
        let command = args[0]

        db.delete(['command', command], 'tcommands')
        .then(res => {
            logger.log(res)
            this.client.say(target, `${context["display-name"]} deleted ${this.prefix}${command}.`)
        })
        .catch(err => {
            logger.log(err)
        })
    }
    this.textCommandsHandler = (target, context, msg) => {
        if (context.badges.broadcaster  || context.username == '4oofxd') {
            context.mod = true
        }
        if (!context.mod) return;

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
    }
    this.randomWink = (target, context, msg) => {
        let ext = this.extract(msg)

        if (ext.args.length) {
            this.client.say(target, `${context["display-name"]} winks at ${ext.args[0]}!`)
            return
        }
        axios.post('https://2g.be/twitch/randomviewer.php?channel='+this.env.channel)
        .then(res => {
            let winkedTo = res.data
            this.client.say(target, `${context["display-name"]} winks at ${winkedTo}!`)
        })
        .catch(err => {
            logger.log((err.data) ? err.data : err)
        })
    }
    this.emotes = (target, context, msg) => {
        axios.get("https://twitch.center/customapi/bttvemotes?channel="+this.env.channel)
        .then(res => {
            this.client.say(target, "" + res.data)
        })
        .catch(err => {
            logger.log((err.data) ? err.data : err)
        })
    }
    this.lurk = (target, context, msg) => {
        this.client.say(target, `${context['display-name']} slowly takes off their crown and fades into the crowd but can still hear Jamy's velvety voice`)
    }
    this.shoutout = (target, context, msg) => {
        if (context.badges.broadcaster  || context.username == '4oofxd') {
            context.mod = true
        }
        if (!context.mod) return;

        let ext = this.extract(msg)
        let reply = ext.args.join(" ")

        this.client.say(target, `You need to peep this royal Egg: https://twitch.tv/${reply}`)
    }
    this.followage = (target, context, msg) => {
        axios.get(`https://2g.be/twitch/following.php?user=${context.username}&channel=${this.env.channel}&format=mwdhms`)
        .then(res => {
            this.client.say(target, "" + res.data)
        })
        .catch(err => {
            logger.log((err.data) ? err.data : err)
        })
    }
    this.uptime = (target, context, msg) => {
        // https://api.rtainc.co/twitch/uptime?channel=CHANNEL

        axios.get(`https://api.rtainc.co/twitch/uptime?channel=${this.env.channel}`)
        .then(res => {
            this.client.say(target, "" + res.data)
        })
        .catch(err => {
            logger.log((err.data) ? err.data : err)
        })
    }
    this.accountAge = (target, context, msg) => {
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


module.exports = Commands