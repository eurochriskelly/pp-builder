const mysql = require('mysql');

// TODO: Use API
const MYSQL_CONFIG = {
    host: process.env('GCP_DB_HOST'),
    user: process.env('GCP_DB_USER'),
    password: process.env('GCP_DB_PWD'),
    database: process.env('GCP_DB_NAME'),
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
