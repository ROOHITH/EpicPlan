// DarkModeButton.js
import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const DarkModeButton = ({isDarkMode,setIsDarkMode}) => {
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        console.log("Dark Mode Toggled"+isDarkMode);
        // Add logic to update the theme globally or as needed
      };
    
      
  return (
    <IconButton
      sx={{ ml: 1 }} 
       onClick={toggleDarkMode}
      color="inherit"
    >
      {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};

export default DarkModeButton;
