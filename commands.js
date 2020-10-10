const db = require('./db')


module.exports = {
    crowning(target, context, msg) {

        db.get('userdata', `userid = ${context["user-id"]}`)
        .then(userdatas => {
            userdata = userdatas[0]
            if (Math.random() >= .90) {
                db.update(['userid', context['user-id']],
                            ['goldcrowns'],
                            [userdata.goldcrowns + 1],
                            'userdata'
                )
                .then(res => {
                    if ((userdata.goldcrowns + 1) % 5 == 0) {
                        db.update(['userid', context['user-id']],
                                    ['platcrowns'],
                                    [userdata.platcrowns + 1],
                                    'userdata'
                        )
                        .then(res => {
                            this.client.say(target, `@${context.username}, You were lucky to be crowned 5 times with the golden crown.. for that you have been crowned with the PLATINIUM CROWN.`)
                            console.log(res)
                        })
                        .catch(err => {
                            console.log(err)
                        })
                    } else {
                        this.client.say(target, `@${context.username}, You have been crowned with the Golden Crown.`)
                    }
                    console.log(res)
                })
                .catch(err => {
                    console.log(err)
                })

            }

            
            if (Math.random() <= .01) {
                db.update(['userid', context['user-id']],
                            ['platcrowns'],
                            [userdata.platcrowns + 1],
                            'userdata'
                )
                .then(res => {
                    this.client.say(target, `@${context.username}, You have been crowned with the PLATINIUM CROWN.`)
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
    }
}