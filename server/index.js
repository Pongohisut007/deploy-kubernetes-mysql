const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// MySQL connection configuration
const mysqlConfig = {
  host: 'localhost', // ใช้ชื่อ Service จาก Kubernetes
  user: 'root',
  password: 'root',
  database: 'world',
};

const app = express();

// Enable CORS for all routes
app.use(cors());

// Create MySQL connection pool
const pool = mysql.createPool(mysqlConfig);

// Test API route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Fetch data from the 'users' table
app.get('/fetch', (req, res) => {
  pool.getConnection((err, con) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      res.status(500).send('Error connecting to database');
      return;
    }

    const sql = 'SELECT * FROM user';
    con.query(sql, (err, result) => {
      if (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Error fetching data');
        con.release();
        return;
      }

      res.send(JSON.stringify(result));
      con.release();
    });
  });
});

// Start the application
app.listen(3001, () => {
  console.log('App is listening on port 3001');
});
