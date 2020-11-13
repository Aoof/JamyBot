const db = require("../db")
const logger = require("./Logger")
const twitch = require("./TwitchAPI.js")
const bcrypt = require("bcryptjs")

module.exports = {
    login(username, password) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM users WHERE "username" = '${username}'`, (err, results, fields) => {
                if (err) {
                    logger.log(err)
                    reject(err)
                    return
                }

                if (results.rows.length) {
                    let user = results.rows[0]
                    if (user.password == null) {
                        reject("User is not an admin")
                        return
                    }

                    if (bcrypt.compareSync(password, user.password)) {
                        resolve({
                            userid: user.userid,
                            username: user.username,
                            displayname: user.displayname,
                            badgesraw: user.badgesraw,
                            moderator: user.moderator,
                            subscriber: user.subscriber
                        })
                    }
                    else reject("Incorrect Username or Password") 
                } else {
                    reject("User not found, contact an admin if you think this is a mistake")
                }
            })
        })
    },
    addUserOrUpdate(target, context, msg) {
        let q = (
                `INSERT INTO users (userid, username, displayname, badgesraw, room_id, moderator, subscriber) ` +
                        `VALUES ('${context["user-id"]}', '${context.username}', '${context["display-name"]}', '${context["badges-raw"]}', '${context["room-id"]}', ${context.mod ? true : false}, ${context.subscriber ? true : false}) ` +
                    `ON CONFLICT ON CONSTRAINT users_pkey ` +
                    `DO UPDATE SET ` +
                        `userid = '${context["user-id"]}', ` +
                        `username = '${context.username}', ` +
                        `displayname = '${context["display-name"]}', ` +
                        `badgesraw = '${context["badges-raw"]}', ` +
                        `room_id = '${context["room-id"]}', ` +
                        `moderator = ${context.mod ? true : false}, ` +
                        `subscriber = ${context.subscriber ? true : false}  ` +
                    `WHERE users.userid = '${context["user-id"]}';`
                )
        db.query(q, (err, results, fields) => {
            if (err) {
                logger.log(err)
                return
            }

            logger.log(`[DB_INSERT_OR_UPDATE] User ${context.username} with '${context["user-id"]}' id at users table`)
        })

        let q2 = `INSERT INTO userdata (userid) `+
            `VALUES ('${context["user-id"]}') `+
            `ON CONFLICT ON CONSTRAINT userdata_userid_key `+
            `DO NOTHING;`
        db.query(q2, (err, results, fields) => {
            if (err) {
                logger.log(err)
                return
            }

            logger.log(`[DB_INSERT_OR_NOTHING] User ${context.username} with '${context["user-id"]}' id at userdata table`)
        })
    }
}