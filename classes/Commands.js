const db = require('../db')
const fs = require('fs');
const axios = require('axios')
const logger = require("./Logger.js");

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
    
    
    this.gifting = (target, context, msg) => {
        // No filtering for empty results here cuz the function before did that
        userdata = this.userdatas[0]
        let q
        if (Math.random() >= .996) {
            
            q = `UPDATE userdata SET goldeggs = ${userdata.goldeggs + 1}, points = ${userdata.points + 2500} WHERE userid = '${context["user-id"]}'`
            db.query(q, (err, results, fields) => {
                if (err) {
                    logger.log(err)
                    return
                }

                logger.log(`[DB_UPDATE] user ${context['display-name']} goldeggs & points (${userdata.goldeggs + 1}, ${userdata.points + 2500})`)
                if ((userdata.goldeggs + 1) % 5 == 0) {
                    q = `UPDATE userdata SET plateggs = ${userdata.plateggs + 1}, points = ${userdata.points + 2500*5} WHERE userid = '${context["user-id"]}'`
                    db.query(q, (err, results, fields) => {
                        if (err) {
                            logger.log(err)
                            return
                        }

                        this.client.say(target, `${context.username}, You were lucky to be given The Golden Egg 5 times.. for that you have been gifted with The Platinum Egg!`)
                        logger.log(`[DB_UPDATE] user ${context['display-name']} plateggs & points (${userdata.plateggs + 1}, ${userdata.points + 2500*5})`)
                    })
                } else {
                    this.client.say(target, `${context.username}, You have been gifted with a Golden Egg!`)
                }
            })
        }

        
        if (Math.random() <= .0004) {
            q = `UPDATE userdata SET plateggs = ${userdata.plateggs + 1}, points = ${userdata.points + 2500*5} WHERE userid = '${context["user-id"]}'`
            db.query(q, (err, results, fields) => {
                if (err) {
                    logger.log(err)
                    return
                }

                this.client.say(target, `${context.username}, You have been gifted with The Platinum Egg!`)
                logger.log(`[DB_UPDATE] user ${context['display-name']} plateggs & points (${userdata.plateggs + 1}, ${userdata.points + 2500*5})`)
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

        let q = `SELECT u.userid, u.username, u.displayname, ud.goldeggs, ud.plateggs ` +
                `FROM users u, userdata ud `+
                `WHERE u.username = '${user}'`
        
        db.query(q, (err, results, fields) => {
            if (err) {
                logger.log(err)
                return
            }
            let res = results.rows
            if (!res.length) return
            user = res[0]

            this.client.say(target, `${user.displayname}, has ${user.goldeggs} Golden Eggs, and ${user.plateggs} Platinum Eggs!`)
        })
    }


    this.addTextCommand = (target, context, args) => {
        if (args.length <= 2) return;
        let command = args[0].toLowerCase()
        let reply = args.slice(1).join(" ")


        let q = `INSERT INTO tcommands (command, reply)` + 
                `VALUES ('${command}', '${reply}')` +
                `ON CONFLICT ON CONSTRAINT tcommands_command_key` +
                `DO UPDATE SET` +
                `reply = '${reply}'`
        db.query(q, (err, results, fields) => {
            if (err) {
                logger.log(err)
                return
            }

            logger.log(`[DB_INSERT_OR_UPDATE] tcommands inserted/updated ${this.prefix + command}.`)
        })
    }


    this.updateTextCommand = (target, context, args) => {
        if (args.length <= 2) return;
        let command = args[0].toLowerCase()
        let reply = args.slice(1).join(" ")

        let q = `UPDATE tcommands SET reply = '${reply}' WHERE command = '${command}'`
        db.query(q, (err, results, fields) => {
            if (err) {
                logger.log(err)
                return
            }

            logger.log(`[DB_UPDATE] tcommands updated ${this.prefix + command}.`)
        })
    }
    
    
    this.textCommandsApplier = (target, context, msg) => {
        let q = `SELECT * FROM tcommands`
        db.query(q, (err, results, fields) => {
            if (err) {
                logger.log(err)
                return
            }

            results.rows.forEach(command => {
                if (this.command(command['command'], msg)) {
                    this.client.say(target, command["reply"])
                }
            })
        })

    }


    this.delTextCommand = (target, context, args) => {      
        if (args.length != 1) return;
        let command = args[0].toLowerCase()

        let q = `DELETE FROM tcommands WHERE command = '${command}'`
        db.query(q, (err, results, fields) => {
            if (err) {
                logger.log(err)
                return
            }

            logger.log(`[DB_DELETE] tcommands deleted ${this.prefix + command}.`)
        })
    }


    this.descTextCommand = (target, context, args) => {
        if (args.length < 1) return;
        let command = args[0].toLowerCase()
        let desc = args.slice(1).join(" ")

        let q = `UPDATE tcommands SET desc = '${desc}' WHERE command = '${command}'`
        db.query(q, (err, results, fields) => {
            if (err) {
                logger.log(err)
                return
            }

            logger.log(`[DB_UPDATE] tcommands updated ${this.prefix + command} description.`)
        })
    }

    
    this.textCommandsHandler = (target, context, msg) => {
        if (context.badges.broadcaster || context.username == '4oofxd') context.mod = true
        if (!context.mod) return;

        let ext = this.extract(msg)
        let action = ext.args[0]
        let args = ext.args.slice(1)

        if (["update", "add", "delete", "del", "remove", "desc"].includes(action)) {
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
                case "desc":
                    this.descTextCommand(target, context, args)
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
        if (context.badges.broadcaster || context.username == '4oofxd') context.mod = true
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
        if (context.badges.broadcaster || context.username == '4oofxd') context.mod = true
        if (!context.mod) return 

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

            let q = `UPDATE userdata SET points = ${participant.data.points - betAmount} WHERE userid = '${context["user-id"]}'`
            db.query(q, (err, results, fields) => {
                if (err) {
                    logger.log(err)
                    return
                }

                participant.betting = betAmount
                participant.choosing = betChoosing

                this.bet.prizepool += betAmount

                this.bet.participants.push(participant)

                this.client.say(target, `${participant.user.displayname} is now participating with ${participant.betting} ${this.points.namePlural}`)
            })
        } else {
            let _msg = (participant ? `${participant.user.displayname} is already participating with ${participant.betting} ${this.points.namePlural} - ` : `Place your bets using !bet {amount} {option num} - `) + `There are ${this.bet.participants.length} participants with a sum of ${this.bet.prizepool} ${this.points.namePlural} in bets.`
            this.client.say(target, _msg)
        }
    }


    this.endbet = (target, context, msg) => {
        if (context.badges.broadcaster || context.username == '4oofxd') context.mod = true
        if (!context.mod) return;

        let winChoosing = JSON.parse(this.extract(msg).args[0])
        let winnings

        this.bet.participants.forEach(p => {
            if (p.choosing != winChoosing) return 
            winnings = p.betting * 2

            this.bet.participants[this.bet.participants.indexOf(p)].winner = true

            let q = `UPDATE userdata SET points = ${p.data.points + winnings} WHERE userid = '${context["user-id"]}'`
            db.query(q, (err, results, fields) => {
                if (err) {
                    logger.log(err)
                    return
                }

                logger.log(`[DB_UPDATE] userdata where userid = '${context["userid"]}' updated points to ${p.data.points + winnings}`)
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
