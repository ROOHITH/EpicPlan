import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Switch,
} from "@mui/material";
import axios from "axios";

const UserListDialoge = ({
  openList,
  handleCloseList,
  currentBoard,
  setDummyKey,
}) => {
   const backendUrl = 'http://localhost:3000';
  const [userList, setUserList] = useState([]);
  const [boardUsers, setBoardUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        // Fetch the list of all users
        const response = await axios.get(`${backendUrl}/users`, {
          withCredentials: true,
        });
        const allUsers = response.data;
        setUserList(allUsers);

        const boardId = currentBoard || ""; // Ensure a valid string or an empty string
        const boardResponse = await axios.get(
          `${backendUrl}/board/${boardId}/users`,
          {
            withCredentials: true,
          }
        );

        const usersInBoard = boardResponse.data;
        
        setBoardUsers(usersInBoard);

        // Initialize selected users with the users in the board
        setSelectedUsers(usersInBoard.map((user) => user._id));
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    };

    if (openList) {
      fetchUserList();
    }
  }, [openList, currentBoard]);

  const handleSave = async () => {
    try {
      // Update the board's user list on the server
      await axios.put(
        `${backendUrl}/board/${currentBoard}/users`,
        {
          users: selectedUsers,
        },
        {
          withCredentials: true,
        }
      );

      // Close the dialog
      handleCloseList();
    } catch (error) {
      console.error("Error updating user list:", error);
    }
  };

  const handleToggleUser = (userId) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(userId)) {
        // Remove the user from the selected list
        return prevSelectedUsers.filter((id) => id !== userId);
      } else {
        // Add the user to the selected list
        return [...prevSelectedUsers, userId];
      }
    });
  };

  const isAdmin = (userId) => {
    // Check if the user is the creator of the board (admin)
    return boardUsers.some((user) => user._id === userId && user.isCreator);
  };

  return (
    <Dialog
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "500px", // Set your width here
          },
        },
      }}
      open={openList}
      onClose={handleCloseList}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">User List</DialogTitle>
      <DialogContent>
        <List>
          {userList.map((user) => (
            <ListItem key={user._id}>
              <ListItemText primary={user.username} />
              <ListItemSecondaryAction>
                {isAdmin(user._id) ? (
                  <IconButton disabled>
                    {/* Admin icon or label */}
                    <span>Admin</span>
                  </IconButton>
                ) : (
                  <>
                    <Switch
                      onChange={() => handleToggleUser(user._id)}
                      checked={selectedUsers.includes(user._id)}
                      color="primary"
                    />
                  </>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseList} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserListDialoge;
