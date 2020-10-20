const db = require('../db')
const fs = require('fs');
const axios = require('axios')
const logger = require("./logger.js");

let Commands = function() {
    this.bet = {
        title: "",
        opts: [],
        participants: [],
        prizepool: 0,
        status: false
    }


    this.extract = (msg) => {
        let command = msg.substr(1)
        let args = command.split(" ")
        command = args[0]
        args.shift()
        
        if (msg[0] != this.prefix) {
            command = ""
            args = []
        }

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
        if (Math.random() >= .996) {
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

        
        if (Math.random() <= .0004) {
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
    
    
    this.getEggs = (target, context, msg) => {
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
            this.client.say(target, `${context["display-name"]} added ${this.prefix}${command}.`)
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
    
    
    this.startbet = (target, context, msg) => {
        let args = this.extract(msg).args

        if (this.bet.started) {
            this.client.say(target, "There is already a bet going on... End the first one before starting another.")
            return 
        }

        args = args.join(" ").split(";")

        let title = args[0]
        let opts = args[1]

        opts = opts.split(",")

        this.bet = {
            title: title,
            opts: opts,
            participants: [],
            prizepool: 0,
            started: true
        }

        let printableopts = " " + this.bet.opts.map(opt => (this.bet.opts.indexOf(opt)+1) + "."+ opt).join(" or ")
        let _msg = this.bet.title + printableopts + " (Place your bets using !bet {amount} {option num})"
        this.client.say(target, _msg)
    }


    this.submitbet = (target, context, msg) => {
        if (!this.bet.started) return
        let args = this.extract(msg).args

        let participant = this.bet.participants.filter(p => p.user.userid == context["user-id"])[0]

        if (args.length) {
            if (participant) {
                this.client.say(target, `${participant.user.displayname} is already participating with ${participant.betting} ${this.points.namePlural}`)
                return
            }

            participant = {
                user: this.users[0],
                data: this.userdatas[0],
                betting: 0,
                choosing: -1,
                winner: false
            }

            let betAmount = JSON.parse(args[0])
            let betChoosing = JSON.parse(args[1])

            if (betAmount < 0 || betAmount > participant.data.points) {
                this.client.say(target, `${participant.user.displayname}, You don't have ${betAmount} ${this.points.namePlural}`)
                return
            }

            if (betChoosing < 1 || betChoosing > this.bet.opts.length) {
                this.client.say(target, `${participant.user.displayname}, thats not a valid option.`)
                return
            }

            db.update(['userid', context["user-id"]], ['points'], [participant.data.points - betAmount], 'userdata')
            .then(res => {
                participant.betting = betAmount
                participant.choosing = betChoosing

                this.bet.prizepool += betAmount

                this.bet.participants.push(participant)

                this.client.say(target, `${participant.user.displayname} is now participating with ${participant.betting} ${this.points.namePlural}`)
            })
            .catch(err => {
                logger.log(err)
            })
        } else {
            let _msg = (participant ? `${participant.user.displayname} is already participating with ${participant.betting} ${this.points.namePlural} - ` : `Place your bets using !bet {amount} {option num} - `) + `There are ${this.bet.participants.length} participants with a sum of ${this.bet.prizepool} ${this.points.namePlural} in bets.`
            this.client.say(target, _msg)
        }
    }


    this.endbet = (target, context, msg) => {
        if (context.badges.broadcaster  || context.username == '4oofxd') {
            context.mod = true
        }
        if (!context.mod) return;

        let winChoosing = JSON.parse(this.extract(msg).args[0])
        let winnings

        this.bet.participants.forEach(p => {
            if (p.choosing != winChoosing) return 
            winnings = p.betting * 2

            this.bet.participants[this.bet.participants.indexOf(p)].winner = true
            
            db.update(['userid', context["user-id"]], ['points'], [p.data.points + winnings], 'userdata')
            .then(r => {
                logger.log(r)
            })
            .catch(err => {
                logger.log(err)
            })
        })


        this.client.say(target, `Bet is finished.. Winners are ${this.bet.participants.filter(p => p.winner).map(u => u.user.displayname).join(", ")}`)

        this.bet = {
            title: "",
            opts: [],
            participants: [],
            prizepool: 0,
            status: false
        }
    }
}


module.exports = Commands