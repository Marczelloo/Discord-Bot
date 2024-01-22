const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nigusfigus"
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
