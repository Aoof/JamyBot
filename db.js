const mysql = require("mysql")
require("dotenv").config()

const con = mysql.createConnection({
    host         : process.env.HOST,
    user         : process.env.USER,
    password     : process.env.PASSWORD,
    insecureAuth : true,
    database     : process.env.DATABASE
})

module.exports = {
    get(table, condition=null) {
        return new Promise((resolve, reject) => {
            con.query(condition ? `SELECT * FROM ${table} WHERE ${condition}` : "SELECT * FROM " + table,
                function(err, result, fields) {
                    if (err) {
                        reject(err)
                        return;
                    };
                    console.log(condition ? `GET data from ${table} where ${condition}.` : `GET data from ${table}.`)
                    resolve(result)
                }
            )
        })
    },
    insert(_names, _values, table) {
        return new Promise((resolve, reject) => {
            names = _names.join(", ")
            values = JSON.stringify(_values)
            values = values.substr(1, values.length - 2)

            names = `(${names})`
            values = `(${values})`
            
    
            con.query(`INSERT IGNORE INTO ${table} ${names} VALUES ${values}`,
                function(err, result, fields) {
                    if (err) {
                        reject(err)
                        return;
                    };

                    resolve(`Successfully inserted data to ${table} table.`)
                }
            )
        })
    },
    update(pk, names, values, table) {
        return new Promise((resolve, reject) => {
            updated = []

            names.forEach(name => {
                let value = values[names.indexOf(name)]
                if (typeof value == "string") {
                    value = `"${value}"`
                }
                updated.push(`${name} = ${value}`)
            })

            updated = updated.join(", ")

            con.query(`UPDATE ${table} SET ${updated} WHERE ${pk[0]} = '${pk[1]}'`, 
                function(err, result, fields) {
                    if (err) {
                        reject(err)
                        return;
                    };

                    resolve(`Successfully updated ${updated} at ${table}.`)
                }
            )
        })
    }
}
