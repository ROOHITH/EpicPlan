import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Box, useTheme, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";

const TopBar = ({ children, removeCookie }) => {
    const navigate = useNavigate();
     const backendUrl = 'http://localhost:3000';
    const LogoutFunc = () => {
      
      removeCookie("token");
      alert("ddd");
      //navigate("/signup");
    };
  return (
    <>
      <Box className="TopBar">
        <Box className="sec1">
          
          {children}
        </Box>
        <Box className="sec2">
          <AccountMenu LogoutFunc={LogoutFunc}></AccountMenu>
         
        </Box>
      </Box>
    </>
  );
};

 function AccountMenu({ LogoutFunc }) {
    const [user, setUser] = useState(null);
    const backendUrl = 'http://localhost:3000';
    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const response = await axios.get(`${backendUrl}/user-profile`, {
            withCredentials: true,
          });
  
          const userData = response.data.user;
  console.log(userData._id); 
         // Use spread operator to update the state immutably
      setUser(prev => ({  ...userData }));
        } catch (error) {
          console.error('Error fetching user profile:', error.message);
        }
      };
  
      fetchUserProfile();
    }, []);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const getFirstLetter = (str) => {
    return str?.charAt(0).toUpperCase() || "";
  };
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>{getFirstLetter(user?.username)}</Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> Profile
        </MenuItem>
        
        <Divider />
        {/* <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem> */}
        <MenuItem onClick={LogoutFunc}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default TopBar;
