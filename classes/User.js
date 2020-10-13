const db = require("../db")
const logger = require("./logger.js")


function arrayEquals(a, b) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
  }
module.exports = {
    addUserOrUpdate(target, context, msg) {
        db.get('users', `userid = ${context["user-id"]}`).then(users => {
            if (users.length) {
                // Update if exists
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
                                context.mod ? 1 : 0,
                                context.subscriber ? 1 : 0]
                
                db_user = [user.username,
                          user.badgesraw,
                          user.displayname,
                          user.room_id,
                          user.moderator ? 1 : 0,
                          user.subscriber ? 1 : 0]
                
                
                if (arrayEquals(context_user, db_user)) {
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


        }).catch(err => {
            logger.log(err)
        })
        

        db.get('userdata', `userid = ${context["user-id"]}`).then(result => {
            if (result.length) return;
            result = result[0]

            db.insert( // User Data
                ['userid'], // Keys
                [context["user-id"]], // Values
                 'userdata'
                ).then(res => {
                    logger.log(res)
                }).catch(err => {
                    logger.log(err)
                })
        }).catch(err => {
            logger.log(err)
        })
    }
}