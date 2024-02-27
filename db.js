const mysql = require('mysql');
const { db_name, db_host, db_user, db_pass, db_port } = require("./config.json");

const con = mysql.createConnection({
    host: db_host,
    user: db_user,
    password: db_pass,
    database: db_name
});

con.connect(function (err) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log("Connected to nigusfigus database!");
});

process.on('exit', function () {
    con.end();
});

module.exports = con;
