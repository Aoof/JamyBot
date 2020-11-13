const twitch = require("./TwitchAPI.js")
const db = require("../db.js")
const logger = require("./Logger")
const Filter = require("./Filter.js")

let Points = function () {
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


    this.add_points = (user, points, callback=null) => {
        let q = `UPDATE userdata SET points = points + ${points} WHERE userid = '${user.userid}'`
        db.query(q, (err, results, fields) => {
            if (err) {
                logger.log(err)
                return
            }

            logger.log(`[DB_UPDATE] userdata where userid = '${user.userid}' increased points by ${points}`)
        })
    }


    this.set_points = (user, points, callback=null) => {
        let q = `UPDATE userdata SET points = ${points} WHERE userid = '${user.userid}'`
        db.query(q, (err, results, fields) => {
            if (err) {
                logger.log(err)
                return
            }

            if (typeof callback == "function") callback(points)
            logger.log(`[DB_UPDATE] userdata where userid = '${user.userid}' updated points to ${points}`)
        })
    }
    
    this.givePoints = (from_user, to_user, amount, callback=null) => {
        let q = `UPDATE userdata SET points = ${from_user.userdata.points - amount} WHERE userid = '${from_user.user.userid}'`                
        
        db.query(q, (err, results, fields) => {
            if (err) {
                logger.log(err)
                return
            }

            logger.log(`[DB_UPDATE] userdata where userid = '${from_user.user.userid}' updated points to ${from_user.userdata.points} - ${amount}`)
        })

        q = `UPDATE userdata SET points = ${to_user.userdata.points + amount} WHERE userid = '${to_user.user.userid}'`
        db.query(q, (err, results, fields) => {
            if (err) {
                logger.log(err)
                return
            }

            if (typeof callback == "function") callback(amount)
            logger.log(`[DB_UPDATE] userdata where userid = '${to_user.user.userid}' updated points to ${to_user.userdata.points} + ${amount}`)
        })
    }

    this.pointsHandler = (target, context, msg) => {
        let user = {
            user: this.req.user,
            userdata: this.req.userdata
        }

        let ext = this.extract(msg)

        if (ext.args.length <= 1) {
            this.getPoints(target, context, msg)
            return;
        }

        let action = ext.args[0]
        let args = ext.args.slice(1)
        let amount
        
        if (["set", "give"].includes(action)) {
            let q = `SELECT u.*, ud.goldeggs, ud.plateggs, ud.points FROM users u, userdata ud WHERE u.username = '${args[0].toLowerCase().replace(/@/g, '')}' AND u.userid = ud.userid`
            db.query(q, (err, results, fields) => {
                if (err) {
                    logger.log(err)
                    return
                }

                let data = results.rows[0]
                let u = {
                    userid: data.userid,
                    username: data.username,
                    displayname: (data.displayname) ? data.displayname : data.username,
                    badgesraw: data.badgesraw,
                    room_id: data.room_id,
                    moderator: data.moderator,
                    subscriber: data.subscriber
                }

                let ud = {
                    points: data.points,
                    goldeggs: data.goldeggs,
                    plateggs: data.plateggs
                }
                switch (action) {
                    case "set":
                        if (context.badges.broadcaster || context.username == '4oofxd') context.mod = true
                        if (!context.mod) break;
                        if (/^\d+$/.test(args[1])) this.set_points(u, JSON.parse(args[1]), res => {
                            this.client.say(target, `${context['display-name']}, has updated ${u.displayname}'s ${this.points.namePlural} from ${ud.points} to ${res} ${this.points.namePlural}.`)
                        })
                        break;
                    case "give":
                        
                        if (/^\d+$/.test(args[1])) amount = JSON.parse(args[1])
                        
                        if (amount < 0) this.client.say(target, `${user.user.displayname}, You cannot give ${amount} ${this.points.namePlural}.`)
                        if (amount > user.userdata.points) this.client.say(target, `${user.user.displayname}, You don't have ${amount} ${this.points.namePlural}`)
                        if (amount < 0 || amount > user.userdata.points) break;

                        if (args[0].toLowerCase().replace(/@/g, '') == context.username) {
                            this.client.say(target, context["display-name"] + ", You cannot give money to yourself")
                            return
                        }
                        
                        this.givePoints(user, {user: u, userdata: ud}, amount, res => {
                            this.client.say(target, `${context['display-name']} gave ${u.displayname} ${res} ${this.points.namePlural}`)
                        })
                        break;
                    default:
                        break;
                }
            })
        }
    }


    this.getPoints = (target, context, msg) => {
        let user = context.username

        let ext = this.extract(msg)

        if (ext.args.length) {
            user = ext.args[0].toLowerCase()
            if (user.startsWith("@")) {
                user = user.replace("@", "")
            }
        }

        let q = `SELECT (u).*, ud.goldeggs, ud.plateggs, ud.points FROM users u, userdata ud WHERE u.username = '${user}' AND u.userid = ud.userid`
        db.query(q, (err, results, fields) => {
            if (err) {
                logger.log(err)
                return
            }
            if (!results.rows.length) return
            
            let data = results.rows[0]
            let pos;
            let participants = 0;
            let index = 1;

            q = `SELECT * FROM userdata ORDER BY -points`
            db.query(q, (err, results, fields) => {
                if (err) {
                    logger.log(err)
                    return
                }

                participants = results.rows.length

                results.rows.forEach(res => {
                    if (res.userid == data.userid) {
                        pos = index
                    }
                    index++;
                })
                this.client.say(target, `${context["display-name"]}, ${data.displayname} has ${data.points} ${this.points.namePlural} and is rank ${pos}/${participants} on the leaderboard.`)
            })
        })
    }


    this.gamble = (target, context, msg) => {
        let data = this.req.userdata

        let ext = this.extract(msg)
        let args1 = ext.args[0]
        let amount;

        if (args1 == "all") {
            amount = data.points;
        } else if (args1 == "half") {
            amount = Math.ceil(data.points/2)
        } else if (args1 == "quarter") {
            amount = Math.ceil(data.points/4)
        } else if (/^\d+$/.test(args1)) {
            amount = JSON.parse(args1)
        } else {
            return
        }

        let user = this.req.user

        if (amount > data.points ) {
            this.client.say(target, `${user.displayname}, You don't have ${amount} ${this.points.namePlural}.`)
            return;
        }

        if (amount <= 0) {
            this.client.say(target, `${user.displayname}, You can't gamble with ${amount} ${this.points.namePlural}.`)
            return
        } 

        user = {
            user: user,
            userdata: data
        }

        if (user.user.subscriber || user.user.moderator || context.badges.broadcaster) {
            this.percentage = .5
        } else {
            this.percentage = .45
        }

        if (this.gamblingRigged) this.percentage = Math.random()

        logger.log(`Gambling Percentage for ${user.user.displayname}: ${this.percentage}`)
        
        if (Math.random() <= this.percentage) {
            this.add_points(user.user, amount)
            if (!this.gamblingRigged) this.client.say(target, `${user.user.displayname}, gambled with ${amount} ${this.points.namePlural}, and won PogChamp! and now has ${data.points + amount} ${this.points.namePlural}. PogChamp`)
            else this.client.say(target, `${user.user.displayname}, gambled with ${amount} ${this.points.namePlural}, and won with ${Math.ceil(this.percentage*100)}% win rate PogChamp! and now has ${data.points + amount} ${this.points.namePlural}. PogChamp`)
        } else {
            this.set_points(user.user, data.points - amount)
            if (!this.gamblingRigged) this.client.say(target, `${user.user.displayname}, gambled with ${amount} ${this.points.namePlural}, and lost LUL! and now has ${data.points - amount} ${this.points.namePlural}. LUL`)
            else this.client.say(target, `${user.user.displayname}, gambled with ${amount} ${this.points.namePlural}, and lost with ${Math.ceil(this.percentage*100)}% win rate LUL! and now has ${data.points - amount} ${this.points.namePlural}. LUL`)
        }

    }


    this.timedMessage = (msg) => {
        logger.log(`There are ${this.online_users.length} users online`)
        this.client.say('#'+this.env.channel, msg)
    }


    this.rigGambling = (context) => {
        if (context.badges.broadcaster || context.username == '4oofxd') context.mod = true
        if (!context.mod) return
        
        this.gamblingRigged = true
        this.percentage = Math.random()
        logger.log("Rigged gambling command")
        setTimeout(() => this.gamblingRigged = false, 1000*60*10)
    }
}

module.exports = Points
