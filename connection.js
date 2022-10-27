// ↓Mysql connection
const mysql = require('mysql2');
// Mysql connection using .env variables
const connection = mysql.createConnection({
    host: 'localhost',
    // Replace port # with your port number.
    port: process.env.PORT || 3306,
    // Replace user with your username in env variables file.
    user: process.env.DB_USER,
    // Replace password in env variables file with your password.
    password: process.env.DB_PW,
    // database created in schema.sql
    // Replace name in env variables file with your db name.
    database: process.env.DB_NAME,
});

connection.connect((err) => {
    if (err) throw err;
});

module.exports = connection;