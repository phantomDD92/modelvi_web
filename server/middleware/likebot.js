const AccountService = require("../services/account");

const jwt = require("jsonwebtoken");

const checkLikeBot = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      res.status(401).json();
      return
    }
    tokens = token.split(" ")
    if (tokens.length != 2) {
      res.status(401).json();
      return
    }
    const { id } = jwt.decode(tokens[1]);
    req.bot = { id };
    next();
  } catch (error) {
    console.error(error)
    res.status(401).json();
    return
  }
}

module.exports = checkLikeBot