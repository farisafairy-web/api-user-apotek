const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/api/index', (req, res) => {
  db.query('SELECT * FROM user', (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.put('/api/index/:id', (req, res) => {
  const { id } = req.params;
  const { nama, email } = req.body;

  const sql = 'UPDATE user SET nama = ?, email = ? WHERE id = ?';
  db.query(sql, [nama, email, id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.json({ message: 'User berhasil diupdate' });
  });
});

app.delete('/api/index/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM user WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.json({ message: 'User berhasil dihapus' });
  });
});


// READ
app.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, users) => {
    if (err) throw err;
    res.render('index', { users });
  });
});


// FORM CREATE
app.get('/create', (req, res) => {
  res.render('create');
});


// CREATE
app.post('/store', (req, res) => {
  const { name, email } = req.body;

  db.query(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [name, email],
    (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.send('Email sudah terdaftar!');
        }
        throw err;
      }
      res.redirect('/');
    }
  );
});



// FORM EDIT
app.get('/edit/:id', (req, res) => {
  db.query(
    'SELECT * FROM users WHERE id = ?',
    [req.params.id],
    (err, result) => {
      res.render('edit', { user: result[0] });
    }
  );
});


// UPDATE
app.post('/update/:id', (req, res) => {
  const { name, email } = req.body;
  db.query(
    'UPDATE users SET name = ?, email = ? WHERE id = ?',
    [name, email, req.params.id],
    () => res.redirect('/')
  );
});


// DELETE
app.get('/delete/:id', (req, res) => {
  db.query(
    'DELETE FROM users WHERE id = ?',
    [req.params.id],
    () => res.redirect('/')
  );
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
