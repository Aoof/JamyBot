const db = require('./db')


module.exports = {
    command(cmd, msg) {
        if (typeof cmd != "object") {
            return msg.startsWith(this.prefix + cmd.toLowerCase())
        } else {
            let tr = 0
            let fl = 0
            
            cmd.forEach(command => {
                if (msg.startsWith(this.prefix + command.toLowerCase())) {
                    tr++;
                } else {
                    fl++;
                }
            })

            return tr
        }
    },
    extract(msg) {
        let command = msg.substr(1)
        let args = command.split(" ").slice(1)
        command = args[0]
        args.pop(0)

        return {
            command: command,
            args: args
        }
    },
    crowning(target, context, msg) {
        db.get('userdata', `userid = ${context["user-id"]}`)
        .then(userdatas => {
            userdata = userdatas[0]
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

                            this.client.say(target, `/me @${context.username}, You were lucky to be crowned 5 times with the golden crown.. for that you have been crowned with the PLATINUM CROWN.`)
                            console.log(res)
                        })
                        .catch(err => {
                            // Something went wrong while changing the platcrowns column in the database
                            console.log(err)
                        })
                    } else {
                        // if there was no 4 crowns prior to this then send this message instead
                        this.client.say(target, `/me @${context.username}, You have been crowned with the Golden Crown.`)
                    }
                    console.log(res)
                })
                .catch(err => {
                    // something went wrong while changing the goldcrowns column in the database
                    console.log(err)
                })

            }

            
            if (Math.random() <= .000001) {
                db.update(['userid', context['user-id']],
                            ['platcrowns', 'points'],
                            [userdata.platcrowns + 1, userdata.points + 2500*5],
                            'userdata'
                ) // Crown with a platinum crown
                .then(res => {
                    this.client.say(target, `/me @${context.username}, You have been crowned with the PLATINIUM CROWN.`)
                    console.log(res)
                })
                .catch(err => {
                    console.log(err)
                })

            }
        })
        .catch(err => {
            console.log(err)
        })
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
                this.client.say(target, `/me > ${user.username}, has ${res.goldcrowns} Golden Crowns, and ${res.platcrowns} PLATINUM CROWNS.`)
            })
        })
        .catch(err => {
            console.log(err)
        })
    },
    getPoints(target, context, message) {
        db.get('userdata', `userid = ${context["user-id"]}`)
        .then(data => {
            data = data[0]
            this.client.say(target, `/me > ${context.username} has ${data.points} ${this.points.namePlural}.`)
        })
        .catch(err => {
            console.log(err)
        })
    },
    addTextCommand(target, context, msg) {
        if (context.badges.broadcaster) {
            context.mod = true
        }
        if (!context.mod) return;

        let ext = this.extract(msg.toString())
        reply = ext.args.slice(1).join(" ").replace('"', '\"').replace("'", "\'")

        db.get('tcommands', `command = '${ext.command}'`)
        .then(res => {
            if (res.length) {
                db.update(['command', ext.command],
                ['reply'], 
                [ reply ],
                'tcommands')
                .then(res => {
                    this.client.say(target, `Successfully added ${ext.command}.`)
                    console.log(res)
                })
                .catch(err => {
                    console.log(err)
                })
                return;
            };

            db.insert([
                "command",
                "reply"
            ],
            [
                ext.command,
                reply
            ],
            'tcommands')
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
        })
        .catch(err => {
            console.log(err)
        })
    },
    textCommandsHandler(target, context, msg) {
        db.get("tcommands")
        .then(commands => {
            if (!commands.length) return;
            commands.forEach(command => {
                if (this.command(command.command, msg)) {
                    this.client.say(target, command.reply)
                }
            })
        })
        .catch(err => {
            console.log(err)
        })
    }
}