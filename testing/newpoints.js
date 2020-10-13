const db = require("../db")
const fs = require("fs")

let pts = JSON.parse(fs.readFileSync("./newpoints.json"))

pts.forEach(data => {
    let usr = data["username"]
    let pt = data["points"]

    db.get('users', `username = '${usr}'`).then(res => {
        res = res[0]
        db.get('userdata', `userid = '${res.userid}'`).then(rs => {
            rs = rs[0]
            if (rs.points > 0) return;
            db.update(["userid", res.userid], ['points'], [rs.points + pt], 'userdata')
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
    })
    .catch(err => {
        console.log(err)
    })
})