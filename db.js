const mysql = require('mysql');
const { db_name, db_host, db_user, db_pass, db_port } = require("./config.json");

const con = mysql.createConnection({
    host: db_host,
    user: db_user,
    password: db_pass,
    database: db_name
});

const connect = () => {
    con.connect(function (err) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Connected to ${db_name} database!`);
    });
}


const disconnect = () => {
    con.end();
}

// con.connect(function (err) {
//     if (err) {
//         console.error(err);
//         process.exit(1);
//     }
//     console.log(`Connected to ${db_name} database!`);
// });

// process.on('exit', function () {
//     con.end();
// });

module.exports = { 
    con,
    connect, 
    disconnect
}
