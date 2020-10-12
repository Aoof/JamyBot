const db = require("./db")

module.exports = {
    addUser(target, context, msg) {

        db.get('users', `userid = ${context["user-id"]}`).then(result => {
            if (result.length) return;
            result = result[0]
            db.insert( // User
                ['userid',
                 'username',
                 'badgesraw',
                 'displayname',
                 'room_id',
                 'moderator',
                 'subscriber'], // Keys
                [context["user-id"],
                 context.username,
                 context["badges-raw"],
                 context["display-name"],
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
    update(target, context, msg) {
        db.get('users', `userid = '${context["user-id"]}'`)
        .then(users => {
            if (!users.length) return;

            user = users[0]
            names = ['username',
                     'badgesraw',
                     'displayname',
                     'room_id',
                     'moderator',
                     'subscriber']

            context_user = [context.username,
                            context["badges-raw"],
                            context["display-name"],
                            context["room-id"],
                            context.mod,
                            context.subscriber]
            
            db_user = [user.username,
                       user.badgesraw,
                       user.displayname,
                       user.room_id,
                       user.moderator,
                       user.subscriber]
            
            if (context_user.slice(0, names.length - 2) != db_user.slice(0, names.length - 2) 
                && context_user[names.length-2] != db_user[names.length-2]
                && context_user[names.length-1] != db_user[names.length-1]) {
                db.update(['userid', context["user-id"]], names, context_user, 'users')
                .then(res => {
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
    }
}