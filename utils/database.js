const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mysqlroot",
  database: "wedding",
});

module.exports = connection;
