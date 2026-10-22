require('dns').setServers(['8.8.8.8', '8.8.4.4']);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// BOOK MODEL
const Book = mongoose.model('Book', new mongoose.Schema({
    name: String,
    detail: String,
    category: String,
    value: Number,
    status: { type: String, default: 'Available' }
}));

// LOGIN
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin123') {
        res.json({ message: 'Login Successful' });
    } else {
        res.status(401).json({ message: 'Invalid Login' });
    }
});

// CREATE
app.post('/books', async (req, res) => {
    res.json(await Book.create(req.body));
});

// READ ALL
app.get('/books', async (req, res) => {
    res.json(await Book.find());
});

// READ ONE
app.get('/books/:id', async (req, res) => {
    res.json(await Book.findById(req.params.id));
});

// UPDATE
app.put('/books/:id', async (req, res) => {
    res.json(await Book.findByIdAndUpdate(
        req.params.id, req.body, { new: true }
    ));
});

// DELETE
app.delete('/books/:id', async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book Deleted' });
});

app.listen(3000, () => console.log('Server running on port 3000'));