import { useState, useEffect } from "react";
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
    Alert,
    Snackbar
} from "@mui/material";
import { Link as RouterLink, useNavigate, Navigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import jwt_encode from 'jwt-encode';
import { useSelector, useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [error, setError] = useState({ email: '', password: '', captcha: '' });
    const [captcha, setCaptcha] = useState('');
    const [userCaptchaInput, setUserCaptchaInput] = useState('');

    const users = useSelector((state) => state.users.registeredUsers);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const authData = JSON.parse(localStorage.getItem('authData'));
    const isAuthenticated = authData?.isAuthenticated || false;

    useEffect(() => {
        generateCaptcha();
    }, []);

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    const generateCaptcha = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 5; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptcha(result);
    };

    const Validation = () => {
        let validationErr = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!password) validationErr.password = "Please enter your password";
        if (!email) validationErr.email = "Please enter your email";
        if (email && !emailRegex.test(email)) validationErr.email = "Please enter a valid email";
        if (!userCaptchaInput || userCaptchaInput !== captcha) validationErr.captcha = "Invalid CAPTCHA";

        setError(validationErr);
        return Object.keys(validationErr).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!Validation()) return;

        try {
            const user = users.find(
                (u) => u.email === email && u.password === password
            );

            if (user) {
                const payload = {
                    id: Date.now(),
                    username: user.username,
                    role: "user",
                    exp: Math.floor(Date.now() / 1000) + 60 * 60,
                };
                const secret = "my_frontend_secret";
                const token = jwt_encode(payload, secret);

                dispatch(login({ user, token }));
                localStorage.setItem("authData", JSON.stringify({ user, isAuthenticated: true, token }));

                setSnackbar({
                    open: true,
                    message: `Welcome ${user.username}`,
                    severity: "success",
                });

                setTimeout(() => {
                    navigate("/user/dashboard");
                }, 1000);
            } else {
                setSnackbar({
                    open: true,
                    message: "Invalid email or password.",
                    severity: "error",
                });
                generateCaptcha();
            }
        } catch (error) {
            console.error(error.message);
        }
    };


    if (isAuthenticated) {
        return <Navigate to="/user/dashboard" replace />;
    }

    return (
        <>
            <Box
                sx={{
                    height: "100vh",
                    backgroundImage: `url('/loginbg.avif')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    px: 1
                }}
            >
                <Card
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", lg: "row" },
                        alignItems: { xs: "center", lg: 'normal' },
                        height: { xs: "auto", lg: "60vh" },
                        width: { xs: "100vw", sm: "95%", md: "70%", lg: "60%" },
                        padding: 2
                    }}
                >
                    <CardMedia
                        component="img"
                        sx={{
                            width: { xs: "100%", lg: "50%" },
                            height: "auto",
                            objectFit: "contain"
                        }}
                        image="/loginsvg.svg"
                        alt="loginsvg"
                        loading="lazy"
                    />
                    <Divider orientation="vertical" flexItem sx={{ mx: 2, display: { xs: "none", lg: "block" } }} />
                    <CardContent sx={{ flex: 1, width: "100%" }}>
                        <Typography variant="h5" gutterBottom sx={{ mt: { lg: '10px' }, textAlign: 'center' }}>
                            Welcome Back
                        </Typography>
                        <Typography variant="body2" color="gray" sx={{ mt: '5px', textAlign: 'center' }}>
                            Please enter your details
                        </Typography>

                        <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
                            <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                helperText={error.email || ' '}
                                error={!!error.email}
                            />
                            <TextField
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                                helperText={error.password || ' '}
                                error={!!error.password}
                            />

                            {/* CAPTCHA */}
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{
                                    padding: '10px 20px',
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: '5px',
                                    fontWeight: 'bold',
                                    letterSpacing: '3px',
                                    fontSize: '20px',
                                    userSelect: 'none'
                                }}>
                                    {captcha}
                                </Box>
                                <Button variant="text" onClick={generateCaptcha}>Refresh</Button>
                            </Box>
                            <TextField
                                label="Enter CAPTCHA"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={userCaptchaInput}
                                onChange={(e) => setUserCaptchaInput(e.target.value)}
                                helperText={error.captcha || ' '}
                                error={!!error.captcha}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ mt: 2, height: '50px' }}
                            >
                                Login
                            </Button>

                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <Typography variant="body2">
                                    Don&apos;t have an account?{' '}
                                    <Link component={RouterLink} to="/signup">
                                        Sign up
                                    </Link>
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}

export default Login;
