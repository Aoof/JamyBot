const db = require('./db')

async function User(id) {
    this.createQuery = ```
                CREATE TABLE users (
                    userid VARCHAR(50),
                    username VARCHAR(50) NOT NULL,
                    badgesraw VARCHAR(50),
                    user_id VARCHAR(50),
                    room_id VARCHAR(50),
                    moderator BOOL,
                    subscriber BOOL,
                )
                ```

}

module.exports = User;
