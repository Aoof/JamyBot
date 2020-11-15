import axios from 'axios'

export default class OnlineUsersHandler {
    constructor() {
        this.previousOnlineUsers = []
        this.previousOnlineLogs = []
        this.stopRefresh = document.querySelector(".stop-refresh")
        this.logsOutput = document.querySelector(".logsOutput")
        this.onlineUsers = document.querySelector(".onlineUsers")
        this.inputTerminal = document.querySelector(".inputTerminal")
        this.events()
    }

    events() {
        setInterval(this.getOnlineUsers, 250)
        setInterval(this.getLogs, 250)
        this.inputTerminalHandler()
    }

    inputTerminalHandler() {
        this.inputTerminal.addEventListener("click", e => {
            e.preventDefault()
        
            document.querySelector(".terminal-input").focus()
        })
    }

    getLogs() {
        this.stopRefresh = document.querySelector(".stop-refresh")
        if (this.stopRefresh.checked) return
        function arrayEquals(a, b) {
            return Array.isArray(a) &&
              Array.isArray(b) &&
              a.length === b.length &&
              a.every((val, index) => val === b[index]);
        }
        axios.get('/logs').then(logs => {
            logs = logs.data

            if (arrayEquals(this.previousOnlineLogs, logs)) return
            this.previousOnlineLogs = logs
            let output = document.querySelector(".logsOutput>.tab-content>.output")
            output.innerText = ""
            if (logs.length > 20) logs = logs.slice(logs.length - 20, logs.length)
            logs.forEach(log => {
                let output_line = document.createElement("div")
                output_line.className = "output_line"
                output_line.innerText = log
                output.appendChild(output_line)
                output.scrollTop = output.scrollHeight;
            })
        })
        .catch(err => {
            console.error(err)
        })
    }

    getOnlineUsers() {
        this.stopRefresh = document.querySelector(".stop-refresh")
        if (this.stopRefresh.checked) return
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
            let table = document.querySelector(".user-table")
            table.innerHTML = `
            <div class="row row-header">
                <div class="col-md-2">User ID</div>
                <div class="col-md-6">Name</div>
                <div class="col-md-4">Points</div>
            </div>
            `
            users.forEach(user => {
                let userRow = document.createElement("div")
                let userid = document.createElement("div")
                let name = document.createElement("div")
                let points = document.createElement("div")

                userRow.className = "row"
                userid.className = "col-md-2"
                name.className = "col-md-6"
                points.className = "col-md-4"
    
                userid.innerText = user.userid
                name.innerText = user.displayname
                points.innerText = user.points
                
                userRow.appendChild(userid)
                userRow.appendChild(name)
                userRow.appendChild(points)

                table.appendChild(userRow)
                table.scrollTop = table.scrollHeight;
            })
        })
        .catch(err => {
            console.error(err)
        })
    }
}