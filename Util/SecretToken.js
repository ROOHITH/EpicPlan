require("dotenv").config();
const jwt = require("jsonwebtoken");
module.exports.createSecretToken = (id) => {
   const token =jwt.sign({ id }, process.env.TOKEN_KEY || 'default_secret_key', {
    expiresIn: 3 * 24 * 60 * 60,
  });

  return token;
};
