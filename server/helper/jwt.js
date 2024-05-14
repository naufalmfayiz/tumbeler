const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const createToken = (payload) => {
  let token = jwt.sign(payload, secret);
  return token;
};

const verifyToken = (token) => {
  let verify = jwt.verify(token, secret);
  return verify;
};

module.exports = { createToken, verifyToken };
