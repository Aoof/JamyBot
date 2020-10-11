const db = require('./db')


module.exports = {
    command(cmd, msg) {
        if (typeof cmd == String) {
            return msg.startsWith(this.prefix + cmd)
        } else {
            let tr = 0
            let fl = 0
            
            cmd.forEach(command => {
                if (msg.startsWith(this.prefix + command)) {
                    tr++;
                } else {
                    fl++;
                }
            })

            return tr > 0
        }
    },
    crowning(target, context, msg) {

        db.get('userdata', `userid = ${context["user-id"]}`)
        .then(userdatas => {
            userdata = userdatas[0]
            if (Math.random() >= .90) {
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

            
            if (Math.random() <= .01) {
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
    addUser(target, context, msg) {

        db.get('users', `userid = ${context["user-id"]}`).then(result => {
            if (result.length) return;
            result = result[0]
            db.insert( // User
                ['userid',
                 'username',
                 'badgesraw',
                 'room_id',
                 'moderator',
                 'subscriber'], // Keys
                [context["user-id"],
                 context.username,
                 context["badges-raw"],
                 context["room-id"],
                 context.mod,
                 context.subscriber], // Values
                 'users'
                ).then(res => {
                    console.log(res)
                }).catch(err => {
                    console.log(err)
                })
        }).catch(err => {
            console.log(err)
        })
        

        db.get('userdata', `userid = ${context["user-id"]}`).then(result => {
            if (result.length) return;
            result = result[0]

            db.insert( // User Data
                ['userid'], // Keys
                [context["user-id"]], // Values
                 'userdata'
                ).then(res => {
                    console.log(res)
                }).catch(err => {
                    console.log(err)
                })
        }).catch(err => {
            console.log(err)
        })
    },
    getCrowns(target, context, msg) {
        db.get('userdata', `userid = ${context["user-id"]}`)
        .then(data => {
            data = data[0]
            this.client.say(target, `/me @${context.username} has ${data.goldcrowns} Golden Crowns, and ${data.platcrowns} Platinium Crowns.`)
        })
        .catch(err => {
            console.log(err)
        })
    },
    getPoints(target, context, message) {
        db.get('userdata', `userid = ${context["user-id"]}`)
        .then(data => {
            data = data[0]
            this.client.say(target, `/me @${context.username} has ${data.points} ${this.points.namePlural}.`)
        })
        .catch(err => {
            console.log(err)
        })
    },
    addTextCommand(target, context, msg) {
        if (!context.mod) return;

        let command = msg.substr(1)
        let args = command.split(" ").slice(1)
        command = command[1]
        reply = args.slice(1).join(" ")

        db.get('tcommands', `command = ${command}`)
        .then(res => {
            if (res) {
                db.update(['command', command],
                ['reply'], 
                [ reply ],
                'tcommands')
                .then(res => {
                    this.client.say(target, `Successfully added ${command}.`)
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
                command,
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