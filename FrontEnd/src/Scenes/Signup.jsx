import React from "react";
import { useState } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  useTheme,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";

const Signup = () => {
   const backendUrl = 'http://localhost:3000';
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // Access theme colors based on mode
  const primaryColor = isDarkMode
    ? theme.palette.primary.light
    : theme.palette.primary.main;
  const secondaryColor = isDarkMode
    ? theme.palette.background.paper
    : theme.palette.background.default;
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: "",
  });

  const { email, password, username } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) => {
    console.log(err);
    alert(err);
  };
  const handleSuccess = (msg) => {
    alert(msg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !username) {
      handleError("Please fill in all fields");
      return;
    }
    try {
      const { data } = await axios.post(
        `${backendUrl}/Signup`,
        inputValue,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { success, message } = data;

      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        if (message.includes("User already exists")) {
          handleError("User already exists. Please use a different email.");
        } else {
          handleError(message);
        }
      }
    } catch (error) {
      console.log(error);
      console.log("here");
      handleError("Network Error");
    }
    setShowPassword(false);
    setInputValue({
      email: "",
      password: "",
      username: "",
    });
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  return (
    <>
      <Container component="main" maxWidth="xs">
        <Typography variant="h5" align="center" gutterBottom>
          Sign Up
        </Typography>
        <form>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            name="username"
            onChange={handleOnChange}
            sx={{ backgroundColor: secondaryColor }}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            name="email"
            value={email}
            onChange={handleOnChange}
            sx={{ backgroundColor: secondaryColor }}
          />
          <TextField
            label="Password"
            fullWidth
            margin="normal"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handleOnChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ backgroundColor: secondaryColor }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ background: primaryColor,marginTop:"10px" }}
            fullWidth
            onClick={handleSubmit}
          >
            Sign Up 
          </Button>
          <Box sx={{marginTop:"5px",display:"flex",flexDirection:"row", justifyContent: "center", alignItems: "center"}}>
          <Typography> Already have an account? <Link to="/login">Login</Link></Typography>
          </Box>
        </form>
      </Container>
    </>
  );
};

export default Signup;
