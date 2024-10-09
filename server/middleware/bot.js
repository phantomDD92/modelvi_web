const AccountService = require("../services/account");

const jwt = require("jsonwebtoken");

const checkBot = async (req, res, next) => {
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
    const { id, owner, actor } = jwt.decode(tokens[1]);
    req.bot = {id, owner, actor};
    next();
  } catch (error) {
    console.error(error)
    res.status(401).json();
    return
  }
}

module.exports = checkBot