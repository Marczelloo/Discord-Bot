const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nigusfigus"
});

// Establish the database connection
con.connect(function (err) {
    if (err) {
        console.error(err);
        process.exit(1); // Exit the process if the connection cannot be established
    }
    console.log("Connected to nigusfigus database!");
});

// Gracefully close the database connection when the process is terminated
process.on('exit', function () {
    con.end();
});

module.exports = con;
