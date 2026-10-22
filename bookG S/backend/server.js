const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// DATABASE CONNECTION
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database:'webdb',
    port: 3307
});

db.connect(err => {
    if (err) console.log(err.message);
    else console.log('MySQL Connected');
});

// LOGIN
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin123')
        res.json({ message: 'Login Successful' });
    else
        res.status(401).json({ message: 'Invalid Login' });
});

// CREATE
app.post('/items', (req, res) => {
    const { name, detail, category, value, status } = req.body;

    const sql = `INSERT INTO application
        (name, detail, category, value, status)
        VALUES (?, ?, ?, ?, ?)`;

    db.query(sql,
        [name, detail, category, value, status || 'Available'],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Added Successfully', id: result.insertId });
        }
    );
});

// READ ALL
app.get('/items', (req, res) => {
    db.query('SELECT * FROM application', (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// READ ONE
app.get('/items/:id', (req, res) => {
    db.query('SELECT * FROM application WHERE id = ?',
        [req.params.id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.length === 0)
                return res.status(404).json({ message: 'Not Found' });
            res.json(result[0]);
        }
    );
});

// UPDATE
app.put('/items/:id', (req, res) => {
    const { name, detail, category, value, status } = req.body;

    const sql = `UPDATE application
        SET name = ?, detail = ?, category = ?, value = ?, status = ?
        WHERE id = ?`;

    db.query(sql,
        [name, detail, category, value, status, req.params.id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Updated Successfully' });
        }
    );
});

// DELETE
app.delete('/items/:id', (req, res) => {
    db.query('DELETE FROM application WHERE id = ?',
        [req.params.id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Deleted Successfully' });
        }
    );
});

app.listen(3000, () => console.log('Server running on port 3000'));