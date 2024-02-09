// Login.js
import { useState } from "react";
import { Box } from "@mui/material";
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
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  // Access the environment variables with process.env
const backendUrl = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_BACKEND_URL_PROD
  : process.env.REACT_APP_BACKEND_URL_DEV;
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const { email, password } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };
  const handleError = (err) => {
    alert(err);
  };
  const handleSuccess = (msg) => {
    alert(msg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      

      const { data } = await axios.post(
        `${backendUrl}/Login`,
        {
          ...inputValue,
        },
        
        { withCredentials: true,  }
      );
      console.log(data);
      const { success, message, token1 } = data;
      if (success) {
        handleSuccess(message);
        

        setTimeout(() => {
          navigate("/home");
        }, 1000); 
      } else {
        handleError(message);
      }
    } catch (error) {
      console.error("Error during login request:", error);

    // Check if there is a response object with more details
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      // The request was made, but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up the request:", error.message);
    }

    // Handle error
    handleError("Network Error. Please try again.");
    }
    setInputValue({
      ...inputValue,
      email: "",
      password: "",
    });
  };
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // Access theme colors based on mode
  const primaryColor = isDarkMode
    ? theme.palette.primary.light
    : theme.palette.primary.main;
  const secondaryColor = isDarkMode
    ? theme.palette.background.paper
    : theme.palette.background.default;

  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <form>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            name="email"
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
            Login
          </Button>
          <Box sx={{marginTop:"5px",display:"flex",flexDirection:"row", justifyContent: "center", alignItems: "center"}}>
          <Typography>Don't have an account? <Link to="/signup">Create Account</Link></Typography>
          </Box>
          
        </form>

      </Container>
    </>
  );
};

export default Login;
