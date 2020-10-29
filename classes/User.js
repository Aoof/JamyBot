const db = require("../db")
const logger = require("./Logger.js")
const twitch = require("./TwitchAPI.js")

module.exports = {
    addUserOrUpdate(target, context, msg) {
        let q = (
                `INSERT INTO users (userid, username, displayname, badgesraw, room_id, moderator, subscriber)
                        VALUES ('${context["user-id"]}', '${context.username}', '${context["display-name"]}', '${context["badges-raw"]}', '${context["room-id"]}', ${context.mod ? true : false}, ${context.subscriber ? true : false})
                    ON CONFLICT ON CONSTRAINT users_pkey
                    DO UPDATE SET
                        userid = '${context["user-id"]}',
                        username = '${context.username}',
                        displayname = '${context["display-name"]}',
                        badgesraw = '${context["badges-raw"]}',
                        room_id = '${context["room-id"]}',
                        moderator = ${context.mod ? true : false},
                        subscriber = ${context.subscriber ? true : false} 
                    WHERE users.userid = '${context["user-id"]}';`
                )
        db.query(q, (err, results, fields) => {
            if (err) {
                logger.log(err)
                return
            }

            logger.log(`[DB_INSERT_OR_UPDATE] User ${context.username} with '${context["user-id"]}' id at users table`)
        })

        let q2 = (
            `INSERT INTO userdata (userid)
            VALUES ('${context["user-id"]}')
            ON CONFLICT ON CONSTRAINT userdata_userid_key
            DO NOTHING;`
            )
        db.query(q2, (err, results, fields) => {
            if (err) {
                logger.log(err)
                return
            }

            logger.log(`[DB_INSERT_OR_NOTHING] User ${context.username} with '${context["user-id"]}' at userdata table`)
        })
    }
}