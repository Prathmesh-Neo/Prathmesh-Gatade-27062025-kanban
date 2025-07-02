import { useState } from "react";
import {
    Box,
    Typography,
    Avatar,
    Menu,
    MenuItem,
    IconButton,
    Tooltip
} from "@mui/material";

function Navbar() {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("mockToken");
        localStorage.removeItem("authData");

        handleClose();
        window.location.href = "/login";
    };

    const user = JSON.parse(localStorage.getItem("authData"))

    return (
        <Box
            sx={{
                borderBottom: "1px solid #e0e0e0",
                boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
                px: 3,
                py: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#fff"
            }}
        >
            <Typography variant="h6" fontWeight="bold" color="primary">
                Kanban
            </Typography>

            <Tooltip title="Account settings">
                <IconButton onClick={handleAvatarClick} size="small">
                    <Avatar alt="User" src="/user.jpg" />
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 4,
                    sx: {
                        mt: 1.5,
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
                        "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0
                        }
                    }
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem onClick={handleClose}>{user?.user?.username}</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </Box>
    );
}

export default Navbar;
