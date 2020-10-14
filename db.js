const logger = require("./classes/logger.js")
// const mysql = require("mysql")
const {Client} = require("pg")

require("dotenv").config()

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect()

module.exports = {
    get(table, condition=null) {
        return new Promise((resolve, reject) => {
            let q = condition ? `SELECT * FROM royalbutler.${table} WHERE ${condition}` : "SELECT * FROM " + table
            client.query(q,
                (err, result) => {
                  logger.log(result)
                    if (err) {
                        reject(err.stack)
                        return;
                    };
                    logger.log(condition ? `GET data from royalbutler.${table} where ${condition}.` : `GET data from ${table}.`, true)
                    resolve(result.rows)
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

            let q = `INSERT INTO royalbutler.${table} ${names} VALUES ${values}`
            client.query(q,
                function(err, result, fields) {
                  logger.log(result)
                    if (err) {
                        reject(err.stack)
                        return;
                    };

                    resolve(`[DB_INSERT] Successfully inserted data to royalbutler.${table} table.`)
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
                    value = `'${value}'`
                }
                updated.push(`${name} = ${value}`)
            })

            updated = updated.join(", ")

            let q = `UPDATE ${table} SET ${updated} WHERE ${pk[0]} = '${pk[1]}'`
            client.query(q,
                function(err, result, fields) {
                  logger.log(result)
                    if (err) {
                        reject(err.stack)
                        return;
                    };

                    resolve(`[DB_UPDATE] Successfully updated ${updated} at ${table}.`)
                }
            )
        })
    }
}
