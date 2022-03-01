var mysql = require('mysql');

var connection = mysql.createPool({
    connectionLimit : 5,
    host: '',
    user: '',
    password: '',
    database: ''
});

module.exports = connection;