// TaskController.js
const { ObjectId } = require("mongoose").Types;
const { Task } = require("../Model/TaskModel");

module.exports.createTask = async (req, res) => {
  try {
    const newTask = new Task({
      Board_Id: req.body.Board_Id,
      taskName: req.body.taskName,
      description: req.body.description,
      subTask: req.body.subTask || [],
      taskStatus: req.body.Taskstatus,
    });
    console.log(newTask);
    const savedTask = await newTask.save();
    console.log(savedTask);
    res.json(savedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.getTasksByBoardId = async (req, res) => {
  try {
    const tasks = await Task.find({ Board_Id: req.params.boardId });
    console.log(tasks);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Server-side updateTask route
// module.exports.updateTask = async (req, res) => {
//   try {
//     const { subTasks, taskStatus } = req.body;

//     // Prepare the updated subtasks array
//     const updatedSubtasks = await Promise.all(
//       subTasks.map(async (subtask) => {
//         try {
//           const taskId = req.params.taskId;
//           const subtaskId = subtask._id;

//           // Find the task by taskId and the matching subtask within the array
//           const updatedTask = await Task.findOneAndUpdate(
//             { _id: taskId, "subTask._id": subtaskId },
//             {
//               $set: {
//                 "subTask.$.subTaskStatus": subtask.subTaskStatus,
//               },
//             },
//             { new: true }
//           );

//           // Check if the task was found and updated
//           if (!updatedTask) {
//             console.log(
//               `Task or subtask not found with IDs: ${taskId} / ${subtaskId}`
//             );
//             return null;
//           }

//           // Return the updated subtask array
//           return updatedTask.subTask;
//         } catch (error) {
//           console.error(
//             `Error updating subtask with ID ${subtask._id}:`,
//             error
//           );
//           return null;
//         }
//       })
//     );
//     console.log(updatedSubtasks);
//     // Filter out null values from updatedSubtasks array
//     const filteredUpdatedSubtasks = updatedSubtasks.filter(
//       (subtask) => subtask !== null
//     );

//     // Assuming taskStatus is not within subTask array
//     const updatedTask = await Task.findByIdAndUpdate(
//       req.params.taskId,
//       { subTask: filteredUpdatedSubtasks, taskStatus },
//       { new: true }
//     );

//     res.json(updatedTask);
//   } catch (error) {
//     console.error("Error in updateTask route:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// Server-side updateSubtaskStatus route
module.exports.updateTask = async (req, res) => {
  const { subTasks, taskStatus } = req.body;

  // Prepare the updated subtasks array
  const updatedSubtasks = await Promise.all(
    subTasks.map(async (subtask) => {
      try {
        const taskId = req.params.taskId;
        const subtaskId = subtask._id;

        // Find the task by taskId and the matching subtask within the array
        const updatedTask = await Task.findOneAndUpdate(
          { _id: taskId, "subTask._id": subtaskId },
          {
            $set: {
              "subTask.$.subTaskStatus": subtask.subTaskStatus,
            },
          },
          { new: true }
        );

        // Check if the task was found and updated
        if (!updatedTask) {
          console.log(
            `Task or subtask not found with IDs: ${taskId} / ${subtaskId}`
          );
          return null;
        }

        // Return the updated subtask array
        //return updatedTask.subTask;
        const updatedTasks = await Task.findByIdAndUpdate(
          taskId,
          { taskStatus },
          { new: true }
        );

        res.json(updatedTask);
      } catch (error) {
        console.error(`Error updating subtask with ID ${subtask._id}:`, error);
        return null;
      }
    })
  );
};
module.exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.taskId);
    res.json(deletedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
