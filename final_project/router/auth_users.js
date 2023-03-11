const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //checks is the username is valid

  let user = users.filter((user) => {
    return user.username === username;
  });

  return user.length > 0 ? true : false;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //checks if username and password match the one we have in records.

  let user = users.filter((user) => {
    return (user.username === username && user.password === password);
  });

  return user.length > 0 ? true : false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if(!username || !password) return res.status(404).json({message: "Error logging in."})
  if (!authenticatedUser(username, password))
    return res
      .status(208)
      .json({ message: "Invalid login. Check your login info." });

  let accessToken = jwt.sign(
    {
      data: password,
    },
    'access',
    { expiresIn: 60 * 60 }
  );

  req.session.authorization = {
    accessToken, username
  }

  return res.status(200).json({ message: "User logged in successfully."});

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let review = req.query.review;
  let username = req.session.authorization["username"];
  let isbn = req.params.isbn;
  
  books[isbn]["reviews"][username] = {"review": review};
  
  return res.status(200).json({message: "Review Added successfully."});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let username = req.session.authorization["username"];
  let isbn = req.params.isbn;

  delete books[isbn]["reviews"][username];
  return res.status(200).json({message: "Review deleted successfully."});
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
