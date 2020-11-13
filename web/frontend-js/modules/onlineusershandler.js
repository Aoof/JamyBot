import axios from 'axios'

export default class OnlineUsersHandler {
    constructor() {
        this.previousOnlineUsers = []
        this.events()
    }

    events() {
        setInterval(this.getOnlineUsers, 500)
    }

    getOnlineUsers() {
        function arrayEquals(a, b) {
            return Array.isArray(a) &&
              Array.isArray(b) &&
              a.length === b.length &&
              a.every((val, index) => val === b[index]);
        }
        axios.get("/online-users").then(users => {
            users = users.data
            if (arrayEquals(this.previousOnlineUsers, users)) return
            this.previousOnlineUsers = users
            let table = document.querySelector(".user-table>tbody")
            table.innerHTML = ""
            users.forEach(user => {
                let userRow = document.createElement("tr")
                let userid = document.createElement("td")
                let name = document.createElement("td")
                let points = document.createElement("td")
    
                userid.innerText = user.userid
                name.innerText = user.displayname
                points.innerText = user.points
                
                userRow.appendChild(userid)
                userRow.appendChild(name)
                userRow.appendChild(points)

                table.appendChild(userRow)
            })
        })
        .catch(err => {
            console.error(err)
        })
    }
}