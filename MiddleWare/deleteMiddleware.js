const mongoose = require("mongoose");
const { Task } = require("../Model/TaskModel");

const deleteTasksForBoard = async (boardId) => {
  try {
    // Convert the boardId to ObjectId
    const objectIdBoardId = new mongoose.Types.ObjectId(boardId);

    console.log(objectIdBoardId + "-----obj id");
    // Delete all tasks associated with the board
    const result = await Task.deleteMany({ Board_Id: objectIdBoardId });
    console.log(result);

    // Check if documents still exist
    const remainingTasks = await Task.find({ Board_Id: objectIdBoardId });
    console.log("Remaining tasks:", remainingTasks);
  } catch (error) {
    console.error("Error deleting tasks for board:", error);
    throw error;
  }
};

module.exports = { deleteTasksForBoard };
