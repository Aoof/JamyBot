const db = require("../db.js")

db.get('userdata').then(results => {
    results.forEach(res => {
        db.update(['userid', res.userid], ['points'], [res.points + 2000], 'userdata')
    })
})