import mysql from 'mysql2/promise';

// // create the connection to database

console.log("Creating connection pool...");

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'bus_tracking',
    //password: 'password'
    // host: 'localhost',
    // user: 'hbstudent',
    // database: 'bus_tracking',
    // password: 'hbstudent'
})


export default pool;