const User = require("../Model/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    // No token provided, return response indicating authentication failure
    return res.json({ status: false });
  }

  try {
    const data = jwt.verify(
      token,
      process.env.TOKEN_KEY || "default_secret_key"
    );

    const user = await User.findById(data.id);

    if (user) {
      
      
     
      req.user = user;
      // res.json({ status: true });
      return next();
    } else {
      return res.json({ status: false });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, error: "Internal Server Error" });
  }
};
