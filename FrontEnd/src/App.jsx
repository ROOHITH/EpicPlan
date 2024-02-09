import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import "./App.css";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import { lightTheme, darkTheme } from "./Theme";
import Login from "./Scenes/Login";

import Signup from "./Scenes/Signup";
import Home from "./Scenes/Home";
import { CookiesProvider } from "react-cookie";
import DarkModeButton from "../src/components/DarkModeButton";
import { SnackbarProvider } from 'notistack';


function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
 
  return (
    <>
      <CookiesProvider>
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
          <CssBaseline />
          <div className="app">
            <BrowserRouter>
            <SnackbarProvider maxSnack={3}>
              <Routes>
                <Route index element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/home"
                  element={
                    <Home isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
                  }
                />
                <Route path="/signup" element={<Signup />} />
              
              </Routes>
              </SnackbarProvider>
            </BrowserRouter>

            {/* <DarkModeButton
              isDarkMode={isDarkMode}
              setIsDarkMode={() => setIsDarkMode(!isDarkMode)}
            /> */}
          </div>
        </ThemeProvider>
      </CookiesProvider>
    </>
  );
}

export default App;
