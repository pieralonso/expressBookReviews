const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require('express-session')
const regd_users = express.Router();


regd_users.use(session({ secret: "SECRET", resave: true, saveUninitialized: true }))

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {

  function authenticatedUser(username, password) {
    let validUsers = users.filter((user) => {
      return (user.username === username && user.password === password);
    })
    if (validUsers.length > 0) {
      return true
    } else {
      return false
    }
  }

  const { username, password } = req.body

  if (!username || !password) {
    return res.status(404).json({ message: "You must provide username or password" })
  }

  if (authenticatedUser(username, password)) {
    let accesToken = jwt.sign({
      data: password
    }, 'acces', { expiresIn: 60 * 60 }
    )
    req.session.authorization = {
      accesToken, username
    }
    return res.status(200).send("user sucessfully logged in")
  } else {
    return res.status(208).json({ message: "invalid login: check credentials" })
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params
  const { review } = req.query
  const user = req.session.authorization.username

  // return res.status(200).json({ username: user, isbn: isbn, review: review })

  Object.values(books).map(book => {
    if (book.isbn === isbn) {
      book.reviews[user] = review
      return res.status(200).json({ message: `${user} your review for  ${book} has been added` });
    }
  })

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params
  const user = req.session.authorization.username

  Object.values(books).filter(book => {
    if (book.isbn === isbn) {
      delete book.reviews[user]
      res.status(200).json({ message: `${user} review was deleted from ${book.title}` })
    }
  })

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
