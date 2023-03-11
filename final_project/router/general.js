const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");
const { response } = require("express");
const Exists = (username) => {
  return isValid(username);
};

public_users.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password)
    return res
      .status(404)
      .json({ message: "The Password or Username are not provided" });

  if (Exists(username))
    return res.status(404).json({ message: "This username already exists" });

  users.push({ username: username, password: password });
  return res.status(200).json({ message: "User successfully registered" });
});

// Get the book list available in the shop Async
public_users.get("/async", async (req, res) => {
  let response = await axios.get("http://localhost:5000/");
  return res.send(response.data);
});
// Get the book list available in the shop
public_users.get("/", function (req, res) {
  // JSON.stringify(books, null, 4)
  return res.json(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN Async 
public_users.get("/async/isbn/:isbn", (req, res) => {
  axios
    .get("http://localhost:5000/isbn/" + req.params.isbn)
    .then((response) => {
      return res.status(200).json(response.data);
    })
    .catch((err) => {
      return res.send(err);
    });
});
// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  return res.send(JSON.stringify(books[req.params.isbn]));
});


public_users.get("/async/author/:author", async (req, res) => {
  let response = await axios.get("http://localhost:5000/author/"+req.params.author);
  return res.status(200).json(response.data);
});
// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let book = Object.entries(books).filter(([isbn, book]) => {
    return book.author === req.params.author;
  });
  return res.send(book);
});

public_users.get("/async/title/:title", async (req, res) => {
  let response = await axios.get("http://localhost:5000/title/"+req.params.title);
  return res.status(200).json(response.data)
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let book = Object.entries(books).filter(([isbn, book]) => {
    return book.title === req.params.title;
  });
  return res.send(book);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let book = books[req.params.isbn];
  res.send(book.reviews);
});

module.exports.general = public_users;
