import React, { useState, useEffect, useRef, useCallback } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import FolderIcon from "@mui/icons-material/Folder";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";

import { useSnackbarWithDefaults } from "../Util/SnackbarHelpers";
const CustomListItem = ({
  primaryText,
  onDelete,
  isEditing,
  onRename,
  onCancelRename,
  higlighttheme,
  onSelectBoard,
  selected,
}) => {
  const { showSuccessSnackbar, showErrorSnackbar } = useSnackbarWithDefaults();
  const [newName, setNewName] = useState(primaryText);
  const textFieldRef = useRef(null);

  const handleBlur = useCallback(async () => {
    const trimmedNewName = newName.trim();
    if (trimmedNewName !== "" && trimmedNewName !== primaryText) {
      await onRename(trimmedNewName);
    } else {
      onCancelRename();
    }
  }, [newName, primaryText, onRename, onCancelRename]);

  const handleDoubleClick = () => {
    if (onRename && typeof onRename === "function") {
      onRename(primaryText); // Replace "New Name" with the actual logic for renaming
    }  
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleBlur();
    } else if (e.key === "Escape") {
      onCancelRename();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        textFieldRef.current &&
        !textFieldRef.current.contains(event.target)
      ) {
        // Clicked outside the TextField
        handleBlur();
        const trimmedNewName = newName.trim();
        if (trimmedNewName !== "" && trimmedNewName !== primaryText) {
          showSuccessSnackbar("Board Renamed successfully", {
            variant: "success",
          });
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [textFieldRef, handleBlur]);

  return (
    <ListItem
      onDoubleClick={handleDoubleClick}
      onClick={(event) => {
        onSelectBoard(); // Call onSelectBoard on click
      }}
      sx={{
        cursor: "pointer",
        backgroundColor: selected ? higlighttheme : "transparent",
        "&:hover": {
          backgroundColor: higlighttheme,
        },
      }}
    >
      <ListItemAvatar>
        <Avatar>
          <FolderIcon />
        </Avatar>
      </ListItemAvatar>
      {isEditing ? (
        <TextField
          ref={textFieldRef}
          autoFocus
          fullWidth
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="BoardNameField"
          variant="filled"
          color="success"
          sx={{
            height: "min-content", // Set your desired height
          }}
          size="small"
          inputProps={{
            maxLength: 25,
          }}
        />
      ) : (
        <>
          <ListItemText
            primary={primaryText}
            primaryTypographyProps={{ variant: "body2" }}
          />
          <IconButton
            edge="end"
            aria-label="delete"
            size="small"
            onClick={onDelete}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </>
      )}
    </ListItem>
  );
};

export default CustomListItem;
