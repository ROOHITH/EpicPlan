import React, { useEffect,useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { Select, MenuItem } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";



const CustomDialog = ({ open, handleClose, currentBoard, setDummyKey  }) => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const [subtask, setSubtask] = useState("");
  const [status, setStatus] = useState("");

   const backendUrl = 'http://localhost:3000';

  const handleAddSubtask = () => {
    if (subtask.trim() !== "") {
      setSubtasks((prevSubtasks) => [
        ...prevSubtasks,
        { subTaskName: subtask, subTaskStatus: "In Progress" },
      ]);
      setSubtask("");
    }
  };
  
  

  const handleSave = async () => {
    const taskData = {
      Board_Id: currentBoard,
      taskName: taskName,
      description: description,
      subTask: subtasks,
      Taskstatus: status,
    };

    try {
      // Create a new task

      const response = await axios.post(
        `${backendUrl}/createTask`,

        taskData,
        {
          withCredentials: true,
        }
      );
      console.log(response);

     

      // Refresh tasks after creating
      setDummyKey((prevKey) => prevKey + 1);

      // Closing the dialog
      handleClose();
      setStatus("");
      setDescription("");
      setSubtask("");
      setSubtasks([]);
      setTaskName("");

     
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };
  
  const handleRemoveSubtask = (index) => {
    setSubtasks((prevSubtasks) => prevSubtasks.filter((_, i) => i !== index));
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Create Task</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Task Name"
          fullWidth
          value={taskName}
          onChange={(e) => {setTaskName(e.target.value)
          
            
            
          }}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => {setDescription(e.target.value);
           
          }}
        />
        <TextField
          margin="dense"
          label="Subtasks"
          fullWidth
          value={subtask}
          onChange={(e) => setSubtask(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleAddSubtask}>
                <AddCircleIcon />
              </IconButton>
            ),
          }}
        />
        {subtasks.map((subtask, index) => (
          <div
            key={index}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              alignItems: "center",
            }}
          >
            <span>{subtask.subTaskName}</span>
            <span>Status: {subtask.subTaskStatus}</span>
            <IconButton onClick={() => handleRemoveSubtask(index)}>
              <DeleteIcon />
            </IconButton>
          </div>
        ))}

        {/* <TextField
          margin="dense"
          label="Status"
          fullWidth
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        /> */}

<FormControl fullWidth margin="dense">
  <InputLabel htmlFor="status-select">Status</InputLabel>
  <Select
    value={status}
    onChange={(e) => setStatus(e.target.value)}
    size="small"
    label="Status"
    id="status-select"
  >
    <MenuItem value={"todo"}>To-Do</MenuItem>
    <MenuItem value={"In Progress"}>In Progress</MenuItem>
    <MenuItem value={"Completed"}>Completed</MenuItem>
  </Select>
</FormControl>

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
