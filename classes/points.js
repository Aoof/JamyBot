const twitch = require("./twitchapi.js")
const db = require("../db.js")
const logger = require("./logger.js")

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


    this.add_points = (user, points) => {
        db.update(['userid', user.user.userid], ["points"], 
        [user.userdata.points + points], 'userdata')
        .then(res => {
            logger.log(res)
        })
        .catch(err => {
            logger.log(err)
        })
    }


    this.set_points = (user, points) => {
        db.update(['userid', user.user.userid], ["points"],
        [points], 'userdata')
        .then(res => {
            logger.log(res)
        })
        .catch(err => {
            logger.log(err)
        })
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
                    let pos;
                    let participants = 0;
                    let index = 1
                    
                    participants = results.length
            
                    results.forEach(res => {
                        if (res.userid == user.userid) {
                            pos = index
                        }
                        index++;
                    })
                    this.client.say(target, `${context["display-name"]}, ${user.displayname} has ${res.points} ${this.points.namePlural} and is rank ${pos}/${participants} on the leaderboard.`)
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

        switch (args1) {
            case "all":
                amount = data.points;
                break;
            default:
                amount = JSON.parse(args1)
                break;
        }

        let user = this.users[0]

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

        let percentage = (user.user.subscriber) ? .5 : .45
        
        if (Math.random() <= percentage) {
            this.add_points(user, amount)
            this.client.say(target, `${user.user.displayname}, gambled with ${amount} ${this.points.namePlural}, and won PogChamp! and now has ${data.points + amount} ${this.points.namePlural}. PogChamp`)
        } else {
            this.set_points(user, data.points - amount)
            this.client.say(target, `${user.user.displayname}, gambled with ${amount} ${this.points.namePlural}, and lost LUL! and now has ${data.points - amount} ${this.points.namePlural}. LUL`)
        }

    }


    this.timedMessage = (interval) => {
        logger.log(`There are ${this.online_users.length} users online`)
        this.client.say('#'+this.env.channel, 'Don\'t mind me, just wanted to say the king\'s head looks extra shiny today.')
        setTimeout(() => this.timedMessage(interval), 1000*60*60*interval)
    }


    this.timedMessage2 = (interval) => {
        logger.log(`There are ${this.online_users.length} users online`)
        this.client.say('#'+this.env.channel, 'If you see a bug, get my master Aoof to squash it.')
        setTimeout(() => this.timedMessage2(interval), 1000*60*60*interval)
    }


    this.onlineUsersHandler = () => {
        let index = 0
        if (this.online_users) this.online_users.forEach(online_user => {
            let multiplier = 1
            if (online_user.user.subscriber) multiplier = 1.2

            this.online_users[index].userdata.points = online_user.userdata.points + 10*multiplier
            this.add_points(online_user, 10*multiplier)

            index++;
        })
        setTimeout(this.onlineUsersHandler, 1000*60)
    }
}

module.exports = Points