import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { Select, MenuItem } from "@mui/material";
import axios from "axios";
import LongMenu from "../components/LongMenu";
import {
  CardActionArea,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  Box,
} from "@mui/material";

const ActionAreaCard = ({
  taskName,
  taskDescprition,
  numOfSubTAsk,
  subTask,
  taskStatus,
  taskkey,
  setDummyKey,
}) => {
  // Access the environment variables with process.env
const backendUrl = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_BACKEND_URL_PROD
  : process.env.REACT_APP_BACKEND_URL_DEV;
  const [openDialogTaskDetails, setOpenDialogTaskDetails] = useState(false);
  const [checkedItems, setCheckedItems] = useState(
    subTask.map((elem) => (elem.subTaskStatus === "In Progress" ? false : true))
  );
  const [TaskStatus, setTaskStatus] = useState(taskStatus);

  const handleOpenDialogTaskDetails = () => {
    setOpenDialogTaskDetails(true);
  };

  const handleCloseDialogTaskDetails = () => {
    setOpenDialogTaskDetails(false);
  };

  const onCheckBoxChecked = (index) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
  };

  const handleSave = async () => {
    // You can send a request to the server to update the subtask status here
    console.log("Updating server with subtask status:", checkedItems);
    try {
      //update task
      // Prepare the updated task data
      const updatedTaskData = {
        subTasks: subTask.map((subTask, index) => ({
          ...subTask,
          subTaskStatus: checkedItems[index] ? "Completed" : "In Progress",
        })),
        taskStatus: TaskStatus,
      };

      // Send a request to update the task
      const response = await axios.put(
        `${backendUrl}/updateTask/${taskkey}`,
        updatedTaskData,
        {
          withCredentials: true,
        }
      );

      if (response) {
        // Refresh tasks after updating
        setDummyKey((prevKey) => prevKey + 1);
        handleCloseDialogTaskDetails();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async () => {
    try {
      // Send a request to delete the task
      const response = await axios.delete(
        `${backendUrl}/deleteTask/${taskkey}`,
        {
          withCredentials: true,
        }
      );

      if (response) {
        // Refresh tasks after deleting
        setDummyKey((prevKey) => prevKey + 1);
        handleCloseDialogTaskDetails();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Card
        sx={{
          margin: "10px",
          borderRadius: "8px",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <CardActionArea onClick={handleOpenDialogTaskDetails}>
          <CardMedia
            sx={{
              height: 140,
              borderRadius: "8px 8px 0 0",
              objectFit: "cover",
            }}
            component="img"
            image="../../public/7228781.jpg"
            alt="Task Image"
          />
          <CardContent>
            <Typography variant="h6" component="div">
              {taskName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {taskDescprition}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {`${numOfSubTAsk} ${
                numOfSubTAsk === 1 ? "Sub Task" : "Sub Tasks"
              }`}
            </Typography>
          </CardContent>
        </CardActionArea>
        <LongMenu onDelete={handleDelete} />
      </Card>

      {/* Dialog Box */}
      <Dialog
        className="taskDetailsBox"
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "500px", // Set your width here
            },
          },
        }}
        open={openDialogTaskDetails}
        onClose={handleCloseDialogTaskDetails}
      >
        <DialogTitle sx={{ paddingBottom: "0px" }}>Task Details</DialogTitle>
        <DialogContent>
          {/* Place your form elements here for editing task details */}
          <Typography variant="h6">{taskName}</Typography>
          <Typography
            variant="body2"
            sx={{ margin: "10px 0px 10px 0px", color: "grey" }}
          >
            {taskDescprition}
          </Typography>
          {/* Include checkboxes for subtasks */}
          <Box>
            {subTask.map((item, index) => (
              <React.Fragment key={index}>
                <Box
                  key={`box-${index}`}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 255, 0, 0.1)",
                  }}
                >
                  <Checkbox
                    color="success"
                    checked={checkedItems[index]}
                    onChange={() => onCheckBoxChecked(index)}
                    inputProps={{
                      "aria-label": "controlled",
                    }} /*...props for subtask status*/
                  />
                  <Typography
                    sx={{
                      alignSelf: "center",
                      textDecoration: checkedItems[index]
                        ? "line-through"
                        : "none",
                      paddingRight: "10px",
                    }}
                  >
                    {item.subTaskName}
                  </Typography>
                </Box>
                <Divider key={`divider-${index}`} />
              </React.Fragment>
            ))}
          </Box>
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Status:
            </Typography>
            <Select
              value={TaskStatus}
              onChange={(e) => setTaskStatus(e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value={"todo"}>To-Do</MenuItem>
              <MenuItem value={"In Progress"}>In Progress</MenuItem>
              <MenuItem value={"Completed"}>Completed</MenuItem>
            </Select>
          </Box>

          {/* Add more elements as needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogTaskDetails}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
      {/* Overflow Menu */}
    </>
  );
};

export default ActionAreaCard;
