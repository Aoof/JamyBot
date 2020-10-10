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
    get(table, where=null) {
        return new Promise((resolve, reject) => {
            con.query(where ? "SELECT * FROM " + table + " WHERE " + where : "SELECT * FROM " + table,
                function(err, result, fields) {
                    if (err) {
                        reject(err)
                        return;
                    };
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

                    resolve("Successfully inserted data to "+table+".")
                }
            )
        })
    },
    update(pk, _names, _values, table) {
        return new Promise((resolve, reject) => {
            names = _names.join(", ")
            values = JSON.stringify(_values)
            values = values.substr(1, values.length - 2)

            names = `(${names})`
            values = `(${values})`

            let updated = "" 
            
            names.forEach(res => {
                updated += `${res} = ${values[names.indexOf(res)]}, `
            })

            if (updated.endsWith(",")) {
                updated = updated.substr(0, updated.length - 1)
            }

            con.query(
                ``` 
                    UPDATE ${table}
                    SET ${updated}
                    WHERE ${pk[0]} = ${pk[1]}
                ```, 
                function(err, result, fields) {
                    if (err) {
                        reject(err)
                        return;
                    };
                    
                    resolve({id: pk[1], message: "Successfully updated "})
                }
            )
        })
    }
}
