const mongoose = require("mongoose");
const { deleteTasksForBoard } = require("../MiddleWare/deleteMiddleware");
const subTaskSchema = new mongoose.Schema({
  subTaskName: {
    type: String,
    required: true,
  },
  subTaskStatus: {
    type: String,
    required: true,
  },
});
const taskSchema = new mongoose.Schema({
    Board_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: true,
  }, 
  taskName: {
    type: String, 
   
  },
  description: {
    type: String,
   
  },
  subTask: [subTaskSchema],
  taskStatus: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});
// Register the middleware to delete tasks before removing a board
taskSchema.pre("remove", async function (next) {
  
  await deleteTasksForBoard(this.Board_Id);  // Corrected to "this.Board_Id"
  next();
});

// Export the Mongoose models
module.exports = {
  Subtasks: mongoose.model("Subtasks", subTaskSchema),
  Task: mongoose.model("Task", taskSchema),
};

