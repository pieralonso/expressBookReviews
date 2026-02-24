const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios').defaults;
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
      return user.username === username
    })

    if (userswithsamename.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(400).json({ message: "User already exists!" });
    }
  }
  return res.status(400).json({ message: "username and password are required" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  // Get the book list available in the shop
  try {
    const bookList = await Promise.resolve(books);
    return res.send(JSON.stringify(bookList, null, 4));
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const { isbn } = req.params;
  const getBookByISBN = new Promise((resolve, reject) => {
    const book = Object.values(books).find((book) => book.isbn === isbn);
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  });

  getBookByISBN
    .then(book => {
      return res.status(200).send(JSON.stringify(book, null, 4));
    })
    .catch(err => {
      return res.status(404).json({ message: err });
    });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const { author } = req.params;


  const getBookByAuthor = new Promise((resolve, reject) => {
    const book = Object.values(books).filter((book) => {
      const parts = book.author.toLowerCase().split(' ')
      return parts.includes(author.toLowerCase()) || book.author.toLowerCase() === author.toLowerCase
    })

    if (book) {
      resolve(book)
    } else {
      reject("Book not found")
    }
  })

  getBookByAuthor
    .then(book => {
      return res.status(200).send(JSON.stringify(book, null, 4))
    })
    .catch(err => {
      return res.status(404).json({ message: err })
    })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const { title } = req.params;

  const getBookByTitle = new Promise((resolve, reject) => {
    const matchedBooks = Object.values(books).filter((book) => {
      const parts = book.title.toLowerCase().split(' ');
      return parts.includes(title.toLowerCase()) || book.title.toLowerCase() === title.toLowerCase()
    })

    if (matchedBooks) {
      resolve(matchedBooks)
    } else {
      reject("No matched book found")
    }
  })

  getBookByTitle
    .then(book => {
      return res.status(200).send(JSON.stringify(book, null, 4))
    })
    .catch(err => {
      return res.status(404).json({ message: err })
    })
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const { isbn } = req.params
  const matchedBook = Object.values(books).find((book) => book.isbn === isbn)
  const reviews = matchedBook.reviews
  res.status(200).send(JSON.stringify(reviews, null, 4))
});

module.exports.general = public_users;
