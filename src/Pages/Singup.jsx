import { useState } from "react";
import {
  Box,
  Typography,
  CardMedia,
  Card,
  CardContent,
  Divider,
  TextField,
  Button,
  Link,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert
} from "@mui/material";
import { Link as RouterLink, useNavigate, Navigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { registerUser } from "../store/slices/userSlice";
import { useDispatch } from "react-redux";


function Signup() {
  const authData = JSON.parse(localStorage.getItem('authData'));
  const isAuthenticated = authData?.isAuthenticated || false;

  if (isAuthenticated) {
    return <Navigate to="/user/dashboard" replace />;
  }
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Please enter your full name";
    if (!form.username.trim()) newErrors.username = "Please enter a username";
    if (!form.email.trim()) newErrors.email = "Please enter your email";
    else if (!emailRegex.test(form.email)) newErrors.email = "Invalid email address";
    if (!form.password) newErrors.password = "Please enter a password";
    if (!form.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newUser = {
      name: form.name,
      username: form.username,
      email: form.email,
      password: form.password,
    };

    dispatch(registerUser(newUser));
    console.log("Signed up:", newUser);
    setSnackOpen(true);
    setForm({
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
    setTimeout(() => {
      navigate('/login')
    }, 500)
  };


  return (
    <Box
      sx={{
        height: { lg: '98.3vh' },
        backgroundImage: `url('/loginbg.avif')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 1,
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          alignItems: { xs: "center", lg: "normal" },
          width: { xs: "auto", sm: "95%", md: "70%", lg: "60%" },
          padding: 2
        }}
      >
        <CardMedia
          component="img"
          sx={{
            display: { xs: "none", lg: "block" },
            width: "50%",
            objectFit: "contain"
          }}
          image="/loginsvg.svg"
          alt="signup"
          loading="lazy"
        />
        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 2, display: { xs: "none", lg: "block" } }}
        />
        <CardContent sx={{ flex: 1, width: "100%" }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ mt: { lg: "20px" }, textAlign: { lg: "center" } }}
          >
            Create an Account
          </Typography>
          <Typography
            variant="body2"
            color="gray"
            sx={{ mt: "5px", textAlign: { lg: "center" } }}
          >
            Please enter your details
          </Typography>
          <Box component="form" onSubmit={handleSignup} sx={{ mt: 2 }}>
            <TextField
              label="Full Name"
              name="name"
              fullWidth
              margin="normal"
              value={form.name}
              onChange={handleChange}
              helperText={error.name || " "}
              error={!!error.name}
            />
            <TextField
              label="Username"
              name="username"
              fullWidth
              margin="normal"
              value={form.username}
              onChange={handleChange}
              helperText={error.username || " "}
              error={!!error.username}
            />
            <TextField
              label="Email"
              name="email"
              fullWidth
              margin="normal"
              value={form.email}
              onChange={handleChange}
              helperText={error.email || " "}
              error={!!error.email}
            />
            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={form.password}
              onChange={handleChange}
              helperText={error.password || " "}
              error={!!error.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={form.confirmPassword}
              onChange={handleChange}
              helperText={error.confirmPassword || " "}
              error={!!error.confirmPassword}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2, height: "50px" }}
            >
              Sign Up
            </Button>
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="body2">
                Already have an account?{" "}
                <Link component={RouterLink} to="/login">
                  Login
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>


      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
          onClose={() => setSnackOpen(false)}
        >
          Signup successful!
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Signup;
