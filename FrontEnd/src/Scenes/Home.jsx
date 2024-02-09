// Home.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Box, useTheme, Grid } from "@mui/material";
import "../Scenes/HomeCss/home.css";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import DarkModeButton from "../components/DarkModeButton";
import CustomListItem from "../components/ListItemComponent";
import CustomDialog from "../components/DialogComponent";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import MenuIcon from "@mui/icons-material/Menu"; // Add menu icon
import CloseIcon from "@mui/icons-material/Close";

import {
  Container,
  Typography,
  TextField,
  Button,
  Tab,
  Tabs,
} from "@mui/material";
import { useSnackbarWithDefaults } from "../Util/SnackbarHelpers";
import TopBar from "../components/TopBar";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import GrainIcon from "@mui/icons-material/Grain";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";

import GroupAddIcon from "@mui/icons-material/GroupAdd";

import ActionAreaCard from "../components/TaskCard";

import UserListDialoge from "../components/UsersListComponent";

const Home = ({ isDarkMode, setIsDarkMode }) => {
  const { showSuccessSnackbar, showErrorSnackbar } = useSnackbarWithDefaults();
  const navigate = useNavigate();

  // Access the environment variables with process.env
const backendUrl = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_BACKEND_URL_PROD
  : process.env.REACT_APP_BACKEND_URL_DEV;
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Backend URL:', backendUrl);
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [username, setUsername] = useState("");
  const [listItems, setListItems] = useState([]);
  const [listItemId, setlistItemId] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentBoard, setCurrentBoard] = useState("");
  const [dummyKey, setDummyKey] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [todoTasks, setTodoTasks] = useState([]);
  const [doingTasks, setDoingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  const [openDialogList, setOpenDialogList] = useState(false);

  const [value, setValue] = useState(0);
  const [sharedBoards, setSharedBoards] = useState([]);

  useEffect(() => {
    const fetchSharedBoards = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/getSharedBoards`,
          {
            withCredentials: true,
          }
        );
        const sharedBoards = response.data.map((board) => ({
          id: board._id,
          userid: board.userId,
          boardname: board.boardName,
          type: "shared",
        }));
        setSharedBoards(sharedBoards);
      } catch (error) {
        console.error("Error fetching shared boards:", error);
      }
    };

    fetchSharedBoards();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    const fetchAllUserBoards = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/getUserBoards`,
          {
            withCredentials: true,
          }
        );
        console.log("User boards:", response.data);
        // Extract board names from the fetched user boards
        const newItems = response.data.map((board) => ({
          id: board._id,
          userid: board.userId,
          boardname: board.boardName,
        }));
        // Update state with the new items
        setListItems((prevListItems) => [...newItems]);
      } catch (error) {
        console.error("Error fetching user boards:", error);
      }
    };
    fetchAllUserBoards();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      console.log("Current Board:", currentBoard);
      try {
        console.log("fetching");
        const response = await axios.get(
          `${backendUrl}/getTasksByBoardId/${currentBoard}`,
          {
            withCredentials: true,
          }
        );
        const allTasks = response.data;
        console.log(allTasks);

        // Check if response.data is an array
        if (Array.isArray(allTasks)) {
          // Categorize tasks based on their status
          const todoTasks = allTasks.filter(
            (task) => task.taskStatus === "todo"
          );

          const doingTasks = allTasks.filter(
            (task) => task.taskStatus === "In Progress"
          );
          const completedTasks = allTasks.filter(
            (task) => task.taskStatus === "Completed"
          );

          setTasks(allTasks);
          setTodoTasks(todoTasks);
          setDoingTasks(doingTasks);
          setCompletedTasks(completedTasks);
        } else {
          console.error("Received invalid data from the server:", allTasks);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    // Fetch tasks when the component mounts or when currentBoard changes
    if (currentBoard != "") {
      fetchTasks();
    } else {
      setTasks([]);
      setTodoTasks([]);
      setDoingTasks([]);
      setCompletedTasks([]);
    }
  }, [currentBoard, dummyKey]);

  useEffect(() => {
    const tokenCookie = cookies.token;

    const verifyCookie = async () => {
      try {
        console.log("Token Cookie:", tokenCookie);

        if (!tokenCookie) {
          console.log("Token not found, redirecting to login");
           navigate("/login");
          return;
        }

        console.log("Making server request...");

        const response = await axios.post(
          `${backendUrl}`,
         {},
          {
            withCredentials: true,
          }
        );

        console.log("Server response:", response.data);

        const { status, user } = response.data;

        if (status) {
          setUsername(user);
        } else {
          console.log(
            "Invalid status, removing token and redirecting to login"
          );
          removeCookie("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error verifying cookie:", error);
        console.log("Removing token and redirecting to login");
        removeCookie("token");
        navigate("/login");
      }
    };

    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenList = () => {
    setOpenDialogList(true);
  };

  const handleCloseList = () => {
    setOpenDialogList(false);
  };

  const handleCreateBoard = async () => {
    try {
      const newItem = `New Board`;

      const boardNames = newItem;
      const response = await axios.post(
        `${backendUrl}/createBoard`,
        {
          boardNames,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Board created:", response);
      const { _id, userId, boardName } = response.data;
      console.log(_id + "   id");
      console.log(userId + "   userId");
      console.log(boardName + "   boardName");
      console.log("newItem" + newItem);

      // Update state without mutating
      setListItems((prevListItems) => [
        { id: _id, userid: userId, boardname: boardName },
        ...prevListItems,
      ]);
      showSuccessSnackbar("Board created successfully", { variant: "success" });
      // Handle success (e.g., update UI, show a message)
    } catch (error) {
      console.error("Error creating board:", error);
      showErrorSnackbar("Error creating board", { variant: "error" });
      // Handle error (e.g., show an error message)
    }
  };

  const handleDeleteItem = async (index) => {
    try {
      const updatedList = [...listItems];
      const boardId = updatedList[index].id;
      console.log(boardId);
      const response = await axios.delete(
        `${backendUrl}/deleteBoard/${boardId}`,
        {
          withCredentials: true,
        }
      );

      console.log(response.data.message);
      if (response.data.success) {
        // Board deleted successfully, update your state or UI as needed
        setListItems((prevListItems) =>
          prevListItems.filter((_, i) => i !== index)
        );
        console.log("Board deleted successfully.");
        showSuccessSnackbar("Board deleted successfully", {
          variant: "success",
        });
        console.log("Before setting current board:", currentBoard);
        setCurrentBoard("");
        console.log("After setting current board:", currentBoard);
      } else {
        console.error("Error deleting board:", response.data.message);
        showErrorSnackbar("Error deleting board", { variant: "error" });
      }
    } catch (error) {
      console.error("Error deleting board:", error);
    }
  };

  const handleRenameItem = async (index, newName) => {
    try {
      setEditingIndex(index);
      const updatedList = [...listItems];
      const boardId = updatedList[index].id;

      const response = await axios.put(
        `${backendUrl}/renameUserBoard`,
        {
          boardId,
          newBoardName: newName,
        },
        {
          withCredentials: true,
        }
      );

      updatedList[index] = { ...updatedList[index], boardname: newName };

      setListItems(updatedList);
    } catch (error) {
      console.error("Error during renaming:", error);
      showErrorSnackbar("Error Renamed board", { variant: "error" });
    }
  };

  const selectBoard = async (index) => {
    try {
      console.log(value);
      let boardId = "";
      if (value === 0) {
        console.log("select self created board");
        console.log("current board:", currentBoard);
        const updatedList = [...listItems];
        boardId = updatedList[index].id;
      } else if (value === 1) {
        console.log("select shared-board");
        console.log("current board:", currentBoard);
        const updatedList = [...sharedBoards];
        boardId = updatedList[index].id;
      }
      setCurrentBoard(boardId);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancelRename = () => {
    setEditingIndex(null); // Clear the editing state without renaming
  };

  const [sidebarOpen, setSidebarOpen] = useState(true); // Track sidebar state

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const theme = useTheme();
  const isDarkMode_ = theme.palette.mode === "dark";

  const primaryColor = isDarkMode_
    ? theme.palette.primary.light
    : theme.palette.primary.main;
  const secondaryColor = isDarkMode_
    ? theme.palette.background.paper
    : theme.palette.background.default;

  const textColorPrimary = isDarkMode_
    ? theme.palette.text.primary
    : theme.palette.text.primary;
  const mainLogo = isDarkMode_
    ? "../../public/darkmodeLogo.jpg"
    : "../../public/mainlogo.png";
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));
  const childProps = {
    setDummyKey,
    // ... other props you want to pass to the child
  };
  return (
    <>
      <Box className={`SideBar ${sidebarOpen ? "Open" : "Closed"}`}>
        <IconButton
          className="ToggleSidebarButton"
          onClick={handleToggleSidebar}
          sx={{ display: { xs: "block", md: "none" } }} // Show only on small screens
        >
          {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
        <Box
          className="Title"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {" "}
          <img
            className="logo"
            src="../../public/darkmodeLogo.jpg"
            alt="Logo"
            style={{ width: "100px", height: "auto" }}
          />
        </Box>
        <Divider />
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="All Boards" />
          <Tab label="Shared Boards" />
        </Tabs>
        {value === 0 && (
          <Box className="ListBox">
            <Typography variant="h9" align="center" gutterBottom>
              All Boards ({listItems.length})
            </Typography>
            <List>
              {listItems.map((item, index) => (
                <CustomListItem
                  higlighttheme={theme.palette.action.selected}
                  key={index}
                  primaryText={item.boardname}
                  onDelete={() => handleDeleteItem(index)}
                  isEditing={index === editingIndex}
                  onRename={(newName) => handleRenameItem(index, newName)}
                  onCancelRename={handleCancelRename}
                  onSelectBoard={() => selectBoard(index)}
                  selected={item.id === currentBoard}
                />
              ))}
            </List>
          </Box>
        )}

        {value === 1 && (
          <Box className="ListBox">
            <Typography variant="h9" align="center" gutterBottom>
              Shared Boards ({sharedBoards.length})
            </Typography>
            <List>
              {sharedBoards.map((item, index) => (
                <CustomListItem
                  higlighttheme={theme.palette.action.selected}
                  key={index}
                  primaryText={item.boardname}
                  onSelectBoard={() => selectBoard(index)}
                  selected={item.id === currentBoard}
                />
              ))}
            </List>
          </Box>
        )}

        <Box className="BoardBox">
          <Button
            variant="contained"
            className="CreateBoardButton"
            onClick={handleCreateBoard}
            sx={{
              backgroundColor: "#4CAF50",
              color: "white",
              "&:hover": {
                backgroundColor: "#45a049",
              },
              fontSize: "12px",
              padding: "8px 16px",

              zIndex: 1,
            }}
          >
            <AddCircleIcon></AddCircleIcon>
            Create new Board
          </Button>
        </Box>
        <Divider />
        <Box className="BottomBox">
          <Box className="bgOf">
            <DarkModeButton
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
          </Box>
        </Box>
        <Divider />
      </Box>

      <Box
        className="conatiner"
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          width: sidebarOpen ? "calc(100% - 250px)" : "100%", // Adjust the width
          transition: "margin-left 0.5s",
        }}
      >
        <TopBar
          removeCookie={removeCookie}
          sx={{ height: sidebarOpen ? "64px" : "0" }}
        ></TopBar>

        <Box
          sx={{ flex: 1, overflowY: "auto", padding: "40px 25px 25px 25px" }}
        >
          <Box className="filterBox">
            {/* <Box sx={{flex:"1" ,display:"flex",flexDirection:"row"}}>
              {/* <Typography variant="body1">Filter </Typography>
              <Typography variant="body1"> Sort</Typography> 
            </Box> */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flex: "1",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h4" gutterBottom>
                Your Workspace Content Goes Here
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton onClick={handleOpenList}>
                  <GroupAddIcon />
                </IconButton>
                <Button
                  variant="contained"
                  onClick={handleOpenDialog}
                  color="success"
                >
                  Add Task
                </Button>
              </Box>

              {/* Include the UserListDialoge component */}
              <UserListDialoge
                currentBoard={currentBoard}
                openList={openDialogList}
                handleCloseList={handleCloseList}
              />
            </Box>
          </Box>
          <Divider sx={{ marginTop: "1px", marginBottom: "10px" }}></Divider>

          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <Item>
                <Box className="iconBox">
                  <GrainIcon></GrainIcon>
                  <Typography variant="body1">
                    {" "}
                    Todo ({todoTasks.length})
                  </Typography>
                </Box>

                {todoTasks.map((task) => (
                  // Render task component
                  <ActionAreaCard
                    key={task._id}
                    taskkey={task._id}
                    taskName={task.taskName}
                    taskDescprition={task.description}
                    numOfSubTAsk={task.subTask.length}
                    subTask={task.subTask}
                    taskStatus={task.taskStatus}
                    {...childProps}
                  ></ActionAreaCard>
                ))}
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <Item>
                <Box className="iconBox_2">
                  <ConstructionRoundedIcon></ConstructionRoundedIcon>{" "}
                  <Typography variant="body1">
                    {" "}
                    In Progress ({doingTasks.length})
                  </Typography>
                </Box>
                {doingTasks.map((task) => (
                  // Render task component
                  <ActionAreaCard
                    key={task._id}
                    taskkey={task._id}
                    taskName={task.taskName}
                    taskDescprition={task.description}
                    numOfSubTAsk={task.subTask.length}
                    subTask={task.subTask}
                    taskStatus={task.taskStatus}
                    {...childProps}
                  ></ActionAreaCard>
                ))}
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <Item>
                <Box className="iconBox_3">
                  <TaskAltRoundedIcon></TaskAltRoundedIcon>
                  <Typography variant="body1">
                    {" "}
                    Completed ({completedTasks.length})
                  </Typography>
                </Box>
                {completedTasks.map((task) => (
                  // Render task component
                  <ActionAreaCard
                    key={task._id}
                    taskkey={task._id}
                    taskName={task.taskName}
                    taskDescprition={task.description}
                    numOfSubTAsk={task.subTask.length}
                    subTask={task.subTask}
                    taskStatus={task.taskStatus}
                    {...childProps}
                  ></ActionAreaCard>
                ))}
              </Item>
            </Grid>
          </Grid>
          <CustomDialog
            currentBoard={currentBoard}
            open={openDialog}
            handleClose={handleCloseDialog}
            {...childProps}
          />
        </Box>
      </Box>
    </>
  );
};

export default Home;
