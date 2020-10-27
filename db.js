const logger = require("./classes/logger.js")
// const mysql = require("mysql")
const {Client} = require("pg")

require("dotenv").config()

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    secure: true,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect()

module.exports = {
    get(table, condition=null, order=null) {
        return new Promise((resolve, reject) => {
            let q = `SELECT * FROM royalbutler.${table}`
            if (condition) q += ` WHERE ${condition}`
            if (order) q += ` ORDER BY ${order}`
            client.query(q,
                (err, result) => {
                    if (err) {
                        reject(err.stack)
                        return;
                    };
                    logger.log(q, true)
                    resolve(result.rows)
                }
            )
        })
    },
    insert(names, values, table) {
        return new Promise((resolve, reject) => {
            names = names.map(name => `"${name}"`)

            _values = []

            values = values.map(e => (e != null) ? e : '')
            values.forEach(value => {
                if (typeof value == "string") {
                    value = `'${value}'`
                }
                _values.push(value)
            })

            _values = `(${_values.join(", ")})`
            names = `(${names.join(", ")})`

            let q = `INSERT INTO royalbutler.${table} ${names} VALUES ${_values}`
            client.query(q,
                function(err, result, fields) {
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
                updated.push(`"${name}" = ${value}`)
            })

            updated = updated.join(", ")

            if (typeof pk[1] == "string") pk[1] = `'${pk[1]}'`

            let q = `UPDATE royalbutler.${table} SET ${updated} WHERE "${pk[0]}" = ${pk[1]}`
            client.query(q,
                function(err, result, fields) {
                    if (err) {
                        reject(err.stack)
                        return;
                    };

                    resolve(`[DB_UPDATE] Successfully updated ${updated} at ${table}.`)
                }
            )
        })
    },
    delete(pk, table) {
        return new Promise((resolve, reject) => {
            let q = `DELETE FROM royalbutler.${table} WHERE "${pk[0]}" = '${pk[1]}'`
            client.query(q,
                function(err, result, fields) {
                    if (err) {
                        reject(err.stack)
                        return;
                    }

                    resolve(`[DB_DELETE] Successfully deleted ${pk[0]} = ${pk[1]} at ${table}.`)
                })
        })
    },
    query(q, resolved) {
        return new Promise((resolve, reject) => {
            client.query(q,
                function(err, result, fields) {
                    if (err) {
                        reject(err.stack)
                        return;
                    }

                    resolve({result: result, fields: fields})
                })
        })
    }
}
