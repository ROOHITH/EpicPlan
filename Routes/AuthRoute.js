const { Signup, Login } = require("../Controller/AuthController");
const { userVerification } = require("../MiddleWare/AuthMiddleware");
const {
  createBoard,
  getUserBoards,
  renameUserBoard,
  deleteBoard,
  updateUsersInBoard,
  getUsersInBoard,
  getSharedBoards ,
} = require("../Controller/BoardController");
const {
  createTask,
  getTasksByBoardId,
  updateTask,
  deleteTask,
} = require("../Controller/TaskController");
const { getAllUsers } = require("../Controller/userController");
const router = require("express").Router();

router.use((req, res, next) => {
  console.log("Middleware logging:", req.url);
  next();
});
router.post("/signup", Signup);
router.post("/login", Login);
router.use(userVerification);

// Route for token verification
router.post('/', userVerification, (req, res) => {
  // If the middleware execution reaches here, the token is verified
  res.json({ status: true, user: req.user });
});

//Board routes
router.post("/createBoard", createBoard);
router.get("/getUserBoards", getUserBoards);
router.put("/renameUserBoard", renameUserBoard);
router.delete("/deleteBoard/:boardId", deleteBoard);

// Task routes
router.post("/createTask", createTask);
router.get("/getTasksByBoardId/:boardId", getTasksByBoardId);
router.put("/updateTask/:taskId", updateTask);
router.delete("/deleteTask/:taskId", deleteTask);

// User routes
router.get("/users", getAllUsers);

// Board routes
router.get("/board/:boardId/users", getUsersInBoard);
router.put("/board/:boardId/users", updateUsersInBoard);
// Define a route for fetching shared boards
router.get('/getSharedBoards', getSharedBoards);

module.exports = router;
