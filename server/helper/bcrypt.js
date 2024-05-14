const bcrypt = require("bcryptjs");

const hashedPassword = (password) => {
  const hash = bcrypt.hashSync(password);
  return hash;
};

const checkPassword = (password, passwordDB) => {
  const check = bcrypt.compareSync(password, passwordDB);
  return check;
};

module.exports = { hashedPassword, checkPassword };
