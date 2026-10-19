const express = require('express');
const axios = require('axios');
const public_users = express.Router();
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;

const API_URL = 'http://localhost:5000';

// Register a new user
public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required'
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: 'Username already exists'
    });
  }

  users.push({ username, password });

  return res.status(200).json({
    message: 'User successfully registered'
  });
});

// Get all books
public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});

// Get book details by ISBN using Axios and async/await
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/`);
    const book = response.data[req.params.isbn];

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve book' });
  }
});

// Get books by author using Axios and promises
public_users.get('/author/:author', (req, res) => {
  axios.get(`${API_URL}/`)
    .then(response => {
      const author = req.params.author.toLowerCase();
      const result = Object.values(response.data).filter(
        book => book.author.toLowerCase() === author
      );

      return res.status(200).json(result);
    })
    .catch(() => {
      return res.status(500).json({ message: 'Unable to retrieve books' });
    });
});

// Get books by title using Axios and async/await
public_users.get('/title/:title', async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/`);
    const title = req.params.title.toLowerCase();
    const result = Object.values(response.data).filter(
      book => book.title.toLowerCase() === title
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve books' });
  }
});

// Get book reviews
public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;