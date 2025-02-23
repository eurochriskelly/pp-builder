const mysql = require('mysql');

const MYSQL_CONFIG = {
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'AsQ3Dx!AsQ3Dx', // Replace with your MySQL password
    database: 'EuroTourno'
};

const connection = mysql.createConnection(MYSQL_CONFIG);

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id', connection.threadId);
});

function executeQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (error, results) => {
            if (error) reject(error);
            else resolve(results);
        });
    });
}

module.exports = { executeQuery };
