module.exports = {
    User: {
        username(name) {
            let errors = []

            if (name.trim() == "")             errors.push("Please provide a username")
            if (name.split(" ").length != 1)   errors.push("Incorrect Username or Password")

            return errors
        },
        password(text) {
            let errors = []

            if (text.trim() == "")             errors.push("Please provide a password")
            
            return errors
        }
    }
}