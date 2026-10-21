require('dns').setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(3000, () => console.log('Server running on port 3000'));
  })
  .catch(err => console.log('MongoDB Error:', err.message));

// Schema
const Book = mongoose.model('Book', new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, match: /^\d{13}$/ },
  copies: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
    validate: Number.isInteger
  },
  status: {
    type: String,
    enum: ['Available', 'Issued'],
    default: 'Available'
  }
}));

// Login
app.post('/login', (req, res) => {
  if (req.body.username === 'admin' && req.body.password === 'admin123')
    return res.json({ message: 'Login successful' });

  res.status(401).json({ message: 'Invalid login' });
});

// READ ALL
app.get('/books', async (req, res) => {
  try {
    res.json(await Book.find());
  } catch (err) {
    res.status(500).json({ message: 'Error reading books' });
  }
});

// READ ONE
app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: 'Invalid book ID' });
  }
});

// ADD
app.post('/books', async (req, res) => {
  try {
    res.json(await Book.create(req.body));
  } catch (err) {
    res.status(400).json({ message: 'Invalid book details' });
  }
});

// UPDATE
app.put('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: 'Update failed' });
  }
});

// DELETE
app.delete('/books/:id', async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Delete failed' });
  }
});