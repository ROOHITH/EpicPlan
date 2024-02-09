// boardController.js
const Board = require("../Model/BoardModel");
const { deleteTasksForBoard } = require("../MiddleWare/deleteMiddleware");
const User = require("../Model/UserModel");

// Controller function to get shared boards
module.exports.getSharedBoards = async (req, res) => {
  try {
    const { user } = req;
    const userId = user._id;

    // Use the user ID to query shared boards
    const sharedBoards = await Board.find({ users: userId });

    res.status(200).json(sharedBoards);
  } catch (error) {
    console.error("Error fetching shared boards:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Get users assigned to a board
module.exports.getUsersInBoard = async (req, res) => {
  const { boardId } = req.params;

  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    const usersInBoard = await User.find(
      { _id: { $in: board.users } },
      "username"
    );
    res.json(usersInBoard);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update users assigned to a board
module.exports.updateUsersInBoard = async (req, res) => {
  const { boardId } = req.params;
  const { users } = req.body;

  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    // Update the board's users
    board.users = users;
    await board.save();

    res.json({ message: "Users in board updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.createBoard = async (req, res) => {
  const { userId, boardNames } = req.body;
  const { user } = req;
  try {
    const newBoard = await Board.create({
      userId: user._id, // Use the user ID obtained from req.user
      boardName: boardNames,
    });

    res.status(201).json(newBoard);
  } catch (error) {
    console.error("Error creating board:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getUserBoards = async (req, res) => {
  const { user } = req;

  try {
    const userBoards = await Board.find({ userId: user._id });
    res.status(200).json(userBoards);
  } catch (error) {
    console.error("Error fetching user boards:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.renameUserBoard = async (req, res) => {
  const { user } = req;
  const { boardId, newBoardName } = req.body;
  try {
    const updatedBoard = await Board.findByIdAndUpdate(
      boardId,
      { boardName: newBoardName },
      { new: true } // This option returns the updated document
    );

    if (!updatedBoard) {
      return res.status(404).json({ error: "Board not found" });
    }

    res.status(200).json({ updatedBoard });
  } catch (error) {
    console.error("Error updating board name:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.deleteBoard = async (req, res) => {
  const { boardId } = req.params;

  try {
    // Use the Board model to find and delete the board by ID
    const deletedBoard = await Board.findByIdAndDelete(boardId);

    if (deletedBoard) {
      // Call middleware to delete associated tasks

      await deleteTasksForBoard(deletedBoard._id);

      console.log("rspn  " + deletedBoard);
      res
        .status(200)
        .json({ success: true, message: "Board deleted successfully." });
    } else {
      res.status(404).json({ success: false, message: "Board not found." });
    }
  } catch (error) {
    console.error("Error deleting board:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
// Add more methods as needed (update, delete, etc.)
