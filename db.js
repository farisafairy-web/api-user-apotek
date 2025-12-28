const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dbkelompok5'
});

db.connect(err => {
  if (err) throw err;
  console.log('Database connected');
});

module.exports = db;
