const db = require("../db")
const logger = require("./logger.js")
const twitch = require("./twitchapi.js")


function arrayEquals(a, b) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val == b[index]);
}


module.exports = {
    addUserOrUpdate(target, context, msg) {
        if (this.users.length) {
            // Update if exists
            user = this.users[0]
            if (typeof user != "object") return;

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
            
            
            if (!arrayEquals(context_user, db_user)) {
                db.update(['userid', context["user-id"]], names, context_user, 'users')
                .then(res => {
                    logger.log(res)
                })
                .catch(err => {
                    logger.log(err)
                })
            }
            return;
        }
        
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
                logger.log(res)
            }).catch(err => {
                logger.log(err)
            })
        
        
        if (this.userdatas.length) return;

        db.insert( // User Data
            ['userid'], // Keys
            [context["user-id"]], // Values
                'userdata'
            ).then(res => {
                logger.log(res)
            }).catch(err => {
                logger.log(err)
            })
    }
}