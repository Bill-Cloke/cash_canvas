import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const db = pool.promise();
db.getConnection()
  .then(conn => {
    console.log('Connected to MySQL server');
    conn.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });

// db.connect(err => {
//   if (err) {
//     console.error("Database connection failed:", err);
//   } else {
//     console.log("Connected to MySQL server");
//   }
// });

export default db;