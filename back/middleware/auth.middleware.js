const session = require("express-session");
const crypto = require("crypto");

const authInit = () =>
  session({
    secret: crypto.randomBytes(32).toString("hex"),
    resave: false,
    saveUninitialized: true,
  });

const checkAuth = (req, res, next) => {
  if (!req.session.auth){
  return res.status(400);
  }
  next();
};
module.exports = { authInit, checkAuth };
