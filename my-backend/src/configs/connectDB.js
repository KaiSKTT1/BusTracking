import mysql from 'mysql2/promise';

// // create the connection to database

console.log("Creating connection pool...");

const pool = mysql.createPool({
    host: 'localhost',
    user: 'hbstudent',
    database: 'buscontrol',
    password: 'hbstudent'
    // host: 'localhost',
    // user: 'root',
    // database: 'bus_tracking',
    // password: ''
})


export default pool;