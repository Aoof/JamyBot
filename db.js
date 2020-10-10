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
            con.connect(function(err) {
                if (err) {
                    reject(err)
                    return;
                };

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
        })
    },
    insert(names, values, table) {
        return new Promise((resolve, reject) => {
            if (names.length != values.length) throw reject("Names does not match the values.");
            names = JSON.stringify(names)
            values = JSON.stringify(values)
    
            con.connect(function(err) {
                if (err) {
                    reject(err)
                    return;
                };
    
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
        })
    },
    getOrCreate(names, query) {
        return new Promise((resolve, reject) => {
            con.connect((err) => {
                if (err) {
                    reject(err)
                    return;
                };

                con.query(
                    ```
                    INSERT INTO users ${JSON.stringify(names)}
                    SELECT ${JSON.stringify(names)} FROM 
                    
                    ```)
            })
        })
    },
    update(pk, names, values, table) {
        return new Promise((resolve, reject) => {
            if (names.length != values.length) throw reject("Names does not match the values.");
            names = JSON.stringify(names)
            values = JSON.stringify(values)
    
            con.connect((err) => {
                if (err) {
                    reject(err)
                    return;
                };
                
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
                        WHERE id = ${pk}
                    ```, 
                    function(err, result, fields) {
                        if (err) {
                            reject(err)
                            return;
                        };
                        
                        resolve({id: pk, message: "Successfully updated "})
                    }
                )
            })
        })
    }
}
