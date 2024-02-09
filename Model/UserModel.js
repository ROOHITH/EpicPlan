const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema  = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Your Email address is required"],
    unique: true,
    index:true,
  },
  username: {
    type: String,
    required: [true, "your username is required"],
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

userSchema.pre("save",async function(next){
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next();
  }
});
module.exports=mongoose.model("User",userSchema);
