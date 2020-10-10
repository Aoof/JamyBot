const db = require('./db')

async function User(id) {
    this.createQuery = ```
                    userid VARCHAR(100) NOT NULL,
                    username VARCHAR(45) NOT NULL,
                    goldcrowns INTEGER,
                    platcrowns INTEGER,
                    PRIMARY KEY (userid)
                ```
    let user = db.getUserOrCreate(id)

}

module.exports = User;
