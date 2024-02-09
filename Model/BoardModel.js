// boardModel.js
const mongoose = require("mongoose");
const { deleteTasksForBoard } = require("../MiddleWare/deleteMiddleware");

const boardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Array of user IDs who have access to the board
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  boardName: {
    type: String,
    required: true,
  },
  // Add any other fields you need for a board
  createdAt: {
    type: Date,
    default: new Date(),
  },
});
// Register the middleware to delete tasks before removing a board
// boardModel.js
boardSchema.pre("remove", async function (next) {
  console.log("Board pre-remove middleware");
  await deleteTasksForBoard(this._id);
  next();
});


module.exports = mongoose.model("Board", boardSchema);
