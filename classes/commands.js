const db = require('../db')
const fs = require('fs');
const axios = require('axios')
const logger = require("./logger.js");
const points = require('./points');

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
                this.client.say(target, `${user.username}, has ${res.goldcrowns} Golden Eggs, and ${res.platcrowns} PLATINUM EGGS.`)
            })
        })
        .catch(err => {
            logger.log(err)
        })
    }
    this.getPoints = (target, context, msg) => {
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
            let user = users[0]
            
            db.get('userdata', `userid = '${user.userid}'`)
            .then(res => {
                
                if (!res.length) return;
                res = res[0]

                db.get('userdata', null, '-points')
                .then(results => {
                    let pos = 0;
                    let participants = 0;
                    let index = 0
                    
                    participants = results.length
            
                    results.forEach(res => {
                        if (res.userid == user.userid) {
                            pos = index
                        }
                        index++;
                    })
                    this.client.say(target, `${user.displayname}, ${user.displayname} has ${res.points} ${this.points.namePlural} and is rank ${pos}/${participants} on the leaderboard.`)
                })
                .catch(err => {
                    logger.log(err)
                })
            })

        })
        .catch(err => {
            logger.log(err)
        })
    }
    this.gamble = (target, context, msg) => {
        let data = this.userdatas[0]

        let ext = this.extract(msg)
        let args1 = ext.args[0]
        let amount;

        switch (amount) {
            case "all":
                amount = data.points;
                break;
            default:
                amount = JSON.parse(args1)
                break;
        }

        let user = this.users[0]

        if (amount > data.points) {
            this.client.say(target, `${user.displayname}, You don't have ${amount} ${this.points.namePlural}.`)
            return;
        }

        user = {
            user: user,
            userdata: data
        }

        if (Math.random() <= (user.user.subscriber) ? .47 : .51) {
            points.add_points(user, amount)
            this.client.say(target, `${user.user.displayname}, gambled with ${amount} ${this.points.namePlural}, and won! ${user.user.displayname} now has ${data.points + amount} ${this.points.namePlural}. PogChamp`)
        } else {
            points.set_points(user, data.points - amount)
            this.client.say(target, `${user.user.displayname}, gambled with ${amount} ${this.points.namePlural}, and lost! ${user.user.displayname} now has ${data.points - amount} ${this.points.namePlural}. FeelsBadMan`)
        }

    }
    this.setPoints = (target, context, msg) => {
        if (context.badges.broadcaster  || context.username == '4oofxd') {
            context.mod = true
        }
        if (!context.mod) return;

        let user = this.users[0]

        let ext = this.extract(msg)
        let amount = ext.args[0]

        points.set_points(user, JSON.parse(amount))
    }
    this.addTextCommand = (target, context, args) => {
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

    }
    this.updateTextCommand = (target, context, args) => {
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
    }
    this.textCommandsApplier = (target, context, msg) => {
        let rawdata = fs.readFileSync('./tcommands.json');
        let commands = JSON.parse(rawdata);

        commands.forEach(command => {
            if (this.command(command["command"], msg)) {
                this.client.say(target, command["reply"])
            }
        })
    }
    this.delTextCommand = (target, context, args) => {
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